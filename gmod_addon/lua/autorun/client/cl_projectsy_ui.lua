--[[
    Project SY - HTML UI через DHTML
    Показывает твой дизайн после загрузки
]]

local htmlPanel = nil
local BASE_URL = "https://miumiv6-lg.github.io/projectsy/gmod_ingame/"

-- Создание HTML панели
local function ShowProjectSYUI()
    if IsValid(htmlPanel) then return end
    
    htmlPanel = vgui.Create("DHTML")
    htmlPanel:SetSize(ScrW(), ScrH())
    htmlPanel:SetPos(0, 0)
    htmlPanel:SetHTML("")
    htmlPanel:OpenURL(BASE_URL)
    htmlPanel:MakePopup()
    htmlPanel:SetKeyboardInputEnabled(true)
    htmlPanel:SetMouseInputEnabled(true)
    
    -- JavaScript функция для закрытия из HTML
    htmlPanel:AddFunction("gmod", "closeUI", function()
        if IsValid(htmlPanel) then
            htmlPanel:Remove()
            htmlPanel = nil
        end
    end)
    
    -- JavaScript функция для спавна
    htmlPanel:AddFunction("gmod", "spawn", function(spawnName)
        if IsValid(htmlPanel) then
            htmlPanel:Remove()
            htmlPanel = nil
        end
        
        net.Start("ProjectSY_SelectSpawn")
        net.WriteString(spawnName)
        net.SendToServer()
        
        notification.AddLegacy("Спавн: " .. spawnName, NOTIFY_GENERIC, 3)
    end)
end

-- Закрыть UI
local function CloseProjectSYUI()
    if IsValid(htmlPanel) then
        htmlPanel:Remove()
        htmlPanel = nil
    end
end

-- Показать при первом спавне
hook.Add("InitPostEntity", "ProjectSY_ShowUI", function()
    timer.Simple(1, function()
        ShowProjectSYUI()
    end)
end)

-- Консольные команды для теста
concommand.Add("projectsy_ui", ShowProjectSYUI)
concommand.Add("projectsy_close", CloseProjectSYUI)

-- ESC закрывает
hook.Add("Think", "ProjectSY_EscapeClose", function()
    if IsValid(htmlPanel) and input.IsKeyDown(KEY_ESCAPE) then
        CloseProjectSYUI()
    end
end)
