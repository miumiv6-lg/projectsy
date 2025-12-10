--[[
    Project SY - Ingame UI
    Loads external UI from GitHub Pages
]]

local htmlPanel = nil
local musicChannel = nil
local isClosing = false

-- Ссылка на ваш обновленный интерфейс
local UI_URL = "https://miumiv6-lg.github.io/projectsy/gmod_ingame/index.html"

local function PlayMusic()
    if musicChannel then return end
    -- Музыка теперь управляется внутри веб-страницы
end

local function CloseUI()
    if IsValid(htmlPanel) then
        htmlPanel:Remove()
        htmlPanel = nil
    end
    gui.EnableScreenClicker(false)
    hook.Remove("EntityEmitSound", "ProjectSY_MuteGame")
    isClosing = false
end

local function ShowUI()
    if IsValid(htmlPanel) then return end
    isClosing = false
    
    htmlPanel = vgui.Create("DHTML")
    htmlPanel:SetSize(ScrW(), ScrH())
    htmlPanel:SetPos(0, 0)
    htmlPanel:OpenURL(UI_URL) -- Загружаем внешний URL вместо HTML_CONTENT
    htmlPanel:MakePopup()
    htmlPanel:SetKeyboardInputEnabled(false)
    htmlPanel:SetMouseInputEnabled(true)
    
    -- Разрешаем кликать
    gui.EnableScreenClicker(true)
    
    -- Передаем статистику в веб-страницу
    timer.Create("ProjectSY_UpdateStats", 1, 0, function()
        if IsValid(htmlPanel) then
            local p = LocalPlayer():Ping()
            local f = math.floor(1 / FrameTime())
            -- Вызываем JS функцию updateStats внутри страницы
            htmlPanel:RunJavascript("if(window.updateStats) window.updateStats(" .. p .. "," .. f .. ");")
        else
            timer.Remove("ProjectSY_UpdateStats")
        end
    end)
    
    -- Обработка спавна от JS
    htmlPanel:AddFunction("gmod", "spawn", function(spawnId)
        if isClosing then return end
        isClosing = true
        net.Start("ProjectSY_SelectSpawn")
        net.WriteString(spawnId)
        net.SendToServer()
        CloseUI()
    end)
    
    -- Mute game sounds while in menu
    hook.Add("EntityEmitSound", "ProjectSY_MuteGame", function()
        return false
    end)
end

-- Block ESC
hook.Add("PreRender", "ProjectSY_BlockEsc", function()
    if IsValid(htmlPanel) and input.IsKeyDown(KEY_ESCAPE) then
        gui.HideGameUI()
        return true
    end
end)

hook.Add("PreDrawHalos", "ProjectSY_NoMenu", function()
    if IsValid(htmlPanel) and gui.IsGameUIVisible() then
        gui.HideGameUI()
    end
end)

-- Init
hook.Add("InitPostEntity", "ProjectSY_ShowUI", function()
    timer.Simple(2, ShowUI)
end)

concommand.Add("projectsy_ui", ShowUI)
concommand.Add("projectsy_close", CloseUI)

print("[Project SY] External UI Script Loaded")
