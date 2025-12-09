--[[
    Project SY - HUD (DHTML)
    Liquid Glass / iOS 26 style rendered via HTML/CSS
]]

print("[Project SY] HUD Script Loading...")

-- Hide base HUD
local hide = {
    ["CHudHealth"] = true,
    ["CHudBattery"] = true,
    ["CHudAmmo"] = true,
    ["CHudSecondaryAmmo"] = true,
}

hook.Add("HUDShouldDraw", "ProjectSY_HideHUD", function(name)
    if hide[name] then return false end
end)

local htmlPanel
local htmlContent

-- If you want to load HUD from GitHub Pages (or any external host), set URL here.
-- Example: "https://<your-gh-user>.github.io/projectsy/hud.html"
-- Leave empty to use bundled local html/projectsy/hud.html
local HUD_REMOTE_URL = ""

local function js_safe(str)
    str = tostring(str or "")
    str = string.Replace(str, "\\", "\\\\")
    str = string.Replace(str, "'", "\\'")
    str = string.Replace(str, "\n", "\\n")
    str = string.Replace(str, "\r", "")
    return str
end

local function ensure_html()
    if htmlContent then return end
    htmlContent = file.Read("html/projectsy/hud.html", "GAME")
    if not htmlContent then
        htmlContent = [[<html><body style="background:rgba(0,0,0,0);color:#fff;font-family:Inter,sans-serif;">Project SY HUD missing (html/projectsy/hud.html)</body></html>]]
    end
end

local function create_panel()
    if IsValid(htmlPanel) then htmlPanel:Remove() end

    htmlPanel = vgui.Create("DHTML")
    htmlPanel:SetSize(ScrW(), ScrH())
    htmlPanel:SetPos(0, 0)
    htmlPanel:SetMouseInputEnabled(false)
    htmlPanel:SetKeyboardInputEnabled(false)
    htmlPanel:SetAllowLua(true)

    if HUD_REMOTE_URL ~= nil and HUD_REMOTE_URL ~= "" then
        htmlPanel:OpenURL(HUD_REMOTE_URL)
    else
        ensure_html()
        htmlPanel:SetHTML(htmlContent)
    end
    htmlPanel:SetMouseInputEnabled(false)
    htmlPanel:SetKeyboardInputEnabled(false)
end

local function resize_panel()
    if not IsValid(htmlPanel) then return end
    htmlPanel:SetSize(ScrW(), ScrH())
end

hook.Add("OnScreenSizeChanged", "ProjectSY_HUD_Resize", resize_panel)

-- Periodic data push
local function push_hud_state()
    if not IsValid(htmlPanel) then return end

    local ply = LocalPlayer()
    if not IsValid(ply) then return end

    local hp = math.max(ply:Health(), 0)
    local armor = math.max(ply:Armor(), 0)
    local maxHp = 100
    local maxArmor = 100

    local wep = ply:GetActiveWeapon()
    local clip, reserve, wname = -1, 0, ""
    if IsValid(wep) then
        clip = wep:Clip1()
        reserve = ply:GetAmmoCount(wep:GetPrimaryAmmoType())
        wname = wep:GetPrintName() or wep:GetClass() or ""
    end

    local ping = ply:Ping() or 0
    local fps = math.floor(1 / FrameTime())
    local stamina = ply:GetNWFloat("SprintStamina", 1)

    local dateStr = os.date("%d %b %Y"):upper()
    local timeStr = os.date("%H:%M")

    htmlPanel:Call(string.format("updatePlayer('%s');", js_safe(ply:Nick())))
    htmlPanel:Call(string.format("updateVitals(%d,%d,%d,%d);", hp, armor, maxHp, maxArmor))
    htmlPanel:Call(string.format("updateAmmo(%d,%d,'%s');", clip or -1, reserve or 0, js_safe(wname)))
    htmlPanel:Call(string.format("updatePerf(%d,%d);", ping, fps))
    htmlPanel:Call(string.format("updateStamina(%0.3f);", math.Clamp(stamina or 1, 0, 1)))
    htmlPanel:Call(string.format("updateClock('%s','%s');", js_safe(dateStr), js_safe(timeStr)))
end

timer.Create("ProjectSY_HUD_Update", 0.15, 0, function()
    if not IsValid(htmlPanel) then return end
    push_hud_state()
end)

-- Ensure panel exists
hook.Add("HUDPaint", "ProjectSY_HUD_DHTML_Bootstrap", function()
    if not IsValid(htmlPanel) then
        create_panel()
    end
end)

-- Console helpers
concommand.Add("projectsy_hud_reload", function()
    htmlContent = nil
    ensure_html()
    create_panel()
    push_hud_state()
end)

print("[Project SY] HUD Script Loaded!")

