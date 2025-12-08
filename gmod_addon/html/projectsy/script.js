/* ==========================================================================
   PROJECT SY - GMOD INTERFACE JAVASCRIPT
   Vanilla JS for GMod DHTML compatibility
   ========================================================================== */

// ==========================================================================
// DATA
// ==========================================================================

const SPAWN_POINTS = [
    { id: 1, title: "ТЧ-1 «Лихоборы»", desc: "Электродепо. Спавн составов.", type: "driver" },
    { id: 2, title: "Тупик ст. Физтех", desc: "Оборотный тупик. Смена кабины.", type: "driver" },
    { id: 3, title: "Ст. Лианозово", desc: "Пассажирская платформа", type: "passenger" },
    { id: 4, title: "Ст. Физтех", desc: "Конечная станция", type: "passenger" },
    { id: 5, title: "Ст. Яхромская", desc: "Пассажирская платформа", type: "passenger" },
];

const DEFAULT_PLAYERS = [
    { id: 1, name: "sleepus", rank: "Главарь SY", ping: 5, avatar: "red", status: "Перегон: Физтех - Лианозово", isAdmin: true },
    { id: 2, name: "//usonance\\\\", rank: "ЗамГлав SY", ping: 12, avatar: "gray", status: "На станции: Селигерская", isAdmin: true },
    { id: 3, name: "Юрий Свириденко", rank: "Метростроевец", ping: 34, avatar: "blue", status: "Оборот: Тупик Физтеха", isAdmin: false },
    { id: 4, name: "Гость", rank: "Игрок", ping: 45, avatar: "purple", status: "Пассажир (Поезд: sleepus)", isAdmin: false },
];

// ==========================================================================
// STATE
// ==========================================================================

let currentScreen = 'loading-screen';
let currentFilter = 'all';
let players = [...DEFAULT_PLAYERS];
let isScoreboardVisible = false;
let loadingProgress = 0;
let loadingInterval = null;

// Player data (will be set from Lua)
let playerData = {
    name: "Гость",
    rank: "Игрок",
    balance: "0 ₽",
    playTime: "0.0 ч",
    rankTitle: "Новичок"
};

// ==========================================================================
// MUSIC SYSTEM
// ==========================================================================

// Local music files (copy to gmod_addon/html/projectsy/)
const MUSIC_TRACKS = [
    "SpotiDownloader.com - Falling - 1nonly.flac",
    "SpotiDownloader.com - NO BATIDÃO - Slowed - ZXKAI.flac",
    "SpotiDownloader.com - STILL IN THE PAINT (with LAZER DIM 700 & Bktherula) - Denzel Curry.flac",
    "SpotiDownloader.com - ВИКТОР БАРИНОВ - FACE.flac",
];

let audioElement = null;
let currentTrack = "";
const TARGET_VOLUME = 0.15;
let fadeInterval = null;


function getRandomTrack() {
    const available = MUSIC_TRACKS.filter(t => t !== currentTrack);
    return available[Math.floor(Math.random() * available.length)] || MUSIC_TRACKS[0];
}

function initMusic() {
    if (audioElement) return;

    audioElement = new Audio();
    audioElement.volume = 0;
    audioElement.crossOrigin = "anonymous";

    audioElement.addEventListener('ended', () => {
        const newTrack = getRandomTrack();
        currentTrack = newTrack;
        audioElement.src = newTrack;
        audioElement.play().catch(e => console.warn("Audio play failed:", e));
    });

    audioElement.addEventListener('error', (e) => {
        console.warn("Audio error, trying next track:", e);
        const newTrack = getRandomTrack();
        currentTrack = newTrack;
        audioElement.src = newTrack;
        audioElement.play().catch(err => console.warn("Fallback also failed:", err));
    });
}

function playMusic() {
    if (!audioElement) initMusic();


    if (!currentTrack || audioElement.ended) {
        currentTrack = getRandomTrack();
        audioElement.src = currentTrack;
    }

    if (audioElement.paused) {
        audioElement.play().catch(e => console.warn("Audio play failed:", e));
    }
}



function fadeInMusic() {
    clearInterval(fadeInterval);
    playMusic();

    fadeInterval = setInterval(() => {
        if (audioElement && audioElement.volume < TARGET_VOLUME) {
            audioElement.volume = Math.min(TARGET_VOLUME, audioElement.volume + 0.01);
        } else {
            clearInterval(fadeInterval);
        }
    }, 100);
}

function fadeOutMusic() {
    clearInterval(fadeInterval);

    if (audioElement && !audioElement.paused && audioElement.volume > 0) {
        fadeInterval = setInterval(() => {
            if (audioElement.volume > 0.005) {
                audioElement.volume = Math.max(0, audioElement.volume - 0.01);
            } else {
                audioElement.volume = 0;
                audioElement.pause();
                clearInterval(fadeInterval);
            }
        }, 50);
    }
}

