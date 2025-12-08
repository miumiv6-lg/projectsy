--[[
    Project SY - Server Spawn Handler
]]

util.AddNetworkString("ProjectSY_SelectSpawn")

-- Точки спавна (координаты нужно заменить на реальные с карты)
local SPAWN_POSITIONS = {
    ["ТЧ-1 «Лихоборы»"] = Vector(0, 0, 100),
    ["Тупик ст. Физтех"] = Vector(1000, 0, 100),
    ["Ст. Лианозово"] = Vector(2000, 0, 100),
    ["Ст. Физтех"] = Vector(3000, 0, 100),
    ["Ст. Яхромская"] = Vector(4000, 0, 100),
}

net.Receive("ProjectSY_SelectSpawn", function(len, ply)
    local spawnName = net.ReadString()
    local spawnPos = net.ReadVector()
    
    -- Проверяем есть ли такая точка
    local pos = SPAWN_POSITIONS[spawnName]
    if pos then
        ply:SetPos(pos)
        ply:PrintMessage(HUD_PRINTTALK, "[Project SY] Вы появились: " .. spawnName)
    else
        -- Используем переданную позицию
        ply:SetPos(spawnPos)
        ply:PrintMessage(HUD_PRINTTALK, "[Project SY] Спавн: " .. spawnName)
    end
end)

-- Отправляем клиентский скрипт
AddCSLuaFile("autorun/client/cl_projectsy_ui.lua")

print("[Project SY] Spawn system loaded!")
