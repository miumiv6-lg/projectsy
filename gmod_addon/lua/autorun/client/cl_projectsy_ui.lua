--[[
    Project SY - Ingame UI
    Loads external UI from GitHub Pages
]]

local htmlPanel = nil
local isClosing = false
local isMenuInteractive = false -- Флаг: можно ли кликать мышкой в меню (выбор спавна)

-- Ссылка на ваш обновленный интерфейс
local UI_URL = "https://miumiv6-lg.github.io/projectsy/gmod_ingame/index.html"

local function CloseUI()
    if IsValid(htmlPanel) then
        htmlPanel:Remove()
        htmlPanel = nil
    end
    gui.EnableScreenClicker(false)
    isClosing = false
    isMenuInteractive = false
    hook.Remove("CreateMove", "ProjectSY_CatchAttack") -- Удаляем хук клика
end

local function EnableInteraction()
    if not IsValid(htmlPanel) then return end
    
    isMenuInteractive = true
    gui.EnableScreenClicker(true) -- Включаем системный курсор GMod
    
    -- Сообщаем HTML, что пора переходить к выбору спавна (эмуляция клика по "Нажмите ЛКМ")
    htmlPanel:RunJavascript("if(window.goToSpawnSelect) window.goToSpawnSelect();")
end

local function ShowUI()
    if IsValid(htmlPanel) then return end
    isClosing = false
    isMenuInteractive = false
    
    -- Создаем панель на весь экран
    htmlPanel = vgui.Create("DHTML")
    -- Используем SetSize вместо Dock, чтобы точно перекрыть всё
    htmlPanel:SetSize(ScrW(), ScrH()) 
    htmlPanel:SetPos(0, 0)
    htmlPanel:OpenURL(UI_URL)
    htmlPanel:MakePopup()
    
    -- ОТКЛЮЧАЕМ ввод клавиатуры и мыши изначально!
    -- Мы хотим, чтобы игрок нажал ЛКМ "в игре", а не в браузере.
    htmlPanel:SetKeyboardInputEnabled(false)
    htmlPanel:SetMouseInputEnabled(false) 
    
    -- Курсор НЕ показываем (EnableScreenClicker(false) по дефолту)
    -- Таким образом, на экране "Нажмите ЛКМ" курсора не будет.
    
    -- Хук для отлова нажатия ЛКМ
    hook.Add("CreateMove", "ProjectSY_CatchAttack", function(cmd)
        if not IsValid(htmlPanel) then return end
        if isMenuInteractive then return end -- Если уже в меню спавна, не трогаем
        
        -- Если нажата кнопка атаки (ЛКМ)
        if cmd:KeyDown(IN_ATTACK) then
            -- Сбрасываем нажатие, чтобы не стрелять
            cmd:RemoveKey(IN_ATTACK)
            
            -- Переходим в интерактивный режим
            EnableInteraction()
            
            -- Включаем ввод в HTML панель
            htmlPanel:SetMouseInputEnabled(true)
        end
    end)
    
    -- Передаем статистику в веб-страницу
    timer.Create("ProjectSY_UpdateStats", 1, 0, function()
        if IsValid(htmlPanel) then
            local p = LocalPlayer():Ping()
            local f = math.floor(1 / FrameTime())
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
end

-- Убираем обводки (Paint хук для DHTML не всегда нужен, но для контейнера может помочь)
-- DHTML обычно не имеет обводок, если размер правильный. 
-- Проблема "обводок" в GMod часто связана с тем, что HTML элемент имеет margin/padding.

-- Блокируем ESC
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

print("[Project SY] External UI Script Loaded (Cursor Fix)")
