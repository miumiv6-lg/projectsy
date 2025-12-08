--[[
    Project SY - Server-Side Spawn Manager
    Handles spawn point registration and player spawning
]]

local ProjectSY = ProjectSY or {}
ProjectSY.Spawns = ProjectSY.Spawns or {}

-- ==========================================================================
-- SPAWN POINTS CONFIGURATION
-- ==========================================================================

-- Default spawn points (can be overridden per map)
ProjectSY.Spawns.Points = {
    [1] = {
        id = 1,
        title = "ТЧ-1 «Лихоборы»",
        desc = "Электродепо. Спавн составов.",
        type = "driver",
        pos = Vector(0, 0, 0), -- Set actual position
        ang = Angle(0, 0, 0)
    },
    [2] = {
        id = 2,
        title = "Тупик ст. Физтех",
        desc = "Оборотный тупик. Смена кабины.",
        type = "driver",
        pos = Vector(0, 0, 0),
        ang = Angle(0, 0, 0)
    },
    [3] = {
        id = 3,
        title = "Ст. Лианозово",
        desc = "Пассажирская платформа",
        type = "passenger",
        pos = Vector(0, 0, 0),
        ang = Angle(0, 0, 0)
    },
    [4] = {
        id = 4,
        title = "Ст. Физтех",
        desc = "Конечная станция",
        type = "passenger",
        pos = Vector(0, 0, 0),
        ang = Angle(0, 0, 0)
    },
    [5] = {
        id = 5,
        title = "Ст. Яхромская",
        desc = "Пассажирская платформа",
        type = "passenger",
        pos = Vector(0, 0, 0),
        ang = Angle(0, 0, 0)
    }
}

-- ==========================================================================
-- NETWORK STRINGS
-- ==========================================================================

util.AddNetworkString("ProjectSY_RequestSpawn")
util.AddNetworkString("ProjectSY_ShowSpawnSelection")
util.AddNetworkString("ProjectSY_HideUI")
util.AddNetworkString("ProjectSY_UpdatePlayerData")

-- ==========================================================================
-- SPAWN FUNCTIONS
-- ==========================================================================

function ProjectSY.Spawns.GetPoint(id)
    return ProjectSY.Spawns.Points[id]
end

function ProjectSY.Spawns.SpawnPlayer(ply, spawnId)
    local spawn = ProjectSY.Spawns.GetPoint(spawnId)
    
    if not spawn then
        print("[ProjectSY] Invalid spawn ID:", spawnId)
        return false
    end
    
    -- Set player position
    ply:SetPos(spawn.pos)
    ply:SetEyeAngles(spawn.ang)
    
    -- Set player status
    ply:SetNWString("status", "На станции: " .. spawn.title)
    
    -- Hide UI
    net.Start("ProjectSY_HideUI")
    net.Send(ply)
    
    -- Hook for custom logic
    hook.Run("ProjectSY_PlayerSpawned", ply, spawn)
    
    print("[ProjectSY] Player", ply:Nick(), "spawned at", spawn.title)
    return true
end

function ProjectSY.Spawns.ShowSelection(ply)
    net.Start("ProjectSY_ShowSpawnSelection")
    net.Send(ply)
end

-- ==========================================================================
-- PLAYER DATA
-- ==========================================================================

function ProjectSY.UpdatePlayerData(ply)
    -- Get player data (customize for your system)
    local data = {
        name = ply:Nick(),
        rank = ply:GetNWString("rank", "Игрок"),
        rankTitle = ply:GetNWString("rankTitle", "Новичок"),
        balance = ply:GetNWInt("balance", 0) .. " ₽",
        playTime = string.format("%.1f ч", (ply:GetNWInt("playTime", 0) / 3600))
    }
    
    net.Start("ProjectSY_UpdatePlayerData")
    net.WriteTable(data)
    net.Send(ply)
end

-- ==========================================================================
-- NETWORK HANDLERS
-- ==========================================================================

net.Receive("ProjectSY_RequestSpawn", function(len, ply)
    local spawnId = net.ReadUInt(8)
    
    print("[ProjectSY] Spawn request from", ply:Nick(), "- ID:", spawnId)
    
    -- Validate and spawn
    if ProjectSY.Spawns.SpawnPlayer(ply, spawnId) then
        -- Update player data
        ProjectSY.UpdatePlayerData(ply)
    end
end)

-- ==========================================================================
-- HOOKS
-- ==========================================================================

