--[[
    Project SY - HUD
    iOS 26 Liquid Glass Style
    Uses native Lua drawing (no DHTML)
]]

print("[Project SY] HUD Script Loading...")

-- Hide default HUD
local hide = {
    ["CHudHealth"] = true,
    ["CHudBattery"] = true,
    ["CHudAmmo"] = true,
    ["CHudSecondaryAmmo"] = true,
}

hook.Add("HUDShouldDraw", "ProjectSY_HideHUD", function(name)
    if hide[name] then return false end
end)

-- Colors
local colBg = Color(255, 255, 255, 10)
local colBorder = Color(255, 255, 255, 20)
local colWhite = Color(255, 255, 255, 255)
local colWhite70 = Color(255, 255, 255, 180)
local colWhite40 = Color(255, 255, 255, 100)
local colRed = Color(239, 68, 68, 255)
local colRedBg = Color(239, 68, 68, 40)
local colBlue = Color(0, 122, 255, 255)
local colBlueBg = Color(0, 122, 255, 40)
local colGreen = Color(52, 199, 89, 255)

-- Fonts
surface.CreateFont("ProjectSY_HUD_Big", {
    font = "Arial",
    size = 32,
    weight = 800,
})

surface.CreateFont("ProjectSY_HUD_Medium", {
    font = "Arial",
    size = 18,
    weight = 700,
})

surface.CreateFont("ProjectSY_HUD_Small", {
    font = "Arial",
    size = 12,
    weight = 600,
})

surface.CreateFont("ProjectSY_HUD_Time", {
    font = "Arial",
    size = 42,
    weight = 300,
})

surface.CreateFont("ProjectSY_HUD_Title", {
    font = "Arial",
    size = 18,
    weight = 800,
})

-- Draw rounded box with border
local function DrawGlassBox(x, y, w, h, radius)
    draw.RoundedBox(radius, x, y, w, h, colBg)
    surface.SetDrawColor(colBorder)
    surface.DrawOutlinedRect(x, y, w, h, 1)
end

-- Draw icon (simple shapes)
local function DrawHeartIcon(x, y, size)
    surface.SetDrawColor(colRed)
    draw.RoundedBox(size/4, x, y + size/4, size, size * 0.6, colRed)
    draw.RoundedBox(size/2, x, y, size/2, size/2, colRed)
    draw.RoundedBox(size/2, x + size/2, y, size/2, size/2, colRed)
end

local function DrawShieldIcon(x, y, size)
    surface.SetDrawColor(colBlue)
    draw.RoundedBox(4, x + size*0.1, y, size*0.8, size*0.7, colBlue)
    draw.NoTexture()
    surface.DrawPoly({
        {x = x + size*0.1, y = y + size*0.6},
        {x = x + size/2, y = y + size},
        {x = x + size*0.9, y = y + size*0.6},
    })
end

-- Main HUD Paint
hook.Add("HUDPaint", "ProjectSY_DrawHUD", function()
    local ply = LocalPlayer()
    if not IsValid(ply) or not ply:Alive() then return end
    
    local scrW, scrH = ScrW(), ScrH()
    local hp = ply:Health()
    local armor = ply:Armor()
    
    -- === LEFT BOTTOM - Health ===
    local hpX, hpY = 40, scrH - 100
    local hpW, hpH = 160, 60
    
    DrawGlassBox(hpX, hpY, hpW, hpH, 16)
    
    -- Health icon box
    draw.RoundedBox(10, hpX + 12, hpY + 10, 40, 40, colRedBg)
    surface.SetDrawColor(colRed)
    surface.SetMaterial(Material("icon16/heart.png"))
    surface.DrawTexturedRect(hpX + 22, hpY + 20, 20, 20)
    
    -- Health text
    draw.SimpleText(hp, "ProjectSY_HUD_Big", hpX + 65, hpY + 12, colWhite, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
    draw.SimpleText("ЗДОРОВЬЕ", "ProjectSY_HUD_Small", hpX + 65, hpY + 42, colWhite40, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
    
    -- === LEFT BOTTOM - Armor (if > 0) ===
    if armor > 0 then
        local arX = hpX + hpW + 12
        local arW = 160
        
        DrawGlassBox(arX, hpY, arW, hpH, 16)
        
        -- Armor icon box
        draw.RoundedBox(10, arX + 12, hpY + 10, 40, 40, colBlueBg)
        surface.SetDrawColor(colBlue)
        surface.SetMaterial(Material("icon16/shield.png"))
        surface.DrawTexturedRect(arX + 22, hpY + 20, 20, 20)
        
        -- Armor text
        draw.SimpleText(armor, "ProjectSY_HUD_Big", arX + 65, hpY + 12, colWhite, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
        draw.SimpleText("БРОНЯ", "ProjectSY_HUD_Small", arX + 65, hpY + 42, colWhite40, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
    end
    
    -- === RIGHT BOTTOM - Ammo ===
    local wep = ply:GetActiveWeapon()
    if IsValid(wep) then
        local clip = wep:Clip1()
        local ammo = ply:GetAmmoCount(wep:GetPrimaryAmmoType())
        
        if clip >= 0 then
            local amX = scrW - 200
            local amY = scrH - 100
            local amW = 160
            local amH = 60
            
            DrawGlassBox(amX, amY, amW, amH, 16)
            
            -- Ammo text
            draw.SimpleText(clip, "ProjectSY_HUD_Big", amX + 20, amY + 8, colWhite, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
            draw.SimpleText("/ " .. ammo, "ProjectSY_HUD_Medium", amX + 20, amY + 38, colWhite40, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
            
            -- Icon
            draw.RoundedBox(10, amX + amW - 52, amY + 10, 40, 40, Color(255,255,255,20))
            surface.SetDrawColor(colWhite70)
            surface.SetMaterial(Material("icon16/bullet_orange.png"))
            surface.DrawTexturedRect(amX + amW - 42, amY + 20, 20, 20)
        end
    end
    
    -- === TOP RIGHT - Logo & Time ===
    local logoX = scrW - 220
    local logoY = 40
    local logoW = 180
    local logoH = 50
    
    DrawGlassBox(logoX, logoY, logoW, logoH, 16)
    
    -- Logo text
    draw.SimpleText("Project SY", "ProjectSY_HUD_Title", logoX + 15, logoY + 10, colWhite, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
    draw.SimpleText("METROSTROI", "ProjectSY_HUD_Small", logoX + 15, logoY + 30, colBlue, TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP)
    
    -- Time below logo
    local timeStr = os.date("%H:%M")
    local dateStr = os.date("%d %b %Y")
    
    draw.SimpleText(dateStr:upper(), "ProjectSY_HUD_Small", scrW - 40, logoY + logoH + 20, colWhite40, TEXT_ALIGN_RIGHT, TEXT_ALIGN_TOP)
    draw.SimpleText(timeStr, "ProjectSY_HUD_Time", scrW - 40, logoY + logoH + 35, colWhite, TEXT_ALIGN_RIGHT, TEXT_ALIGN_TOP)
end)

print("[Project SY] HUD Script Loaded!")
