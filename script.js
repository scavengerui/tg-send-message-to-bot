document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Configuration
    const BOT_TOKEN = '8055157674:AAFL5Oc6dEGSQfNFCI-dojYBey9vdVYPpd0';
    const CHAT_ID = '1047066800';
    const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    sendBtn.addEventListener('click', async () => {
        const text = messageInput.value.trim();

        if (!text) {
            showStatus('Please enter a message to send.', 'error');
            return;
        }

        // Disable UI while sending
        setLoading(true);

        try {
            // Updated to handle potential CORS issues by using no-cors mode for simple fire-and-forget
            // Or try standard fetch first. Given it's a browser, standard fetch might be blocked by CORS policy on telegram API.
            // However, let's try a direct fetch. If it fails, we catch it.
            
            const url = `${BASE_URL}?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`;

            // Note: Telegram API does not support CORS for browser requests directly usually. 
            // We use 'no-cors' mode which allows sending the request but we can't read the response.
            // This is "opaque" response.
            await fetch(url, {
                method: 'POST', // or GET
                mode: 'no-cors' 
            });

            // Since we can't read response in no-cors, we assume success if no network error occurred.
            // Clear input
            messageInput.value = '';
            showStatus('Message sent successfully!', 'success');
            
        } catch (error) {
            console.error('Error sending message:', error);
            showStatus('Failed to send message. Check console.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        sendBtn.disabled = isLoading;
        if (isLoading) {
            sendBtn.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
                </svg>
                <span>Sending...</span>
            `;
            // Add spinner styles dynamically if not in CSS, or just rely on simple text change
            // (We'll assume the simple change for now or add simple inline svg animation)
        } else {
            sendBtn.innerHTML = `
                <span>Send via Bot</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            `;
        }
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status show ${type}`;
        
        // Hide after 3 seconds
        setTimeout(() => {
            statusMessage.className = 'status';
        }, 3000);
    }
});
