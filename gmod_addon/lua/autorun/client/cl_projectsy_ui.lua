--[[
    Project SY - Ingame UI
]]

local htmlPanel = nil

local function ShowUI()
    if IsValid(htmlPanel) then return end
    
    htmlPanel = vgui.Create("DHTML")
    htmlPanel:SetSize(ScrW(), ScrH())
    htmlPanel:SetPos(0, 0)
    -- ВСТАВЬ СЮДА ССЫЛКУ НА СВОЙ GITHUB PAGES
    -- Например: https://yourname.github.io/repo/gmod.html
    htmlPanel:OpenURL("https://neruk.github.io/project-sy-metro-portal/gmod.html")
    htmlPanel:MakePopup()
    htmlPanel:SetKeyboardInputEnabled(true)
    htmlPanel:SetMouseInputEnabled(true)
    
    -- Function to allow JS to spawn
    htmlPanel:AddFunction("gmod", "spawn", function(name)
        if IsValid(htmlPanel) then
            htmlPanel:Remove()
            htmlPanel = nil
        end
        net.Start("ProjectSY_SelectSpawn")
        net.WriteString(name)
        net.SendToServer()
    end)
end

local function CloseUI()
    if IsValid(htmlPanel) then
        htmlPanel:Remove()
        htmlPanel = nil
    end
end

hook.Add("InitPostEntity", "ProjectSY_Init", function()
    timer.Simple(2, ShowUI)
end)

concommand.Add("projectsy_ui", ShowUI)
concommand.Add("projectsy_close", CloseUI)

hook.Add("Think", "ProjectSY_Esc", function()
    if IsValid(htmlPanel) and input.IsKeyDown(KEY_ESCAPE) then
        CloseUI()
    end
end)
