// === login.js (Corrected & Bulletproofed) ===

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const messageEl = document.getElementById('message');

  // Guard clause: If the form doesn't exist on this page, do nothing.
  if (!loginForm) {
    return;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the page from reloading

    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    // Simple validation
    if (!emailInput.value || !passwordInput.value) {
      messageEl.textContent = 'Please enter both email/username and password.';
      messageEl.style.color = 'red';
      return;
    }

    const loginData = {
      loginIdentifier: emailInput.value,
      password: passwordInput.value,
    };

    // Show a "loading" message to the user
    messageEl.textContent = 'Logging in...';
    messageEl.style.color = '#333';

    try {
      // ✅ This URL points to your LIVE backend on Render. This is CORRECT.
      const response = await fetch('https://versapdf-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        // --- SUCCESS ---
        messageEl.textContent = result.message; // e.g., "Login successful!"
        messageEl.style.color = 'green';
        
        // Save the JWT token. This is how the user "stays logged in".
        localStorage.setItem('token', result.token);
        
        console.log('Login successful. Token saved to localStorage.');

        // Redirect to the dashboard page after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard.html'; // Or whatever your dashboard page is named
        }, 1000);

      } else {
        // --- FAILURE (e.g., wrong password, user not found) ---
        // Log the full error for better debugging
        console.error('API Error:', response.status, result.message);
        messageEl.textContent = `Error: ${result.message}`;
        messageEl.style.color = 'red';
      }

    } catch (error) {
      // --- CATASTROPHIC FAILURE (e.g., server is down, network error) ---
      console.error('A network or server error occurred:', error);
      messageEl.textContent = 'Cannot connect to the server. Please try again later.';
      messageEl.style.color = 'red';
    }
  });
});