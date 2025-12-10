--[[
    Project SY - HUD, Chat, Scoreboard & F2 Menu
    Liquid Glass / iOS 26 style - High Contrast & MSK Time
]]

print("[Project SY] HUD Script Loading...")

local hudPanel = nil
local f2Open = false
local nextF2Press = 0

local hide = {
	["CHudHealth"] = true,
	["CHudBattery"] = true,
	["CHudAmmo"] = true,
	["CHudSecondaryAmmo"] = true,
    ["CHudChat"] = true,
}

hook.Add("HUDShouldDraw", "ProjectSY_HideHUD", function(name)
	if (hide[name]) then return false end
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

/* --- LIQUID GLASS UTILS --- */
.glass {
    background: rgba(18, 18, 20, 0.85); 
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7); 
}

.glass-panel {
    background: rgba(22, 22, 24, 0.95);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);
}

/* --- TOP RIGHT WATERMARK --- */
#hud-top-right {
    position: absolute;
    top: 40px; right: 40px;
    display: flex; gap: 16px;
    align-items: center;
    padding: 12px 20px;
    border-radius: 20px;
    pointer-events: none;
}
.tr-logo { width: 42px; height: 42px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.tr-content { text-align: right; }
.tr-title { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; }
.tr-sub { font-size: 11px; font-weight: 700; color: #007AFF; text-transform: uppercase; letter-spacing: 1px; }

.tr-clock { 
    display: flex; flex-direction: column; align-items: flex-end; justify-content: center;
    margin-left: 16px; border-left: 1px solid rgba(255,255,255,0.2); padding-left: 16px; 
}
.tr-time-val { font-size: 24px; font-weight: 400; line-height: 1; margin-bottom: 2px; }
.tr-date-val { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }

/* --- HUD (Left Bottom) --- */
#hud-container {
    position: absolute; bottom: 40px; left: 40px;
    display: flex; gap: 16px; align-items: flex-end; pointer-events: none;
}
.hud-pill {
    padding: 16px 24px; border-radius: 24px;
    display: flex; align-items: center; gap: 16px;
    min-width: 140px; transition: transform 0.2s;
}
.icon-box {
    width: 42px; height: 42px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.icon-box.red { background: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); }
.icon-box.blue { background: rgba(59, 130, 246, 0.2); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.3); }
.hud-content { display: flex; flex-direction: column; }
.hud-val { font-size: 28px; font-weight: 800; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.hud-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.6); }

/* --- AMMO (Right Bottom) --- */
#ammo-container {
    position: absolute; bottom: 40px; right: 40px; text-align: right; pointer-events: none;
}
.ammo-pill { padding: 16px 28px; border-radius: 24px; display: flex; align-items: center; gap: 20px; }
.ammo-text { display: flex; flex-direction: column; align-items: flex-end; }
.ammo-val { font-size: 36px; font-weight: 800; line-height: 1; }
.ammo-clip { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.4); margin-top: 2px; }

/* --- CHAT --- */
#chat-container {
    position: absolute; top: 35%; left: 40px; width: 420px;
    display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 100%);
}
.chat-msg {
    background: rgba(20, 20, 20, 0.85); 
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 18px; border-radius: 18px;
    color: #dedede; font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transition: opacity 0.5s, transform 0.3s;
}
.chat-msg.faded { opacity: 0; transform: scale(0.95); }
.chat-name { font-weight: 700; margin-right: 8px; }

/* --- F2 MENU --- */
#f2-menu {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(12px);
    z-index: 2000;
    display: none; 
    align-items: center; justify-content: center;
}
#f2-menu.visible { display: flex; pointer-events: auto; }

