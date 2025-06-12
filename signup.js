document.addEventListener('DOMContentLoaded', () => {

  // Get the elements from your specific HTML using their new IDs
  const signupForm = document.getElementById('signup-form');
  const messageEl = document.getElementById('message');

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the form from reloading the page

    // Get the values from all the input fields
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // --- FRONTEND VALIDATION ---
    // Check if passwords match before sending to the backend
    if (password !== confirmPassword) {
      messageEl.textContent = 'Error: Passwords do not match!';
      messageEl.style.color = 'red';
      return; // Stop the function here
    }

    const userData = {
      username: username,
      email: email,
      password: password
    };

    // --- API CALL ---
    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (response.ok) {
        messageEl.textContent = 'Signup successful! You can now log in.';
        messageEl.style.color = 'green';
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        // Show the specific error from the backend (e.g., "Username already exists")
        messageEl.textContent = `Error: ${result.message}`;
        messageEl.style.color = 'red';
      }

    } catch (error) {
      console.error('Network or server error:', error);
      messageEl.textContent = 'Cannot connect to the server. Is it running?';
      messageEl.style.color = 'red';
    }
  });
});