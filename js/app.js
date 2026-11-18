// Wedding Countdown Timer
const weddingDate = new Date("November 28, 2026 09:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

// Run immediately and update every second
updateCountdown();
setInterval(updateCountdown, 1000);


// Toggle "How many people?" field based on RSVP selection
// Toggle "How many people?" field based on RSVP selection
const attendYes = document.getElementById("attendYes");
const attendNo = document.getElementById("attendNo");
const guestCountGroup = document.getElementById("guestCountGroup");
const guestCountSelect = document.getElementById("guestCount");
const customCountWrapper = document.getElementById("customCountWrapper");
const customGuestCount = document.getElementById("customGuestCount");

if (attendYes && attendNo && guestCountGroup) {
    attendYes.addEventListener("change", () => {
        if (attendYes.checked) {
            guestCountGroup.style.display = "block";
        }
    });

    attendNo.addEventListener("change", () => {
        if (attendNo.checked) {
            guestCountGroup.style.display = "none";
            // Reset custom input when changing mind
            if (customCountWrapper) customCountWrapper.style.display = "none";
            if (guestCountSelect) guestCountSelect.value = "1";
        }
    });
}

// Toggle custom number input if "More than 5" is selected
if (guestCountSelect && customCountWrapper) {
    guestCountSelect.addEventListener("change", () => {
        if (guestCountSelect.value === "custom") {
            customCountWrapper.style.display = "block";
            customGuestCount.setAttribute("required", "true");
        } else {
            customCountWrapper.style.display = "none";
            customGuestCount.removeAttribute("required");
            customGuestCount.value = ""; // clear value
        }
    });
}