.f2-window {
    width: 900px; height: 600px;
    border-radius: 32px;
    display: flex;
    overflow: hidden;
    animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* F2 Sidebar */
.f2-sidebar {
    width: 240px;
    background: rgba(0,0,0,0.3);
    border-right: 1px solid rgba(255,255,255,0.05);
    padding: 24px;
    display: flex; flex-direction: column; gap: 8px;
}
.f2-btn {
    padding: 14px 18px;
    border-radius: 16px;
    color: rgba(255,255,255,0.6);
    font-size: 14px; font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    display: flex; align-items: center; gap: 12px;
}
.f2-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
.f2-btn.active { background: #007AFF; color: #fff; box-shadow: 0 4px 16px rgba(0,122,255,0.4); }

/* F2 Content */
.f2-content { flex: 1; padding: 32px; overflow-y: auto; position: relative; }
.f2-section { display: none; animation: fadeIn 0.3s ease-out; }
.f2-section.active { display: block; }
.f2-h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
.f2-p { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 24px; }

.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.info-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 20px; border-radius: 20px;
}
.ic-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; margin-bottom: 4px; }
.ic-val { font-size: 16px; font-weight: 600; color: #fff; }

/* --- SCOREBOARD --- */
#scoreboard { 
    position: absolute; inset: 0; z-index: 1000; 
    display: flex; align-items: center; justify-content: center; 
    display: none;
}
#scoreboard.visible { display: flex; pointer-events: auto; }
.sb-inner { width: 900px; height: 600px; border-radius: 32px; padding: 32px; animation: popIn 0.2s; }

@keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

</style>
</head>
<body>

<!-- TOP RIGHT WATERMARK -->
<div id="hud-top-right" class="glass">
    <div class="tr-logo"><img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" style="width:100%;height:100%;"></div>
    <div class="tr-content">
        <div class="tr-title">Project SY</div>
        <div class="tr-sub">Metrostroi NoRank</div>
    </div>
    <div class="tr-clock">
        <div class="tr-time-val" id="time-val">00:00</div>
        <div class="tr-date-val" id="date-val">...</div>
    </div>
</div>

<!-- CHAT -->
<div id="chat-container"></div>

<!-- HUD -->
<div id="hud-container">
    <div class="hud-pill glass">
        <div class="icon-box red">+</div>
        <div class="hud-content"><div class="hud-val" id="hp-val">100</div><div class="hud-label">Здоровье</div></div>
    </div>
    <div class="hud-pill glass" id="armor-pill" style="display:none;">
        <div class="icon-box blue">🛡</div>
        <div class="hud-content"><div class="hud-val" id="ar-val">0</div><div class="hud-label">Броня</div></div>
    </div>
</div>

<!-- AMMO -->
<div id="ammo-container">
    <div class="ammo-pill glass" id="ammo-pill" style="display:none;">
        <div class="ammo-text"><div class="ammo-val"><span id="am-clip">30</span></div><div class="ammo-clip">/ <span id="am-res">90</span></div></div>
    </div>
</div>

<!-- F2 MENU -->
<div id="f2-menu">
    <div class="f2-window glass-panel">
        <div class="f2-sidebar">
            <div class="f2-btn active" onclick="f2Tab('char', this)">👤 Персонаж</div>
            <div class="f2-btn" onclick="f2Tab('settings', this)">⚙️ Настройки</div>
            <div class="f2-btn" onclick="f2Tab('rules', this)">📜 Правила</div>
            <div class="f2-btn" onclick="f2Tab('don', this)">💎 Донат</div>
        </div>
        <div class="f2-content">
            <!-- Char Section -->
            <div id="sec-char" class="f2-section active">
                <div class="f2-h1">Ваш персонаж</div>
                <div class="f2-p">Информация о текущем статусе</div>
                <div class="card-grid">
                    <div class="info-card"><div class="ic-label">Имя</div><div class="ic-val" id="f2-name">...</div></div>
                    <div class="info-card"><div class="ic-label">Работа</div><div class="ic-val" id="f2-job">...</div></div>
                    <div class="info-card"><div class="ic-label">Ранг</div><div class="ic-val" id="f2-rank">...</div></div>
                    <div class="info-card"><div class="ic-label">Баланс</div><div class="ic-val" id="f2-money">...</div></div>
                </div>
            </div>
            <!-- Settings Section -->
            <div id="sec-settings" class="f2-section">
                <div class="f2-h1">Настройки</div>
                <div class="f2-p">Настройки интерфейса</div>
                <div class="info-card">
                     <div class="ic-label">Громкость</div>
                     <input type="range" style="width:100%; margin-top:8px;">
                </div>
            </div>
            <!-- Rules Section -->
            <div id="sec-rules" class="f2-section">
                <div class="f2-h1">Правила</div>
                <p>1. Не нарушать законы физики метро.</p>
                <p>2. Слушать диспетчера.</p>
            </div>
            <!-- Donate Section -->
            <div id="sec-don" class="f2-section">
                <div class="f2-h1">Магазин</div>
                <div class="f2-p">Поддержите проект</div>
                <button class="f2-btn active" style="justify-content:center;">Открыть сайт</button>
            </div>
        </div>
    </div>
