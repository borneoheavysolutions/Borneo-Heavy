// --- BORNEO HEAVY SOLUTIONS - SMART CALCULATOR LOGIC ---

// ANTI-INSPECT (Keamanan Dasar)
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) { 
    if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 67 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) return false; 
};

// DATA UNIT DENGAN NAMA FILE SESUAI FOLDER
const unitTypes = [
    { 
        type: 'Excavator', 
        img: 'Foto-Excavator Komatsu PC200-8.png', 
        baseProfit: 20000, 
        ratePerJam: 2500000, 
        perfValue: 18, 
        perfUnit: 'Ritase', 
        resultUnit: 'Rit', 
        m3Conversion: 5, 
        desc: 'Class 20T - Heavy Duty Loading'
    },
    { 
        type: 'Dozer', 
        img: 'Foto-Dozer Komatsu D65P-12.png', 
        baseProfit: 4500, 
        ratePerJam: 850000, 
        perfValue: 3.5, 
        perfUnit: 'Kapasitas Blade (M³)', 
        resultUnit: 'M³', 
        m3Conversion: 1, 
        desc: 'Class 160HP - Land Clearing'
    },
    { 
        type: 'Bomag', 
        img: 'Foto-Vibratory Roller Bomag BW 211.png', 
        baseProfit: 40000, 
        ratePerJam: 450000, 
        perfValue: 1, 
        perfUnit: 'Efektivitas', 
        resultUnit: 'Jam Kerja', 
        m3Conversion: 0, 
        desc: 'Vibratory Roller 12T - Compaction'
    },
    { 
        type: 'Grader', 
        img: 'Foto-Motor Grader Komatsu GD511A.png', 
        baseProfit: 50000, 
        ratePerJam: 900000, 
        perfValue: 1, 
        perfUnit: 'Efektivitas', 
        resultUnit: 'Jam Kerja', 
        m3Conversion: 0, 
        desc: 'Motor Grader - Road Maintenance'
    }
];

// FUNGSI RENDER KATALOG UTAMA
function renderUnits(area) {
    const wrapper = document.getElementById('unit-wrapper');
    wrapper.innerHTML = '';
    unitTypes.forEach(u => {
        wrapper.innerHTML += `
            <div class="unit-card" onclick="showDetail('${u.type}', '${area}')">
                <div class="image-box"><img src="${u.img}"></div>
                <div class="p-3">
                    <h6 class="fw-bold mb-1">${u.type} Series - ${area.toUpperCase()}</h6>
                    <span class="spec-badge">${u.desc}</span>
                </div>
            </div>`;
    });
}

// FUNGSI TAMPILAN DETAIL & GENERATOR KALKULATOR
function showDetail(type, area) {
    const u = unitTypes.find(x => x.type === type);
    document.getElementById('main-katalog').classList.add('d-none');
    document.getElementById('detail-page').classList.remove('d-none');
    
    document.getElementById('detail-galeri').innerHTML = `<img src="${u.img}" class="w-100 rounded-4" style="height:200px; object-fit:cover;">`;
    
    // Injeksi Struktur Kalkulator Dinamis
    document.getElementById('detail-info').innerHTML = `
        <h5 class="fw-bold mt-3">${u.type} Pro-Series</h5>
        <div class="calc-container shadow-sm mt-3">
            <div class="calc-header">Kalkulator Spesifikasi: ${u.type}</div>
            <div class="p-3">
                <label class="small fw-bold">PILIH TARGET HITUNG</label>
                <select id="calcMode" class="form-select mb-3" style="font-weight:700;" onchange="updateCalcLogic('${u.type}')">
                    <option value="cuan">Estimasi Keuntungan (Cuan)</option>
                    <option value="prod">Estimasi Produksi (${u.resultUnit})</option>
                </select>

                <div class="row g-2">
                    <div class="col-6">
                        <label class="small fw-bold">DURASI (JAM)</label>
                        <input type="number" id="inputHM" class="form-control mb-3" value="100" oninput="updateCalcLogic('${u.type}')">
                    </div>
                    <div class="col-6">
                        <label class="small fw-bold">${u.perfUnit.toUpperCase()}</label>
                        <input type="number" id="inputPerf" class="form-control mb-3" value="${u.perfValue}" oninput="updateCalcLogic('${u.type}')">
                    </div>
                </div>
                
                <div id="resBox" class="res-box res-positive">
                    <div id="resLabel" style="font-size:10px; font-weight:800; opacity:0.8; text-transform:uppercase;">HASIL ESTIMASI</div>
                    <div id="resAmount" class="res-amount">Rp 0</div>
                    <div id="resStatus" class="fw-bold small">READY TO ANALYZE</div>
                    <div id="resSaran" class="mt-2 text-start" style="font-size:11px; line-height:1.4; background:rgba(255,255,255,0.2); padding:10px; border-radius:8px;"></div>
                </div>
                <p class="text-muted mt-2 mb-0" style="font-size:9px;">*Menggunakan parameter Efisiensi Kerja 85% (Faktor Koreksi Lapangan).</p>
            </div>
        </div>
        <button class="btn btn-warning w-100 py-3 fw-bold rounded-4 mt-3 shadow" onclick="openBooking('${u.type}')">PESAN UNIT SEKARANG</button>`;
    
    updateCalcLogic(type);
    window.scrollTo(0,0);
}

