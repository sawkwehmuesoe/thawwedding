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

            const scriptURL = 'https://script.google.com/macros/s/AKfycbxx3u5YLJc2nRbmrTseeqLlqiHweTvYiYET5gAQabols9RyqV_bcrEchsigJ9Y0uj8s/exec'; // Keep your existing URL here
            const form = document.forms['rsvpForm'];
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnSpinner = document.getElementById('btnSpinner');

            // Modal elements
            const thankYouModal = document.getElementById('thankYouModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const closeModalBtn = document.getElementById('closeModalBtn');

            if (form) {
                form.addEventListener('submit', e => {
                    e.preventDefault();

                    // 1. Show loading state on button
                    submitBtn.disabled = true;
                    btnText.innerText = "Sending...";
                    btnSpinner.style.display = "inline-block";

                    // 2. Prepare FormData and fix guest count logic
                    const formData = new FormData(form);
                    const isAttending = document.getElementById('attendYes').checked;

                    if (!isAttending) {
                        // Force guest count to 0 if they cannot attend
                        formData.set('guests', '0');
                        formData.set('custom_guests', '');
                    } else if (formData.get('guests') === 'custom') {
                        // Use the typed custom number if "More than 5" was selected
                        const customVal = document.getElementById('customGuestCount').value;
                        formData.set('guests', customVal || '6');
                    }

                    // 3. Send data to Google Sheets
                    fetch(scriptURL, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        // Customize popup text based on attendance
                        if (isAttending) {
                            modalTitle.innerText = "See You Soon!";
                            modalMessage.innerText = "Thank you for confirming your attendance. We are thrilled to celebrate our special day with you!";
                        } else {
                            modalTitle.innerText = "Thank You!";
                            modalMessage.innerText = "We will miss you on our special day, but we truly appreciate your warm wishes and response.";
                        }

                        // Show custom modal (no page reload!)
                        thankYouModal.style.display = "flex";

                        // Reset form and hide conditional fields
                        form.reset();
                        if (guestCountGroup) guestCountGroup.style.display = "none";
                        if (customCountWrapper) customCountWrapper.style.display = "none";
                    })
                    .catch(error => {
                        console.error("Error!", error.message);
                        modalTitle.innerText = "Oops!";
                        modalMessage.innerText = "Something went wrong while sending your response. Please try again.";
                        thankYouModal.style.display = "flex";
                    })
                    .finally(() => {
                        // Restore button state
                        submitBtn.disabled = false;
                        btnText.innerText = "Confirm Attendance";
                        btnSpinner.style.display = "none";
                    });
                });
            }

            // Close modal when clicking "Done" or clicking outside the card
            if (closeModalBtn && thankYouModal) {
                closeModalBtn.addEventListener('click', () => {
                    thankYouModal.style.display = "none";
                });

                thankYouModal.addEventListener('click', (e) => {
                    if (e.target === thankYouModal) {
                        thankYouModal.style.display = "none";
                    }
                });
            }