--[[
    Project SY - HUD, Chat & Scoreboard
    iOS 26 Liquid Glass Style
]]

print("[Project SY] HUD Script Loading...")

local hudPanel = nil

-- Hide default HUD
local hide = {
    ["CHudHealth"] = true,
    ["CHudBattery"] = true,
    ["CHudAmmo"] = true,
    ["CHudSecondaryAmmo"] = true,
    ["CHudChat"] = true,
}

hook.Add("HUDShouldDraw", "ProjectSY_HideHUD", function(name)
    if hide[name] then return false end
end)

local HTML_CONTENT = [[
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; user-select: none; outline: none; }

body {
    background: transparent;
    width: 100vw; height: 100vh;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    color: white;
}

/* iOS 26 Liquid Glass */
.liquid-glass {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.liquid-glass-strong {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(60px);
    -webkit-backdrop-filter: blur(60px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
}

/* HUD Left Bottom */
#hud-container {
    position: absolute;
    bottom: 40px; left: 40px;
    display: flex; gap: 12px;
    align-items: flex-end;
    pointer-events: none;
}

.hud-pill {
    padding: 16px 20px;
    border-radius: 20px;
    display: flex; align-items: center; gap: 14px;
    min-width: 130px;
}

.icon-box {
    width: 44px; height: 44px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
}

.icon-box.red { 
    background: rgba(239, 68, 68, 0.15); 
    color: #EF4444; 
    border: 1px solid rgba(239, 68, 68, 0.2);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}

.icon-box.blue { 
    background: rgba(0, 122, 255, 0.15); 
    color: #007AFF; 
    border: 1px solid rgba(0, 122, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
}

.icon-box.gray { 
    background: rgba(255, 255, 255, 0.08); 
    color: #fff; 
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.hud-content { display: flex; flex-direction: column; }
.hud-val { 
    font-size: 26px; 
    font-weight: 800; 
    letter-spacing: -0.5px; 
    line-height: 1; 
    margin-bottom: 4px;
}
.hud-label { 
    font-size: 10px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: rgba(255,255,255,0.4); 
}

/* Ammo Right Bottom */
#ammo-container {
    position: absolute;
    bottom: 40px; right: 40px;
    display: flex; flex-direction: column; align-items: flex-end;
    pointer-events: none;
}

.ammo-pill {
    padding: 16px 24px;
    border-radius: 20px;
    display: flex; align-items: center; gap: 16px;
}

.ammo-text { display: flex; flex-direction: column; align-items: flex-end; }
.ammo-val { font-size: 32px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
.ammo-clip { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.4); margin-top: 4px; }

/* Chat */
#chat-container {
    position: absolute;
    top: 35%; left: 40px;
    width: 400px;
    display: flex; flex-direction: column; gap: 8px;
    pointer-events: none;
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 100%);
}

.chat-msg {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 12px 16px;
    border-radius: 16px;
    color: rgba(255,255,255,0.9);
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transition: opacity 0.5s, transform 0.3s;
}

.chat-msg.faded { opacity: 0; transform: translateX(-20px); }
.chat-name { font-weight: 700; margin-right: 8px; }

/* Scoreboard */
#scoreboard {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: 0; pointer-events: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
}

#scoreboard.visible { opacity: 1; pointer-events: auto; }