// LOGIKA PERHITUNGAN DINAMIS PER UNIT
function updateCalcLogic(type) {
    const u = unitTypes.find(x => x.type === type);
    const mode = document.getElementById('calcMode').value;
    const jam = parseFloat(document.getElementById('inputHM').value) || 0;
    const perf = parseFloat(document.getElementById('inputPerf').value) || 0;
    const eff = 0.85; // Faktor Koreksi

    let finalResult = 0;
    let labelText = "";
    let apresiasi = "";

    // Hitung Produksi Kotor & Bersih
    // Jika Excavator: Perf = Ritase/jam. Jika Dozer: Perf = M3/siklus (asumsi 60 siklus/jam)
    let totalProduksiBersih = 0;
    if(u.type === 'Excavator') {
        totalProduksiBersih = Math.floor((jam * perf) * eff);
    } else if(u.type === 'Dozer') {
        totalProduksiBersih = Math.floor((jam * 60 * perf) * eff); // 60 siklus per jam
    } else {
        totalProduksiBersih = Math.floor(jam * eff);
    }

    if(mode === "cuan") {
        finalResult = totalProduksiBersih * u.baseProfit;
        labelText = "Estimasi Cuan Bersih";
        apresiasi = "Apresiasi: Strategi penggunaan unit " + u.type + " ini sangat sehat untuk cashflow proyek.";
        document.getElementById('resAmount').innerText = "Rp " + finalResult.toLocaleString('id-ID');
    } else {
        finalResult = totalProduksiBersih;
        labelText = "Total Output " + u.resultUnit;
        apresiasi = "Apresiasi: Target volume " + finalResult + " " + u.resultUnit + " ini akan mempercepat progres site secara signifikan.";
        document.getElementById('resAmount').innerText = finalResult.toLocaleString('id-ID') + " " + u.resultUnit;
    }

    document.getElementById('resLabel').innerText = labelText;
    document.getElementById('resSaran').innerHTML = `
        <strong>${apresiasi}</strong><br><br>
        <em>Catatan:</em> Angka ini adalah pertimbangan teknis Borneo Heavy. Perhitungan sudah termasuk jeda operasional, pengisian BBM, dan pergantian shift operator.`;
}

// --- FUNGSI PENDUKUNG ---
function updateStats() {
    const start = new Date("2026-01-01").getTime();
    const elapsed = Math.floor((new Date().getTime() - start) / 600000);
    document.getElementById('visitorCount').innerText = (3240 + elapsed).toLocaleString('id-ID');
    document.getElementById('consultCount').innerText = (856 + Math.floor(elapsed/3)).toLocaleString('id-ID');
}

function filterArea(area, btn) {
    document.querySelectorAll('.btn-area').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    renderUnits(area);
}

function backToKatalog() {
    document.getElementById('main-katalog').classList.remove('d-none');
    document.getElementById('detail-page').classList.add('d-none');
}

function openBooking(unit = "") {
    if(unit) document.getElementById('jenisUnitForm').value = unit;
    new bootstrap.Modal(document.getElementById('modalBooking')).show();
}

// Inisialisaso
updateStats();
renderUnits('samarinda');
