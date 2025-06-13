// === signup.js (Corrected & Bulletproofed) ===

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const messageEl = document.getElementById('message');

  // Guard clause: If the form doesn't exist on this page, do nothing.
  if (!signupForm) {
    return;
  }

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the page from reloading

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // --- Simple Frontend Validation ---
    if (!usernameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
        messageEl.textContent = 'Please fill out all fields.';
        messageEl.style.color = 'red';
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      messageEl.textContent = 'Error: Passwords do not match!';
      messageEl.style.color = 'red';
      return; // Stop the function here
    }

    const userData = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    // Show a "loading" message to the user
    messageEl.textContent = 'Creating account...';
    messageEl.style.color = '#333';

    try {
      // ✅ This URL points to your LIVE backend on Render. This is CORRECT.
      const response = await fetch('https://versapdf-backend.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // --- SUCCESS ---
        messageEl.textContent = 'Signup successful! Redirecting to login...';
        messageEl.style.color = 'green';
        console.log('Signup successful.');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login.html'; // Or whatever your login page is named
        }, 1500);

      } else {
        // --- FAILURE (e.g., username taken, invalid email) ---
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