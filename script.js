// ANTI-INSPECT (Keamanan Dasar)
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) { 
    if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 67 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) return false; 
};

// DATA UNIT
const unitDetails = {
    'Excavator': { specs: ['Bucket 0.9m³', 'Weight 20T'], variants: [{n:'PC200-8', s:'Ready'}, {n:'PC300-8', s:'Not Ready'}] },
    'Dozer': { specs: ['Blade 3.2m³', '160 HP'], variants: [{n:'D65P-12', s:'Ready'}, {n:'D85SS-2', s:'Not Ready'}] },
    'Dumptruck': { specs: ['Cap 20T', 'Indeks 24'], variants: [{n:'Hino 500', s:'Ready'}] },
    'Bomag': { specs: ['Weight 12T'], variants: [{n:'BW 211', s:'Ready'}] },
    'Grader': { specs: ['Blade 3.7m'], variants: [{n:'GD511A', s:'Ready'}] }
};

const unitTypes = [
    { type: 'Excavator', unitName: 'Ritase', img: 'Foto-Excavator Komatsu PC200-8.png', baseProfit: 200000, rentalRate: 275000 },
    { type: 'Dozer', unitName: 'Volume (M³)', img: 'Foto-Dozer Komatsu D65P-12.png', baseProfit: 45000, rentalRate: 250000 },
    { type: 'Bomag', unitName: 'Jam', img: 'Foto-Vibratory Roller Bomag BW 211.png', baseProfit: 40000, rentalRate: 180000 },
    { type: 'Grader', unitName: 'Jam', img: 'Foto-Motor Grader Komatsu GD511A.png', baseProfit: 50000, rentalRate: 300000 }
];

// FUNGSI RENDER KATALOG
function renderUnits(a) {
    const w = document.getElementById('unit-wrapper');
    w.innerHTML = '';
    unitTypes.forEach(u => {
        const s = unitDetails[u.type].specs.map(sp => `<span class="spec-badge">${sp}</span>`).join('');
        w.innerHTML += `<div class="unit-card" onclick="showDetail('${u.type}', '${a}')">
            <div class="image-box"><img src="${u.img}"></div>
            <div class="p-3"><h6 class="fw-bold mb-1">${u.type} Series - ${a.toUpperCase()}</h6>${s}</div>
        </div>`;
    });
}

// FUNGSI DETAIL UNIT & KALKULATOR
function showDetail(type, a) {
    const u = unitTypes.find(x => x.type === type);
    const d = unitDetails[type];
    document.getElementById('main-katalog').classList.add('d-none');
    document.getElementById('detail-page').classList.remove('d-none');
    
    let varList = d.variants.map(v => `
        <div class="d-flex justify-content-between border-bottom py-2 small">
            <span class="fw-bold">${v.n}</span>
            <span class="${v.s==='Ready'?'text-success':'text-danger'} fw-bold">${v.s}</span>
        </div>`).join('');

    document.getElementById('detail-galeri').innerHTML = `<img src="${u.img}" class="w-100 rounded-4" style="height:200px; object-fit:cover;">`;
    document.getElementById('detail-info').innerHTML = `
        <h5 class="fw-bold mt-3">${u.type} Pro-Series</h5>
        <div class="mb-3 bg-light p-3 rounded-4 mt-2">
            <h6 style="font-size:10px; font-weight:800; color:#888;">UNIT READY DI SITE:</h6>${varList}
        </div>
        <div class="calc-container shadow-sm">
            <div class="calc-header">Kalkulator Estimasi Cuan Proyek</div>
            <div class="p-3">
                <label class="small fw-bold">JUMLAH ${u.unitName.toUpperCase()}</label>
                <input type="number" id="inputRit" class="form-control mb-3" value="100" oninput="syncCalc(${u.baseProfit}, ${u.rentalRate})">
                <label class="small fw-bold">DURASI KERJA (JAM)</label>
                <input type="number" id="inputHM" class="form-control mb-3" value="100" oninput="syncCalc(${u.baseProfit}, ${u.rentalRate})">
                <div id="resBox" class="res-box">
                    <div id="resAmount" class="res-amount">Rp 0</div>
                    <div id="resStatus" class="fw-bold small">SIAP ANALISA</div>
                    <div id="resSaran" class="mt-2" style="font-size:10px; font-style:italic; line-height:1.4;"></div>
                </div>
            </div>
        </div>
        <button class="btn btn-warning w-100 py-3 fw-bold rounded-4 mt-3 shadow" onclick="openBooking('${u.type}')">PESAN UNIT SEKARANG</button>`;
    syncCalc(u.baseProfit, u.rentalRate);
    window.scrollTo(0,0);
}