-- Show spawn selection on player initial spawn
hook.Add("PlayerInitialSpawn", "ProjectSY_InitialSpawn", function(ply)
    -- Wait for client to fully load
    timer.Simple(1, function()
        if IsValid(ply) then
            ProjectSY.UpdatePlayerData(ply)
            ProjectSY.Spawns.ShowSelection(ply)
        end
    end)
end)

-- Show spawn selection on respawn (optional)
hook.Add("PlayerSpawn", "ProjectSY_Respawn", function(ply)
    -- Only show if player has no spawn point set
    if not ply:GetNWBool("hasSpawned", false) then
        timer.Simple(0.1, function()
            if IsValid(ply) then
                ProjectSY.Spawns.ShowSelection(ply)
            end
        end)
    end
end)

-- Mark player as spawned after first spawn
hook.Add("ProjectSY_PlayerSpawned", "ProjectSY_MarkSpawned", function(ply, spawn)
    ply:SetNWBool("hasSpawned", true)
end)

-- Reset spawn flag on disconnect
hook.Add("PlayerDisconnected", "ProjectSY_ResetSpawn", function(ply)
    -- Nothing needed, NW vars are cleared automatically
end)

-- ==========================================================================
-- ADMIN COMMANDS
-- ==========================================================================

concommand.Add("projectsy_setspawn", function(ply, cmd, args)
    if not ply:IsSuperAdmin() then
        ply:ChatPrint("[ProjectSY] You don't have permission to use this command.")
        return
    end
    
    local id = tonumber(args[1])
    if not id or not ProjectSY.Spawns.Points[id] then
        ply:ChatPrint("[ProjectSY] Usage: projectsy_setspawn <id>")
        ply:ChatPrint("[ProjectSY] Sets spawn point position to your current location.")
        return
    end
    
    ProjectSY.Spawns.Points[id].pos = ply:GetPos()
    ProjectSY.Spawns.Points[id].ang = ply:EyeAngles()
    
    ply:ChatPrint("[ProjectSY] Spawn #" .. id .. " set to your position.")
    print("[ProjectSY] Spawn", id, "updated by", ply:Nick())
end)

concommand.Add("projectsy_listspawns", function(ply, cmd, args)
    if not ply:IsAdmin() then return end
    
    print("[ProjectSY] Spawn Points:")
    for id, spawn in pairs(ProjectSY.Spawns.Points) do
        print(string.format("  #%d: %s (%s) - %s", id, spawn.title, spawn.type, tostring(spawn.pos)))
    end
end)

-- ==========================================================================
-- MAP-SPECIFIC SPAWNS
-- ==========================================================================

-- Load spawn positions for current map
hook.Add("Initialize", "ProjectSY_LoadMapSpawns", function()
    local mapName = game.GetMap()
    local spawnFile = "projectsy/spawns/" .. mapName .. ".json"
    
    if file.Exists(spawnFile, "DATA") then
        local data = file.Read(spawnFile, "DATA")
        local spawns = util.JSONToTable(data)
        
        if spawns then
            for id, pos in pairs(spawns) do
                if ProjectSY.Spawns.Points[tonumber(id)] then
                    ProjectSY.Spawns.Points[tonumber(id)].pos = Vector(pos.x, pos.y, pos.z)
                    ProjectSY.Spawns.Points[tonumber(id)].ang = Angle(pos.pitch or 0, pos.yaw or 0, 0)
                end
            end
            print("[ProjectSY] Loaded spawn points for", mapName)
        end
    else
        print("[ProjectSY] No custom spawn file for", mapName, "- using defaults")
    end
end)

-- Save spawn positions
concommand.Add("projectsy_savespawns", function(ply, cmd, args)
    if not ply:IsSuperAdmin() then return end
    
    local mapName = game.GetMap()
    local spawns = {}
    
    for id, spawn in pairs(ProjectSY.Spawns.Points) do
        spawns[tostring(id)] = {
            x = spawn.pos.x,
            y = spawn.pos.y,
            z = spawn.pos.z,
            pitch = spawn.ang.p,
            yaw = spawn.ang.y
        }
    end
    
    file.CreateDir("projectsy/spawns")
    file.Write("projectsy/spawns/" .. mapName .. ".json", util.TableToJSON(spawns, true))
    
    ply:ChatPrint("[ProjectSY] Spawn positions saved for " .. mapName)
end)

-- Make globally available
_G.ProjectSY = ProjectSY

print("[ProjectSY] Server spawns loaded")