</div>

<!-- SCOREBOARD -->
<div id="scoreboard"><div class="sb-inner glass-panel"><h1 style="text-align:center;margin-top:200px;">Scoreboard (Tab to Close)</h1></div></div>

<script>
// CLOCK (MSK UTC+3)
var mNames = ['ЯНВ','ФЕВ','МАР','АПР','МАЯ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'];
function updClock() {
    var now = new Date();
    // Get UTC time
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Add 3 hours for MSK
    var msk = new Date(utc + (3600000 * 3));
    
    document.getElementById('time-val').innerText = ('0'+msk.getHours()).slice(-2)+':'+('0'+msk.getMinutes()).slice(-2);
    document.getElementById('date-val').innerText = ('0'+msk.getDate()).slice(-2) + ' ' + mNames[msk.getMonth()];
}
setInterval(updClock, 1000); updClock();

// HUD
function updateHUD(hp, armor, ammo, clip, hasWep) {
    document.getElementById('hp-val').innerText = hp;
    document.getElementById('armor-pill').style.display = (armor > 0) ? 'flex' : 'none';
    if(armor > 0) document.getElementById('ar-val').innerText = armor;
    
    var amPill = document.getElementById('ammo-pill');
    if (hasWep == true) {
        amPill.style.display = (clip >= 0) ? 'flex' : 'none';
        document.getElementById('am-clip').innerText = clip;
        document.getElementById('am-res').innerText = ammo;
    } else {
        amPill.style.display = 'none';
    }
}

// CHAT
function addChat(name, text, r, g, b) {
    var c = document.getElementById('chat-container');
    var msg = document.createElement('div');
    msg.className = 'chat-msg';
    msg.innerHTML = '<span class="chat-name" style="color:rgb('+r+','+g+','+b+')">'+name+'</span> ' + text;
    c.appendChild(msg);
    setTimeout(() => { msg.classList.add('faded'); setTimeout(()=>msg.remove(), 500); }, 10000);
}

// F2 LOGIC
function toggleF2(viz, name, job, money, rank) {
    var m = document.getElementById('f2-menu');
    if(viz) {
        m.classList.add('visible');
        document.getElementById('f2-name').innerText = name;
        document.getElementById('f2-job').innerText = job;
        document.getElementById('f2-money').innerText = money + ' ₽';
        document.getElementById('f2-rank').innerText = rank;
    } else {
        m.classList.remove('visible');
    }
}
function f2Tab(id, el) {
    var btns = document.getElementsByClassName('f2-btn');
    for(var i=0; i<btns.length; i++) btns[i].classList.remove('active');
    el.classList.add('active');
    var secs = document.getElementsByClassName('f2-section');
    for(var i=0; i<secs.length; i++) secs[i].classList.remove('active');
    document.getElementById('sec-'+id).classList.add('active');
}

// SCOREBOARD
function toggleSB(viz) {
    var s = document.getElementById('scoreboard');
    if(viz) s.classList.add('visible'); else s.classList.remove('visible');
}
</script>
</body>
</html>
]]