// ==========================================================================
// GMOD COMMUNICATION
// ==========================================================================

// This function is called from Lua or for debugging in browser
function gmodCall(action, data) {
    console.log("[GMod Call]", action, data);

    // Check if we're in GMod environment
    if (typeof gmod !== 'undefined' && gmod[action]) {
        gmod[action](data);
    } else {
        // Browser fallback for testing
        console.log("Would call gmod." + action + "(" + JSON.stringify(data) + ")");

        // Simulate some actions for testing
        if (action === 'resumeGame') {
            showScreen('menu-screen');
            setTimeout(() => { document.getElementById('menu-screen').classList.add('hidden'); }, 100);
        } else if (action === 'disconnect') {
            alert("Disconnecting...");
        }
    }
}

// GMod hooks - these are called FROM Lua
window.DownloadingFile = function (fileName) {
    updateLoading("ЗАГРУЗКА ИГРЫ", fileName, false);
};

window.SetStatus = function (status) {
    if (status.includes("Sending client info") || status.includes("Getting")) {
        updateLoading("ПОДКЛЮЧЕНИЕ...", "ПОДКЛЮЧЕНИЕ К СЕРВЕРУ", true);
    } else {
        updateLoading("ЗАГРУЗКА...", status, false);
    }
};

window.SetFilesTotal = function (total) {
    console.log("Total files:", total);
};

window.SetFilesNeeded = function (needed) {
    if (needed > 0) {
        // Calculate percentage
        const total = parseInt(document.getElementById('progress-percent').dataset.total || needed);
        const progress = ((total - needed) / total) * 100;
        setLoadingProgress(progress);
    }
};

// Functions that Lua can call
window.projectsy = {
    showLoading: function () {
        showScreen('loading-screen');
    },

    showStart: function () {
        showScreen('start-screen');
    },

    showSpawnSelection: function () {
        showScreen('spawn-screen');
    },

    showMenu: function () {
        showScreen('menu-screen');
    },

    hideAll: function () {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    },

    setPlayerData: function (data) {
        playerData = { ...playerData, ...data };
        document.getElementById('player-name').textContent = data.name || playerData.name;
        document.getElementById('player-rank').textContent = data.rank || playerData.rank;
        document.getElementById('stat-rank').textContent = data.rankTitle || playerData.rankTitle;
        document.getElementById('stat-balance').textContent = data.balance || playerData.balance;
        document.getElementById('stat-time').textContent = data.playTime || playerData.playTime;
    },

    setPlayers: function (playerList) {
        players = playerList;
        renderPlayers();
    },

    addPlayer: function (player) {
        players.push(player);
        renderPlayers();
    },

    removePlayer: function (id) {
        players = players.filter(p => p.id !== id);
        renderPlayers();
    },

    showScoreboard: function () {
        document.getElementById('scoreboard').classList.remove('hidden');
        isScoreboardVisible = true;
    },

    hideScoreboard: function () {
        document.getElementById('scoreboard').classList.add('hidden');
        isScoreboardVisible = false;
    },

    setStats: function (ping, fps) {
        updateStats(ping, fps);
    },

    setMapName: function (name) {
        document.getElementById('map-name').textContent = name;
    },

    loadingComplete: function () {
        clearInterval(loadingInterval);
        setLoadingProgress(100);
        setTimeout(() => {
            showScreen('start-screen');
        }, 500);
    }
};

// ==========================================================================
// SCREEN MANAGEMENT
// ==========================================================================

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        currentScreen = screenId;
    }

    // Update background video state
    const video = document.getElementById('bg-video');
    if (screenId === 'loading-screen') {
        video.classList.add('blur');
        video.classList.remove('bright');
        fadeOutMusic();
    } else if (screenId === 'start-screen') {
        video.classList.remove('blur');
        video.classList.add('bright');
        fadeInMusic();
    } else if (screenId === 'spawn-screen' || screenId === 'menu-screen') {
        video.classList.add('blur');
        video.classList.remove('bright');
        fadeInMusic();
    } else {
        video.classList.add('blur');
        video.classList.remove('bright');
        fadeOutMusic();
    }
}

// ==========================================================================
// LOADING SCREEN
// ==========================================================================

function updateLoading(text, detail, indeterminate) {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-detail').textContent = detail;

    const fill = document.getElementById('progress-fill');
    if (indeterminate) {
        fill.classList.add('indeterminate');
        fill.style.width = '';
        document.getElementById('progress-percent').textContent = '';
    } else {
        fill.classList.remove('indeterminate');
    }
}

function setLoadingProgress(percent) {
    const fill = document.getElementById('progress-fill');
    fill.classList.remove('indeterminate');
    fill.style.width = percent + '%';
    document.getElementById('progress-percent').textContent = Math.round(percent) + '%';
    loadingProgress = percent;
}