.sb-panel {
    width: 900px;
    max-width: 90%;
    max-height: 80vh;
    border-radius: 32px;
    display: flex; flex-direction: column;
    overflow: hidden;
    transform: scale(0.95) translateY(20px);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

#scoreboard.visible .sb-panel { transform: scale(1) translateY(0); }

.sb-header {
    padding: 28px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
}

.sb-title-group { display: flex; align-items: center; gap: 16px; }

.sb-logo-box {
    width: 56px; height: 56px;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
}

.sb-logo-box img { width: 100%; height: 100%; object-fit: cover; }

.sb-title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
.sb-subtitle { 
    font-size: 11px; 
    font-weight: 700; 
    color: #007AFF;
    text-transform: uppercase; 
    letter-spacing: 2px;
}

.sb-stats { display: flex; gap: 24px; }
.stat-item { text-align: right; }
.stat-val { font-size: 16px; font-weight: 700; color: #fff; }
.stat-lbl { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }

.sb-list {
    flex: 1; overflow-y: auto;
    padding: 16px;
    display: flex; flex-direction: column; gap: 6px;
}

.sb-list::-webkit-scrollbar { width: 4px; }
.sb-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.sb-row {
    display: grid; 
    grid-template-columns: 44px 2fr 1.5fr 2fr 70px;
    padding: 12px 20px;
    border-radius: 16px;
    background: rgba(255,255,255,0.02);
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.sb-row.head { 
    background: transparent; 
    padding: 0 20px 12px 20px;
    font-size: 10px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: rgba(255,255,255,0.3);
}

.sb-row:not(.head):hover { 
    background: rgba(255,255,255,0.05); 
    border-color: rgba(255,255,255,0.08);
}

.sb-avatar { 
    width: 36px; height: 36px; 
    border-radius: 12px; 
    background: rgba(255,255,255,0.1); 
    overflow: hidden; 
}

.sb-avatar img { width: 100%; height: 100%; object-fit: cover; }

.sb-name { font-weight: 700; font-size: 14px; }

.sb-rank-badge {
    padding: 6px 12px; 
    border-radius: 10px;
    background: rgba(255,255,255,0.06); 
    color: rgba(255,255,255,0.7);
    font-size: 11px; 
    font-weight: 600;
    width: fit-content;
}

.sb-rank-badge.owner { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
.sb-rank-badge.admin { background: rgba(0, 122, 255, 0.15); color: #93c5fd; }

.sb-job { color: rgba(255,255,255,0.5); font-weight: 500; font-size: 13px; }

.sb-ping { 
    text-align: right; 
    font-family: 'Inter', monospace; 
    font-size: 13px; 
    font-weight: 700; 
}

.ping-good { color: #34C759; }
.ping-bad { color: #FF9500; }

.sb-footer {
    padding: 16px;
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
    border-top: 1px solid rgba(255,255,255,0.04);
}

@keyframes slideIn { 
    from { opacity: 0; transform: translateX(-20px); } 
    to { opacity: 1; transform: translateX(0); } 
}
</style>
</head>
<body>

<!-- Chat -->
<div id="chat-container"></div>

<!-- HUD Left -->
<div id="hud-container">
    <div class="hud-pill liquid-glass">
        <div class="icon-box red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
        </div>
        <div class="hud-content">
            <div class="hud-val" id="hp-val">100</div>
            <div class="hud-label">Здоровье</div>
        </div>
    </div>
    
    <div class="hud-pill liquid-glass" id="armor-pill" style="display:none;">
        <div class="icon-box blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        </div>
        <div class="hud-content">
            <div class="hud-val" id="ar-val">0</div>
            <div class="hud-label">Броня</div>
        </div>
    </div>
</div>

<!-- Ammo Right -->
<div id="ammo-container">
    <div class="ammo-pill liquid-glass" id="ammo-pill" style="display:none;">
        <div class="ammo-text">
            <div class="ammo-val"><span id="am-clip">30</span></div>
            <div class="ammo-clip">/ <span id="am-res">90</span></div>
        </div>
        <div class="icon-box gray">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="8" rx="1" ry="1"></rect>
                <path d="M17 14v7"></path>
                <path d="M7 14v7"></path>
                <path d="M17 3v3"></path>
                <path d="M7 3v3"></path>
            </svg>
        </div>
    </div>
</div>

<!-- Scoreboard -->
<div id="scoreboard">
    <div class="sb-panel liquid-glass-strong">
        <div class="sb-header">
            <div class="sb-title-group">
                <div class="sb-logo-box">
                    <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg">
                </div>
                <div>
                    <div class="sb-title">Project SY</div>
                    <div class="sb-subtitle">Metrostroi NoRank</div>
                </div>
            </div>
            
            <div class="sb-stats">
                <div class="stat-item">
                    <div class="stat-val">Metrostroi</div>
                    <div class="stat-lbl">Режим</div>
                </div>
                <div class="stat-item">
                    <div class="stat-val">gm_mrl_v3</div>
                    <div class="stat-lbl">Карта</div>
                </div>
                <div class="stat-item">
                    <div class="stat-val"><span id="sb-count">0</span> / 60</div>
                    <div class="stat-lbl">Онлайн</div>
                </div>
            </div>
        </div>
        
        <div class="sb-list" id="sb-list">
            <div class="sb-row head">
                <div></div>
                <div>Игрок</div>
                <div>Ранг</div>
                <div>Профессия</div>
                <div style="text-align:right">Ping</div>
            </div>
        </div>
        
        <div class="sb-footer">
            Нажмите ПКМ для меню игрока
        </div>
    </div>
</div>

<script>
function updateHUD(hp, armor, ammo, clip, hasWep) {
    document.getElementById('hp-val').innerText = hp;
    
    var arPill = document.getElementById('armor-pill');
    if (armor > 0) {
        arPill.style.display = 'flex';
        document.getElementById('ar-val').innerText = armor;
    } else {
        arPill.style.display = 'none';
    }

    var amPill = document.getElementById('ammo-pill');
    if (hasWep == true || hasWep == 'true') {
        amPill.style.display = 'flex';
        if (clip >= 0) {
            document.getElementById('am-clip').innerText = clip;
            document.getElementById('am-res').innerText = ammo;
        } else {
            amPill.style.display = 'none';
        }
    } else {
        amPill.style.display = 'none';
    }
}

function addChat(name, text, r, g, b) {
    var c = document.getElementById('chat-container');
    var msg = document.createElement('div');
    msg.className = 'chat-msg';
    
    var nSpan = document.createElement('span');
    nSpan.className = 'chat-name';
    nSpan.style.color = 'rgb('+r+','+g+','+b+')';
    nSpan.innerText = name;
    
    msg.appendChild(nSpan);
    msg.appendChild(document.createTextNode(text));
    c.appendChild(msg);
    
    setTimeout(function() {
        msg.classList.add('faded');
        setTimeout(function() { if(msg.parentNode) msg.parentNode.removeChild(msg); }, 500);
    }, 12000);
    
    if (c.children.length > 7) c.removeChild(c.children[0]);
}

function setScoreboard(visible) {
    var sb = document.getElementById('scoreboard');
    if (visible) sb.classList.add('visible');
    else sb.classList.remove('visible');
}

function updateScoreboard(json) {
    var list = document.getElementById('sb-list');
    while (list.children.length > 1) {
        list.removeChild(list.lastChild);
    }
    
    try {
        var players = JSON.parse(json);
        document.getElementById('sb-count').innerText = players.length;
        
        players.forEach(function(p) {
            var row = document.createElement('div');
            row.className = 'sb-row';
            
            var av = document.createElement('div');
            av.className = 'sb-avatar';
            var img = document.createElement('img');
            img.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(p.name);
            av.appendChild(img);
            
            var name = document.createElement('div');
            name.className = 'sb-name';
            name.innerText = p.name;
            
            var rank = document.createElement('div');
            rank.className = 'sb-rank-badge';
            if(p.rank === 'superadmin') { rank.classList.add('owner'); rank.innerText = 'Создатель'; }
            else if(p.rank === 'admin') { rank.classList.add('admin'); rank.innerText = 'Админ'; }
            else { rank.innerText = 'Игрок'; }
            
            var job = document.createElement('div');
            job.className = 'sb-job';
            job.innerText = p.job || 'Безработный';
            
            var ping = document.createElement('div');
            ping.className = 'sb-ping ' + (p.ping < 50 ? 'ping-good' : 'ping-bad');
            ping.innerText = p.ping + 'ms';
            
            row.appendChild(av);
            row.appendChild(name);
            row.appendChild(rank);
            row.appendChild(job);
            row.appendChild(ping);
            
            list.appendChild(row);
        });
    } catch(e) { console.error(e); }
}
</script>
</body>
</html>
]]

local function CreateHUD()
    if IsValid(hudPanel) then hudPanel:Remove() end
    
    hudPanel = vgui.Create("DHTML")
    hudPanel:SetSize(ScrW(), ScrH())
    hudPanel:SetPos(0, 0)
    hudPanel:SetHTML(HTML_CONTENT)
    hudPanel:SetMouseInputEnabled(false)
    hudPanel:SetKeyboardInputEnabled(false)
    hudPanel:SetVisible(true)
    
    print("[Project SY] HUD Created")
end

hook.Add("InitPostEntity", "ProjectSY_InitHUD", function()
    timer.Simple(3, CreateHUD)
end)

hook.Add("OnReloaded", "ProjectSY_ReloadHUD", function()
    timer.Simple(1, CreateHUD)
end)

-- Update HUD
timer.Create("ProjectSY_HUDUpdate", 0.1, 0, function()
    if not IsValid(hudPanel) then return end
    
    local ply = LocalPlayer()
    if not IsValid(ply) or not ply:Alive() then return end
    
    local hp = ply:Health()
    local arm = ply:Armor()
    
    local wep = ply:GetActiveWeapon()
    local clip = -1
    local ammo = -1
    local hasWep = false
    
    if IsValid(wep) then
        hasWep = true
        clip = wep:Clip1()
        ammo = ply:GetAmmoCount(wep:GetPrimaryAmmoType())
    end
    
    hudPanel:Call("updateHUD("..hp..","..arm..","..ammo..","..clip..","..tostring(hasWep)..")")
end)

-- Scoreboard
hook.Add("ScoreboardShow", "ProjectSY_SBShow", function()
    if IsValid(hudPanel) then
        hudPanel:SetMouseInputEnabled(true)
        hudPanel:Call("setScoreboard(true)")
        
        local pList = {}
        for k, v in ipairs(player.GetAll()) do
            table.insert(pList, {
                name = v:Name(),
                ping = v:Ping(),
                rank = v:GetUserGroup(),
                job = v:getDarkRPVar and v:getDarkRPVar("job") or team.GetName(v:Team())
            })
        end
        
        local json = util.TableToJSON(pList)
        json = string.gsub(json, "'", "\\'")
        hudPanel:Call("updateScoreboard('"..json.."')")
    end
    return true
end)

hook.Add("ScoreboardHide", "ProjectSY_SBHide", function()
    if IsValid(hudPanel) then
        hudPanel:SetMouseInputEnabled(false)
        hudPanel:Call("setScoreboard(false)")
    end
end)

-- Chat
hook.Add("OnPlayerChat", "ProjectSY_ChatAdd", function(ply, text, teamChat, isDead)
    if IsValid(hudPanel) then
        local name = IsValid(ply) and ply:Name() or "Console"
        local col = IsValid(ply) and team.GetColor(ply:Team()) or Color(0,255,0)
        
        name = string.gsub(name, "'", "\\'")
        text = string.gsub(text, "'", "\\'")
        
        hudPanel:Call("addChat('"..name.."', '"..text.."', "..col.r..", "..col.g..", "..col.b..")")
    end
end)

concommand.Add("projectsy_refresh_hud", CreateHUD)

print("[Project SY] HUD Script Loaded")