// LOGIKA KALKULASI
function syncCalc(p, r) {
    const rit = document.getElementById('inputRit').value || 0;
    const hm = document.getElementById('inputHM').value || 0;
    const total = (rit * p) - (hm * r);
    const box = document.getElementById('resBox');
    const saran = document.getElementById('resSaran');
    document.getElementById('resAmount').innerText = "Rp " + total.toLocaleString('id-ID');
    
    if(total > 0) {
        box.className = "res-box res-positive";
        document.getElementById('resStatus').innerText = "ESTIMASI: UNTUNG";
        saran.innerText = "Target kerja tercapai. Segera booking untuk mengamankan jadwal unit.";
    } else {
        box.className = "res-box res-negative";
        document.getElementById('resStatus').innerText = "ESTIMASI: RUGI";
        const targetRit = Math.ceil((hm * r) / p);
        const unitLabel = document.getElementById('inputRit').previousElementSibling.innerText.split(' ')[1];
        saran.innerText = `Saran: Tambah volume minimal ${targetRit} ${unitLabel} agar biaya sewa tertutupi.`;
    }
}

// FORM BOOKING
function toggleCustomJam() {
    const s = document.getElementById('jamSewa');
    document.getElementById('customJamInput').className = s.value === 'custom' ? "form-control mb-3" : "form-control mb-3 d-none";
}

function openBooking(t = "") {
    if(t) document.getElementById('jenisUnitForm').value = t;
    new bootstrap.Modal(document.getElementById('modalBooking')).show();
}

function kirimBooking() {
    const u = document.getElementById('jenisUnitForm').value;
    const n = document.getElementById('namaPenyewa').value;
    const l = document.getElementById('lokasiProyek').value;
    const t = document.getElementById('tglSewa').value;
    const j = document.getElementById('jamSewa').value === 'custom' ? document.getElementById('customJamInput').value : document.getElementById('jamSewa').value;
    
    if(!n || !l || !t || !j) return alert("Mohon lengkapi data pesanan!");
    
    const text = `*PESANAN UNIT - BORNEO HEAVY*%0A%0A*Unit:* ${u}%0A*Penyewa:* ${n}%0A*Lokasi:* ${l}%0A*Tgl Sewa:* ${t}%0A*Durasi:* ${j} Jam`;
    window.open(`https://wa.me/6285393620791?text=${text}`);
}

// LIVE REPORT & STATS
const logs = [
    "PC200 sedang loading di Samboja", 
    "D65P standby persiapan mob ke Berau", 
    "Hino 500 mulai hauling di site Sangatta", 
    "Grader sedang maintenance di Samarinda"
];

setInterval(() => { 
    const randomLog = logs[Math.floor(Math.random()*logs.length)];
    document.getElementById('live-update').innerHTML = `<i class="fas fa-bullhorn me-2 text-warning"></i> ${randomLog}`; 
}, 5000);

function updateStats() {
    const start = new Date("2026-01-01").getTime();
    const elapsed = Math.floor((new Date().getTime() - start) / 600000);
    document.getElementById('visitorCount').innerText = (3240 + elapsed).toLocaleString('id-ID');
    document.getElementById('consultCount').innerText = (856 + Math.floor(elapsed/3)).toLocaleString('id-ID');
}

// FILTER AREA
function filterArea(a, b) {
    document.querySelectorAll('.btn-area').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); 
    renderUnits(a);
}

function backToKatalog() { 
    document.getElementById('main-katalog').classList.remove('d-none'); 
    document.getElementById('detail-page').classList.add('d-none'); 
}

// INISIALISASI AWAL
updateStats(); 
renderUnits('samarinda');