function simulateLoading() {
    // Only run simulation if not in GMod
    if (typeof gmod !== 'undefined') return;

    loadingInterval = setInterval(() => {
        loadingProgress += 0.5;

        if (loadingProgress < 20) {
            updateLoading("ПОДКЛЮЧЕНИЕ...", "ПОДКЛЮЧЕНИЕ К СЕРВЕРУ", true);
        } else {
            updateLoading("ЗАГРУЗКА...", "ЗАГРУЗКА ИГРЫ", false);
            setLoadingProgress(loadingProgress);
        }

        if (loadingProgress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                showScreen('start-screen');
            }, 500);
        }
    }, 30);
}

// ==========================================================================
// SPAWN SELECTION
// ==========================================================================

function renderSpawns() {
    const list = document.getElementById('spawn-list');
    list.innerHTML = '';

    const filtered = SPAWN_POINTS.filter(sp =>
        currentFilter === 'all' || sp.type === currentFilter
    );

    filtered.forEach(spawn => {
        const item = document.createElement('div');
        item.className = 'spawn-item';
        item.onclick = () => selectSpawn(spawn.id);

        const iconSvg = spawn.type === 'driver'
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H6c-1.1 0-2.1.8-2.4 1.8l-1.4 5c-.1.4-.2.8-.2 1.2s.1.8.2 1.2c.3 1.1.8 2.8.8 2.8h3M7 18h10M5 18v2M19 18v2"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg>';

        item.innerHTML = `
            <div class="spawn-icon ${spawn.type}">${iconSvg}</div>
            <div class="spawn-info">
                <div class="spawn-title">${spawn.title}</div>
                <div class="spawn-desc">${spawn.desc}</div>
            </div>
            <div class="spawn-badge ${spawn.type}">${spawn.type === 'driver' ? 'Маш' : 'Пас'}</div>
        `;

        list.appendChild(item);
    });
}

function setSpawnFilter(filter) {
    currentFilter = filter;

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'passenger');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
            if (filter === 'passenger') btn.classList.add('passenger');
        }
    });

    renderSpawns();
}

function selectSpawn(spawnId) {
    console.log("Selected spawn:", spawnId);
    gmodCall('selectSpawn', spawnId);

    // In browser, just go to menu for testing
    if (typeof gmod === 'undefined') {
        showScreen('menu-screen');
    }
}

// ==========================================================================
// SCOREBOARD
// ==========================================================================

function renderPlayers() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';

    // Update player count
    document.getElementById('sb-players').textContent = players.length + '/32';

    players.forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item';

        const pingClass = player.ping > 100 ? 'high' : (player.ping > 50 ? 'medium' : '');
        const rankClass = player.isAdmin ? 'admin' : '';

        item.innerHTML = `
            <div class="player-avatar ${player.avatar}">${player.name.charAt(0).toUpperCase()}</div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-rank ${rankClass}">${player.rank}</div>
                <div class="player-status">${player.status}</div>
            </div>
            <div class="player-meta">
                <div class="player-ping ${pingClass}">${player.ping} ms</div>
            </div>
        `;

        list.appendChild(item);
    });
}

// ==========================================================================
// STATS & CLOCK
// ==========================================================================

function updateStats(ping, fps) {
    // Update all ping/fps displays
    ['hud-ping', 'menu-ping', 'sb-ping'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = ping + ' ms';
    });

    ['hud-fps', 'menu-fps'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = fps;
    });
}

function updateClock() {
    const now = new Date();

    const timeStr = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Moscow'
    });

    const dateStr = now.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Moscow'
    });

    ['hud-time', 'menu-time'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = timeStr;
    });

    ['hud-date', 'menu-date'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = dateStr;
    });
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize spawns
    renderSpawns();

    // Initialize players
    renderPlayers();

    // Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // Simulate stats
    updateStats(25, 60);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setSpawnFilter(btn.dataset.filter);
        });
    });

    // Click to start
    document.getElementById('start-screen').addEventListener('click', () => {
        showScreen('spawn-screen');
        gmodCall('onStartClicked');
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.getElementById('scoreboard').classList.remove('hidden');
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            if (currentScreen === 'menu-screen') {
                gmodCall('resumeGame');
            } else {
                showScreen('menu-screen');
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
            document.getElementById('scoreboard').classList.add('hidden');
        }
    });

    // Check URL params for mode
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    if (mode === 'loading') {
        showScreen('loading-screen');
        simulateLoading();
    } else if (mode === 'start') {
        showScreen('start-screen');
    } else if (mode === 'spawn') {
        showScreen('spawn-screen');
    } else if (mode === 'menu') {
        showScreen('menu-screen');
    } else {
        // Default: start with loading simulation
        showScreen('loading-screen');
        simulateLoading();
    }
});

// Prevent right-click context menu
document.addEventListener('contextmenu', e => e.preventDefault());