local function CreateHUD()
    if IsValid(hudPanel) then hudPanel:Remove() end
    f2Open = false -- Reset F2 state. Important because panel is gone.
    
    hudPanel = vgui.Create("DHTML")
    hudPanel:SetSize(ScrW(), ScrH())
    hudPanel:SetPos(0, 0)
    hudPanel:SetHTML(HTML_CONTENT)
    hudPanel:SetMouseInputEnabled(false)
    hudPanel:SetKeyboardInputEnabled(false)
    print("[Project SY] HUD Created/Reloaded")
end

-- Force Logic: Bypass Gamemode hooks
local function ToggleF2_Force()
    if not IsValid(hudPanel) then 
        print("[Project SY] F2 Error: Panel Invalid -> Recreating")
        CreateHUD()
        return 
    end
    
    f2Open = not f2Open
    print("[Project SY] F2 Toggled (Force): "..tostring(f2Open))
    
    local ply = LocalPlayer()
    local name = string.Replace(ply:Name(), "'", "\\'")
    local job = "Безработный"
    local money = 0
    local rank = ply:GetUserGroup() or "user"
    
    -- Try DarkRP vars
    if ply.getDarkRPVar then
        job = ply:getDarkRPVar("job") or job
        money = ply:getDarkRPVar("money") or 0
    end
    
    hudPanel:SetMouseInputEnabled(f2Open)
    hudPanel:SetKeyboardInputEnabled(f2Open)
    
    hudPanel:Call("toggleF2("..tostring(f2Open)..",'"..name.."','"..job.."',"..money..",'"..rank.."')")
end

concommand.Add("projectsy_f2", ToggleF2_Force)

hook.Add("Think", "ProjectSY_F2_Listener", function()
    -- Only check every frame if we have to.
    -- KEY_F2 is 93
    if input.IsKeyDown(KEY_F2) then
        if CurTime() > nextF2Press then
            nextF2Press = CurTime() + 0.4 -- Debounce
            ToggleF2_Force()
        end
    end
end)

hook.Add("InitPostEntity", "ProjectSY_InitHUD", function() timer.Simple(3, CreateHUD) end)
hook.Add("OnReloaded", "ProjectSY_ReloadHUD", function() timer.Simple(1, CreateHUD) end)
concommand.Add("projectsy_refresh_hud", CreateHUD)

-- UPDATE HUD LOOP
timer.Create("ProjectSY_HUDUpdate", 0.1, 0, function()
    if not IsValid(hudPanel) then return end
    local ply = LocalPlayer()
    if not IsValid(ply) then return end
    
    local hp = ply:Health()
    local arm = ply:Armor()
    local wep = ply:GetActiveWeapon()
    local clip, ammo = -1, -1
    local hasWep = false
    
    if IsValid(wep) then
        hasWep = true
        clip = wep:Clip1()
        ammo = ply:GetAmmoCount(wep:GetPrimaryAmmoType())
    end
    
    hudPanel:Call("updateHUD("..hp..","..arm..","..ammo..","..clip..","..tostring(hasWep)..")")
end)

-- CHAT HOOK
hook.Add("OnPlayerChat", "ProjectSY_Chat", function(ply, text)
    if IsValid(hudPanel) then
        local name = IsValid(ply) and ply:Name() or "Console"
        local col = IsValid(ply) and team.GetColor(ply:Team()) or Color(0,255,0)
        name = string.Replace(name, "'", "\\'")
        text = string.Replace(text, "'", "\\'")
        hudPanel:Call("addChat('"..name.."','"..text.."',"..col.r..","..col.g..","..col.b..")")
    end
end)

-- SCOREBOARD HOOK
hook.Add("ScoreboardShow", "ProjectSY_SBShow", function()
    if IsValid(hudPanel) then
        hudPanel:SetMouseInputEnabled(true)
        hudPanel:Call("toggleSB(true)")
    end
    return true
end)
hook.Add("ScoreboardHide", "ProjectSY_SBHide", function()
    if IsValid(hudPanel) then
        hudPanel:SetMouseInputEnabled(false)
        hudPanel:Call("toggleSB(false)")
    end
end)
