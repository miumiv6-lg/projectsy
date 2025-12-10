--[[
    Project SY - Server Spawn Handler
]]

util.AddNetworkString("ProjectSY_SelectSpawn")

-- Точки спавна (координаты нужно заменить на реальные с карты)
-- Используй команду getpos в консоли GMod чтобы узнать координаты
local SPAWN_POSITIONS = {
    ["depot"] = Vector(0, 0, 100),        -- ТЧ-1 Лихоборы
    ["tupik"] = Vector(1000, 0, 100),     -- Тупик Физтех
    ["lianozovo"] = Vector(2000, 0, 100), -- Ст. Лианозово
    ["fiztech"] = Vector(3000, 0, 100),   -- Ст. Физтех
    ["yahroma"] = Vector(4000, 0, 100),   -- Ст. Яхромская
}

-- Названия для сообщений
local SPAWN_NAMES = {
    ["depot"] = "ТЧ-1 «Лихоборы»",
    ["tupik"] = "Тупик ст. Физтех",
    ["lianozovo"] = "Ст. Лианозово",
    ["fiztech"] = "Ст. Физтех",
    ["yahroma"] = "Ст. Яхромская",
}

net.Receive("ProjectSY_SelectSpawn", function(len, ply)
    local spawnId = net.ReadString()
    
    local pos = SPAWN_POSITIONS[spawnId]
    local name = SPAWN_NAMES[spawnId] or spawnId
    
    if pos then
        ply:SetPos(pos)
        ply:PrintMessage(HUD_PRINTTALK, "[Project SY] Вы появились: " .. name)
        print("[Project SY] " .. ply:Nick() .. " spawned at " .. name)
    else
        -- Дефолтный спавн если ID не найден
        ply:PrintMessage(HUD_PRINTTALK, "[Project SY] Неизвестный спавн: " .. spawnId)
        print("[Project SY] Unknown spawn ID: " .. spawnId)
    end
end)

-- Отправляем клиентский скрипт игрокам
AddCSLuaFile("autorun/client/cl_projectsy_ui.lua")

print("[Project SY] Server spawn system loaded!")
