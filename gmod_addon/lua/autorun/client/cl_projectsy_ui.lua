--[[
    Project SY - Ingame UI
    iOS 26 Liquid Glass Style
]]

local htmlPanel = nil
local musicChannel = nil
local isClosing = false

local HTML_CONTENT = [[
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; outline: none !important; user-select: none; }

html, body {
    width: 100%; height: 100%;
    overflow: hidden;
    background: #000;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
}

/* Background */
#bg {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: url('https://i.ibb.co/sdFN8VZh/generated-image.jpg') center/cover no-repeat;
    opacity: 0.5;
    filter: blur(20px) saturate(1.2);
    transform: scale(1.1);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
}

body.spawn-mode #bg {
    opacity: 0.3;
    filter: blur(40px) saturate(1.2);
}

#overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
    z-index: 2;
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

.liquid-glass-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.liquid-glass-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Screens */
.screen {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.screen.active { display: flex; }

/* ===== CLICK TO START ===== */
#top-logo {
    position: fixed;
    top: 40px;
    right: 40px;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 16px 24px;
    border-radius: 24px;
    z-index: 20;
}

body.spawn-mode #top-logo { display: none; }

#top-logo .text { text-align: right; }
#top-logo .name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
#top-logo .mode { font-size: 11px; font-weight: 600; color: #007AFF; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
#top-logo img { width: 56px; height: 56px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }

#click-box {
    text-align: center;
    cursor: pointer;
}

#click-box .icon {
    width: 120px; height: 120px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 32px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

#click-box:hover .icon {
    background: #007AFF;
    border-color: transparent;
    transform: scale(1.1);
    box-shadow: 0 0 60px rgba(0,122,255,0.5);
}

#click-box h1 {
    font-size: 64px;
    font-weight: 800;
    letter-spacing: -2px;
    margin-bottom: 16px;
    text-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

#click-box .badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 20px;
}

#click-box .badge .dot {
    width: 8px; height: 8px;
    background: #007AFF;
    border-radius: 50%;
    box-shadow: 0 0 12px #007AFF;
}

#click-box .badge span {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.8);
}

/* ===== SPAWN SELECTION ===== */
#spawn-logo {
    position: fixed;
    top: 40px;
    left: 40px;
    display: none;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-radius: 20px;
    z-index: 20;
}

body.spawn-mode #spawn-logo { display: flex; }

#spawn-logo img { width: 48px; height: 48px; border-radius: 14px; }
#spawn-logo .name { font-size: 18px; font-weight: 800; }
#spawn-logo .mode { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }

#stats {
    position: fixed;
    top: 40px;
    right: 40px;
    display: none;
    gap: 12px;
    z-index: 20;
}

body.spawn-mode #stats { display: flex; }

.stat {
    padding: 12px 20px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
}

.stat .dot { width: 8px; height: 8px; border-radius: 50%; background: #34C759; }
.stat .label { color: #007AFF; font-size: 11px; font-weight: 700; }

#clock {
    position: fixed;
    bottom: 40px;
    right: 40px;
    text-align: right;
    display: none;
    z-index: 20;
}

body.spawn-mode #clock { display: block; }

#clock .date { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
#clock .time { font-size: 56px; font-weight: 200; letter-spacing: -2px; }

/* Spawn Modal */
#spawn-modal {
    width: 560px;
    max-width: 90%;
    padding: 32px;
    border-radius: 32px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

#spawn-modal h2 {
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
}

#spawn-modal .line {
    width: 40px;
    height: 4px;
    background: #007AFF;
    border-radius: 2px;
    margin: 0 auto 32px;
    box-shadow: 0 0 20px rgba(0,122,255,0.5);
}

.tabs {
    display: flex;
    gap: 8px;
    padding: 6px;
    border-radius: 18px;
    margin-bottom: 24px;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.05);
}

.tab {
    flex: 1;
    padding: 14px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.5);
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border-radius: 14px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
.tab.active { background: #007AFF; color: #fff; box-shadow: 0 4px 20px rgba(0,122,255,0.4); }
.tab.active.green { background: #34C759; box-shadow: 0 4px 20px rgba(52,199,89,0.4); }

.spawns {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    flex: 1;
    padding-right: 8px;
}

.spawns::-webkit-scrollbar { width: 4px; }
.spawns::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

.sp {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 18px 20px;
    border-radius: 18px;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: #fff;
    width: 100%;
}

.sp .icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.05);
    flex-shrink: 0;
    transition: all 0.3s;
}

