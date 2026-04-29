let selectedPlumberName = ""; 


window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.visibility = 'hidden'; }, 500);
    }
});


async function showPlumbers(serviceName) {
    document.getElementById('serviceTitle').innerText = serviceName;
    const response = await fetch('http://localhost:3000/api/plumbers');
    const data = await response.json();
    const list = document.getElementById('plumberList');
    list.innerHTML = "";

    data.forEach(p => {
        const isAvail = p.status === 'Available';
        list.innerHTML += `
            <div class="p-card bg-[#11162d] p-6 rounded-2xl border border-gray-800 shadow-xl">
                <h4 class="text-white font-bold text-center text-lg">${p.name}</h4>
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                    <span class="${isAvail ? 'text-green-500' : 'text-red-500'} font-bold text-[10px]">● ${p.status}</span>
                    <button onclick="openBookingForm('${p.name}')" ${isAvail ? '' : 'disabled'} 
                        class="px-4 py-2 rounded-lg text-[10px] font-bold ${isAvail ? 'bg-blue-600' : 'bg-gray-800'}">
                        BOOK NOW
                    </button>
                </div>
            </div>`;
    });
    document.getElementById('plumberModal').classList.remove('hidden');
}

function openBookingForm(name) {
    selectedPlumberName = name;
    document.getElementById('plumberModal').classList.add('hidden');
    document.getElementById('bookingFormModal').classList.remove('hidden');
    document.getElementById('bookingTitle').innerText = "बुकिंग: " + name;
}


async function submitBooking(event) {
    event.preventDefault();
    const bookingData = {
        custName: document.getElementById('custName').value,
        custMobile: document.getElementById('custMobile').value,
        custAddress: document.getElementById('custAddress').value,
        plumberName: selectedPlumberName
    };
    const response = await fetch('http://localhost:3000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    if (response.ok) {
        alert("Booking Done!");
        location.reload(); 
    }
}


function openLoginModal() { document.getElementById('loginModal').classList.remove('hidden'); }
function closeLoginModal() { document.getElementById('loginModal').classList.add('hidden'); }
function closeModal() { document.getElementById('plumberModal').classList.add('hidden'); }
function closeBookingModal() { document.getElementById('bookingFormModal').classList.add('hidden'); }

function checkLogin(event) {
    event.preventDefault();
    if (document.getElementById('adminID').value === "admin" && document.getElementById('adminPass').value === "123") {
        window.location.href = "admin.html";
    } else { alert("Wrong Password!"); }
}


function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) reveals[i].classList.add("active");
    }
}
window.addEventListener("scroll", reveal);
reveal();