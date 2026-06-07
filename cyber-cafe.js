const CYBER_SERVICES = [
    { id: 'pan-aadhaar', name: 'PAN & Aadhaar', desc: 'Apply, update or download e-copies instantly', icon: 'fa-id-card', color: '#1a96fc', bg: '#eff6ff', price: '₹150', eta: '1-2 days', rating: '4.9' },
    { id: 'form-filling', name: 'Online Form Filling', desc: 'Govt jobs, admissions, scholarships & more', icon: 'fa-file-alt', color: '#059669', bg: '#ecfdf5', price: '₹50', eta: 'Same day', rating: '4.8' },
    { id: 'printouts', name: 'Print & Scan', desc: 'Color/B&W printing with doorstep delivery', icon: 'fa-print', color: '#7c3aed', bg: '#f5f3ff', price: '₹5/page', eta: '30 mins', rating: '4.9' },
    { id: 'passport', name: 'Passport Application', desc: 'New passport or renewal with full guidance', icon: 'fa-passport', color: '#ea580c', bg: '#fff7ed', price: '₹300', eta: '2-3 days', rating: '4.7' },
    { id: 'other', name: 'Custom Request', desc: 'Any other online service — we\'ll handle it', icon: 'fa-plus-circle', color: '#64748b', bg: '#f1f5f9', price: 'Custom', eta: 'Varies', rating: '4.8' },
];

const CYBER_DOCS = {
    'pan-aadhaar': ['Aadhaar Card (original or photocopy)', 'Passport-size photo (white background)', 'Proof of Date of Birth', 'Signature on blank white paper'],
    'form-filling': ['Educational certificates & marksheets', 'Caste / Income certificate (if applicable)', 'Passport-size photos', 'Aadhaar & PAN card'],
    'printouts': ['PDF / Word / Image files to print', 'Paper size: A4, A3, or Legal', 'Colour or black & white', 'Number of copies'],
    'passport': ['Aadhaar & PAN Card', 'Birth Certificate or 10th Marksheet', 'Address proof', 'Old passport (if renewal)', 'Passport-size photos'],
    'other': []
};

let selectedService = null;

function renderCyberServices() {
    const grid = document.getElementById('cyberServiceGrid');
    grid.innerHTML = CYBER_SERVICES.map(s => `
        <div class="service-app-card" style="--svc-color:${s.color}" onclick="openCyberBooking('${s.id}')">
            <div class="svc-icon" style="background:${s.bg}; color:${s.color}"><i class="fas ${s.icon}"></i></div>
            <div class="svc-body">
                <h4>${s.name}</h4>
                <p>${s.desc}</p>
                <div class="svc-meta">
                    <span class="rating"><i class="fas fa-star"></i> ${s.rating}</span>
                    <span><i class="fas fa-clock"></i> ${s.eta}</span>
                </div>
                <div class="svc-footer">
                    <span class="svc-price">${s.price}</span>
                    <button class="svc-book-btn" style="background:${s.color}" onclick="event.stopPropagation(); openCyberBooking('${s.id}')">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openCyberBooking(serviceId) {
    selectedService = CYBER_SERVICES.find(s => s.id === serviceId);
    document.getElementById('cyberSheetTitle').textContent = 'Book: ' + selectedService.name;
    document.getElementById('cyberSheetSub').textContent = selectedService.desc + ' · ' + selectedService.price;

    const select = document.getElementById('cyberServiceSelect');
    select.value = serviceId;
    showCyberDocs(serviceId);

    document.getElementById('cyberBookingSheet').classList.add('open');
}

function closeCyberBooking() {
    document.getElementById('cyberBookingSheet').classList.remove('open');
}

function showCyberDocs(val) {
    const box = document.getElementById('cyberDocChecklist');
    const list = document.getElementById('cyberDocList');
    const items = CYBER_DOCS[val] || [];
    if (items.length === 0) {
        box.style.display = 'none';
        return;
    }
    list.innerHTML = items.map(d => `<li><i class="fas fa-check-circle"></i>${d}</li>`).join('');
    box.style.display = 'block';
}

function submitCyberRequest(e) {
    e.preventDefault();
    closeCyberBooking();
    document.getElementById('cyberSuccessOverlay').classList.add('open');
    document.getElementById('cyberSuccessService').textContent = selectedService?.name || 'Service';
}

function closeCyberSuccess() {
    document.getElementById('cyberSuccessOverlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCyberServices();
    document.getElementById('cyberServiceSelect').addEventListener('change', e => showCyberDocs(e.target.value));
});
