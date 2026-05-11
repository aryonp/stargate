/**
 * Stargate Command - Advanced Dialer System
 * Refined & Optimized Neural Interface
 */

const state = {
    glyphs: [],
    addresses: [],
    dialedSequence: [],
    isDialing: false,
    currentGalaxy: 'Milky Way'
};

const UI = {
    gateRing: document.getElementById('gateRing'),
    dhdGrid: document.getElementById('dhdGrid'),
    logOutput: document.getElementById('logOutput'),
    dialedGlyphs: document.getElementById('dialedGlyphs'),
    destName: document.getElementById('destName'),
    destDesc: document.getElementById('destDesc'),
    eventHorizon: document.getElementById('eventHorizon'),
    addressList: document.getElementById('addressList'),
    addressBook: document.getElementById('addressBook')
};

// Initialization
async function init() {
    try {
        const [glyphRes, addrRes] = await Promise.all([
            fetch('/api/glyphs'),
            fetch('/api/addresses')
        ]);
        state.glyphs = await glyphRes.json();
        state.addresses = await addrRes.json();
        
        renderAll();
        setupEventListeners();
        addLog('SYSTEM READY.');
    } catch (err) {
        addLog('CRITICAL ERROR: ' + err.message);
    }
}

function renderAll() {
    renderGate();
    renderDHD();
    renderAddressBook();
}

function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    UI.logOutput.innerHTML += `<div class="log-entry">> [${time}] ${msg}</div>`;
    UI.logOutput.scrollTop = UI.logOutput.scrollHeight;
}

function renderGate() {
    // Smooth transition between galaxies
    UI.gateRing.style.opacity = '0';
    setTimeout(() => {
        UI.gateRing.innerHTML = '';
        const radius = 260;
        const ringGlyphs = state.glyphs.filter(g => g.galaxy === state.currentGalaxy).slice(0, 39);
        
        ringGlyphs.forEach((glyph, index) => {
            const angle = (index * (360 / ringGlyphs.length)) - 90;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            const el = document.createElement('div');
            el.className = 'gate-glyph';
            el.id = `gate-glyph-${glyph.id}`;
            el.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
            el.innerHTML = `<img src="${glyph.image_url}" alt="${glyph.name}" onerror="this.style.opacity='0.1'">`;
            UI.gateRing.appendChild(el);
        });
        UI.gateRing.style.opacity = '1';
    }, 300);
}

function renderDHD() {
    UI.dhdGrid.style.opacity = '0';
    setTimeout(() => {
        UI.dhdGrid.innerHTML = '';
        const filteredGlyphs = state.glyphs.filter(g => g.galaxy === state.currentGalaxy);
        
        filteredGlyphs.forEach(glyph => {
            const btn = document.createElement('button');
            btn.className = 'dhd-btn';
            btn.title = `${glyph.name} (${glyph.constellation_name})`;
            btn.innerHTML = `<img src="${glyph.image_url}" alt="${glyph.name}" onerror="this.src='glyphs/glyph01.png'; this.style.opacity='0.2'">`;
            btn.onclick = () => dialSymbol(glyph);
            UI.dhdGrid.appendChild(btn);
        });
        UI.dhdGrid.style.opacity = '1';
    }, 300);
}