.sp:hover .icon { background: #fff; color: #000; }

.sp .info { flex: 1; }
.sp .info .title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.sp .info .desc { font-size: 13px; color: rgba(255,255,255,0.5); }
.sp:hover .info .desc { color: rgba(255,255,255,0.8); }

.sp .arrow { color: rgba(255,255,255,0.3); font-size: 20px; }
.sp:hover .arrow { color: #fff; }

/* Animations */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

.anim { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
</head>
<body>

<div id="bg"></div>
<div id="overlay"></div>

<div id="top-logo" class="liquid-glass">
    <div class="text">
        <div class="name">Project SY</div>
        <div class="mode">Metrostroi NoRank</div>
    </div>
    <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg">
</div>

<div id="spawn-logo" class="liquid-glass">
    <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg">
    <div>
        <div class="name">Project SY</div>
        <div class="mode">Metrostroi</div>
    </div>
</div>

<div id="stats">
    <div class="stat liquid-glass"><div class="dot"></div><span id="ping">0 ms</span></div>
    <div class="stat liquid-glass"><span class="label">FPS</span><span id="fps">0</span></div>
</div>

<div id="clock">
    <div class="date" id="date"></div>
    <div class="time" id="time"></div>
</div>

<!-- CLICK SCREEN -->
<div class="screen active" id="scr-click">
    <div id="click-box" class="anim" onclick="goSpawn()">
        <div class="icon liquid-glass-btn">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="2" width="14" height="20" rx="7" stroke="#fff" stroke-width="2"/>
                <path d="M12 2V10" stroke="#fff" stroke-width="2"/>
                <path d="M5 10H19" stroke="#fff" stroke-width="2"/>
                <path d="M5 9C5 5.13 8.13 2 12 2V10H5V9Z" fill="#007AFF"/>
            </svg>
        </div>
        <h1>Нажмите ЛКМ</h1>
        <div class="badge liquid-glass">
            <div class="dot"></div>
            <span>Чтобы начать игру</span>
        </div>
    </div>
</div>

<!-- SPAWN SCREEN -->
<div class="screen" id="scr-spawn">
    <div id="spawn-modal" class="liquid-glass-strong anim">
        <h2>Где появимся?</h2>
        <div class="line"></div>
        
        <div class="tabs">
            <button class="tab active" id="t-all" onclick="flt('all')">Все</button>
            <button class="tab" id="t-dr" onclick="flt('dr')">🚇 Машинист</button>
            <button class="tab" id="t-ps" onclick="flt('ps')">👤 Пассажир</button>
        </div>
        
        <div class="spawns">
            <button class="sp liquid-glass-btn" data-t="dr" onclick="sel('depot')">
                <div class="icon">🚇</div>
                <div class="info"><div class="title">ТЧ-1 «Лихоборы»</div><div class="desc">Электродепо. Спавн составов.</div></div>
                <div class="arrow">›</div>
            </button>
            <button class="sp liquid-glass-btn" data-t="dr" onclick="sel('tupik')">
                <div class="icon">🚇</div>
                <div class="info"><div class="title">Тупик ст. Физтех</div><div class="desc">Оборотный тупик. Смена кабины.</div></div>
                <div class="arrow">›</div>
            </button>
            <button class="sp liquid-glass-btn" data-t="ps" onclick="sel('lianozovo')">
                <div class="icon">📍</div>
                <div class="info"><div class="title">Ст. Лианозово</div><div class="desc">Пассажирская платформа</div></div>
                <div class="arrow">›</div>
            </button>
            <button class="sp liquid-glass-btn" data-t="ps" onclick="sel('fiztech')">
                <div class="icon">📍</div>
                <div class="info"><div class="title">Ст. Физтех</div><div class="desc">Конечная станция</div></div>
                <div class="arrow">›</div>
            </button>
            <button class="sp liquid-glass-btn" data-t="ps" onclick="sel('yahroma')">
                <div class="icon">📍</div>
                <div class="info"><div class="title">Ст. Яхромская</div><div class="desc">Пассажирская платформа</div></div>
                <div class="arrow">›</div>
            </button>
        </div>
    </div>
</div>

<script>
var m = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function upd() {
    var d = new Date();
    document.getElementById('date').innerText = d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
    document.getElementById('time').innerText = ('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2);
}
upd(); setInterval(upd, 1000);

window.updateStats = function(p, f) {
    document.getElementById('ping').innerText = p + ' ms';
    document.getElementById('fps').innerText = f;
};

function goSpawn() {
    document.getElementById('scr-click').classList.remove('active');
    document.getElementById('scr-spawn').classList.add('active');
    document.body.classList.add('spawn-mode');
}

function flt(t) {
    document.getElementById('t-all').className = (t=='all') ? 'tab active' : 'tab';
    document.getElementById('t-dr').className = (t=='dr') ? 'tab active' : 'tab';
    document.getElementById('t-ps').className = (t=='ps') ? 'tab active green' : 'tab';
    var btns = document.getElementsByClassName('sp');
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.display = (t=='all' || btns[i].getAttribute('data-t')==t) ? 'flex' : 'none';
    }
}

function sel(id) {
    if (window.gmod && window.gmod.spawn) window.gmod.spawn(id);
}
</script>
</body>
</html>
]]

-- Music
local function PlayMusic()
    if musicChannel then return end
    sound.PlayURL("https://files.catbox.moe/6l0yoi.flac", "noblock", function(channel)
        if IsValid(channel) then
            musicChannel = channel
            channel:SetVolume(0.5)
            channel:Play()
        end
    end)
end

local function FadeOutMusic(duration, callback)
    if not musicChannel then
        if callback then callback() end
        return
    end
    
    local vol = musicChannel:GetVolume()
    local steps = duration * 10
    local stepVol = vol / steps
    
    timer.Create("ProjectSY_FadeMusic", 0.1, steps, function()
        if not musicChannel then
            timer.Remove("ProjectSY_FadeMusic")
            if callback then callback() end
            return
        end
        vol = vol - stepVol
        if vol <= 0 then
            musicChannel:Stop()
            musicChannel = nil
            timer.Remove("ProjectSY_FadeMusic")
            if callback then callback() end
        else
            musicChannel:SetVolume(vol)
        end
    end)
end

local function StopMusicNow()
    timer.Remove("ProjectSY_FadeMusic")
    if musicChannel then
        musicChannel:Stop()
        musicChannel = nil
    end
end

-- UI
local function CloseUI()
    if IsValid(htmlPanel) then
        htmlPanel:Remove()
        htmlPanel = nil
    end
    timer.Remove("ProjectSY_UpdateStats")
    hook.Remove("EntityEmitSound", "ProjectSY_MuteGame")
    isClosing = false
    FadeOutMusic(10)
end

local function ShowUI()
    if IsValid(htmlPanel) then return end
    isClosing = false
    
    PlayMusic()
    
    htmlPanel = vgui.Create("DHTML")
    htmlPanel:SetSize(ScrW(), ScrH())
    htmlPanel:SetPos(0, 0)
    htmlPanel:SetHTML(HTML_CONTENT)
    htmlPanel:MakePopup()
    htmlPanel:SetKeyboardInputEnabled(false)
    htmlPanel:SetMouseInputEnabled(true)
    
    -- Stats update
    timer.Create("ProjectSY_UpdateStats", 1, 0, function()
        if IsValid(htmlPanel) then
            local p = LocalPlayer():Ping()
            local f = math.floor(1 / FrameTime())
            htmlPanel:Call("updateStats(" .. p .. "," .. f .. ")")
        else
            timer.Remove("ProjectSY_UpdateStats")
        end
    end)
    
    -- Spawn callback
    htmlPanel:AddFunction("gmod", "spawn", function(spawnId)
        if isClosing then return end
        isClosing = true
        net.Start("ProjectSY_SelectSpawn")
        net.WriteString(spawnId)
        net.SendToServer()
        CloseUI()
    end)
    
    -- Mute game sounds
    hook.Add("EntityEmitSound", "ProjectSY_MuteGame", function()
        return false
    end)
end

-- Kick on music end
hook.Add("Think", "ProjectSY_CheckMusicAFK", function()
    if IsValid(htmlPanel) and musicChannel then
        if musicChannel:GetState() == GMOD_CHANNEL_STOPPED then
            RunConsoleCommand("disconnect")
        end
    end
end)

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
concommand.Add("projectsy_close", function()
    StopMusicNow()
    CloseUI()
end)

print("[Project SY] UI Script Loaded")
