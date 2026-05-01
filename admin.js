document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
    loadPlumbers();
});


async function loadBookings() {
    try {
        const response = await fetch('/api/admin/bookings');
        const bookings = await response.json();
        const tableBody = document.getElementById('bookingTable');
        if(!tableBody) return;
        tableBody.innerHTML = "";

        bookings.forEach((b, index) => {
            tableBody.innerHTML += `
                <tr class="border-b border-gray-800/50">
                    <td class="p-4 text-gray-600">${index + 1}</td>
                    <td class="p-4 font-bold text-white">${b.custName}</td>
                    <td class="p-4 text-blue-400 font-bold">${b.custMobile}</td>
                    <td class="p-4 text-gray-400 text-xs">${b.custAddress}</td>
                    <td class="p-4"><span class="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold border border-purple-500/20">${b.plumberName}</span></td>
                </tr>`;
        });
    } catch (e) { console.error("Error:", e); }
}

async function loadPlumbers() {
    try {
        const response = await fetch('/api/plumbers');
        const data = await response.json();
        const grid = document.getElementById('plumberGrid');
        if(!grid) return;
        grid.innerHTML = "";

        data.forEach((p) => {
            const statusClass = p.status === 'Available' ? 'text-green-500' : 'text-red-500';
            grid.innerHTML += `
                <div class="bg-[#11162d] border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-blue-500 transition">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-bold text-white uppercase italic">${p.name}</h4>
                        <span class="text-[10px] font-black uppercase ${statusClass}">● ${p.status}</span>
                    </div>
                    <select onchange="updateStatus('${p.name}', this.value)" class="w-full bg-[#0a0f1e] border border-gray-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500">
                        <option value="">Status Change...</option>
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>`;
        });
    } catch (e) { console.error("Error:", e); }
}


async function updateStatus(name, newStatus) {
    if (!newStatus) return;
    const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status: newStatus })
    });
    if (response.ok) {
        alert("Status Updated!");
        loadPlumbers();
    }
}