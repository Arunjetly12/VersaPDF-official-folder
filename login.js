document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('login-form');
  const messageEl = document.getElementById('message');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    const loginData = {
      loginIdentifier: email,
      password: password
    };

    try {
      const response = await fetch('https://versapdf-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (response.ok) {
        messageEl.textContent = result.message; // "Login successful!"
        messageEl.style.color = 'green';
        
        // --- THIS IS THE CRITICAL NEW PART ---
        // Save the token to localStorage. This is how the user "stays logged in".
        localStorage.setItem('token', result.token);
        console.log('Token saved to localStorage:', result.token);

        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);

      } else {
        messageEl.textContent = `Error: ${result.message}`;
        messageEl.style.color = 'red';
      }

    } catch (error) {
      console.error('Network or server error:', error);
      messageEl.textContent = 'Cannot connect to the server.';
      messageEl.style.color = 'red';
    }
  });
});
