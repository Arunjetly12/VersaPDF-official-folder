document.addEventListener('DOMContentLoaded', async () => {
  // Find the elements using their NEW, unique IDs
  const welcomeMessage = document.getElementById('dashboard-welcome-heading');
  const userEmail = document.getElementById('dashboard-user-email');
  const logoutButton = document.getElementById('dashboard-logout-btn');

  // 1. Get the token from localStorage
  const token = localStorage.getItem('token');

  // 2. If no token, redirect to login page immediately
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 3. Fetch protected data from the server
  try {
    const response = await fetch('https://versapdf-backend.onrender.com/api/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }

    const userData = await response.json();

    // 4. Populate the page with the user's data
    welcomeMessage.textContent = `Welcome, ${userData.username}!`;
    userEmail.textContent = userData.email;

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    welcomeMessage.textContent = 'Error loading data. Please try logging in again.';
  }

  // 5. Handle logout
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
});