function renderAddressBook() {
    UI.addressList.innerHTML = state.addresses.map(addr => `
        <tr>
            <td>
                <strong>${addr.destination}</strong><br>
                <small>${addr.episode}</small>
            </td>
            <td><span class="badge">${addr.galaxy}</span></td>
            <td><code>${addr.address}</code></td>
            <td><button class="btn btn-secondary btn-sm" onclick="autoDial('${addr.address}')">LOAD</button></td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            if (state.isDialing) return;
            state.currentGalaxy = btn.dataset.galaxy;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGate();
            renderDHD();
            addLog(`SWITCHED TO ${state.currentGalaxy.toUpperCase()} NETWORK.`);
        };
    });

    document.getElementById('dialBtn').onclick = performDial;
    document.getElementById('resetBtn').onclick = resetDialer;
    document.getElementById('toggleDbBtn').onclick = () => UI.addressBook.classList.remove('hidden');
    document.getElementById('closeDbBtn').onclick = () => UI.addressBook.classList.add('hidden');
}

async function dialSymbol(glyph) {
    if (state.isDialing || state.dialedSequence.length >= 9) return;
    
    state.dialedSequence.push(glyph);
    updateDisplay();
    addLog(`SYMBOL ${glyph.name} LOCKED.`);
    
    lockChevron(state.dialedSequence.length);
    
    const ringGlyphs = state.glyphs.filter(g => g.galaxy === state.currentGalaxy).slice(0, 39);
    const index = ringGlyphs.findIndex(g => g.id === glyph.id);
    if (index !== -1) {
        const angle = (index * (360 / ringGlyphs.length));
        UI.gateRing.style.transform = `rotate(${-angle}deg)`;
    }
}

function updateDisplay() {
    UI.dialedGlyphs.innerHTML = state.dialedSequence.map(g => `
        <img src="${g.image_url}" class="dialed-glyph" alt="${g.name}">
    `).join('');
}

function lockChevron(index) {
    const chev = document.getElementById(`chev-${index}`);
    if (chev) chev.classList.add('active');
}

async function performDial() {
    if (state.dialedSequence.length < 7) {
        addLog('ERROR: INSUFFICIENT CHEVRONS. MINIMUM 7 REQUIRED.');
        return;
    }
    
    state.isDialing = true;
    addLog('INITIATING WORMHOLE ESTABLISHMENT...');
    
    // canonical dialing logic: query N-1 symbols
    const addressToQuery = state.dialedSequence.slice(0, -1).map(g => g.id).join('-');
    const pointOfOrigin = state.dialedSequence[state.dialedSequence.length - 1];
    
    addLog(`LOCKING POINT OF ORIGIN: ${pointOfOrigin.name}...`);
    
    try {
        const res = await fetch('/api/check-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: addressToQuery })
        });
        const data = await res.json();
        
        if (data.success) {
            addLog(`CONNECTION ESTABLISHED TO ${data.destination.destination}.`);
            UI.destName.innerText = data.destination.destination;
            UI.destDesc.innerText = data.destination.description;
            UI.eventHorizon.classList.add('active');
        } else {
            addLog('ERROR: NO STARGATE RESPONSE. ADDRESS UNKNOWN.');
            UI.destName.innerText = 'OUT OF RANGE';
            UI.destDesc.innerText = 'The dialed coordinates do not match any known stargate in the network.';
            setTimeout(resetDialer, 3000);
        }
    } catch (err) {
        addLog('SYSTEM FAILURE: ' + err.message);
    } finally {
        state.isDialing = false;
    }
}

function resetDialer() {
    state.dialedSequence = [];
    updateDisplay();
    UI.eventHorizon.classList.remove('active');
    UI.destName.innerText = '---';
    UI.destDesc.innerText = 'Establish connection to retrieve data.';
    addLog('SYSTEM RESET. READY.');
    
    document.querySelectorAll('.chevron').forEach(c => c.classList.remove('active'));
    UI.gateRing.style.transform = 'rotate(0deg)';
}

function autoDial(addrStr) {
    resetDialer();
    const ids = addrStr.split('-').map(Number);
    // canonical PoO
    const pooId = state.currentGalaxy === 'Pegasus' ? 209 : 1;
    ids.push(pooId);
    
    ids.forEach((id, i) => {
        setTimeout(() => {
            const glyph = state.glyphs.find(g => g.id === id);
            if (glyph) dialSymbol(glyph);
            if (i === ids.length - 1) setTimeout(performDial, 1200);
        }, i * 800);
    });
    UI.addressBook.classList.add('hidden');
}

init();