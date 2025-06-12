// ===============================================
// THIS IS THE NEW COMBINED SCRIPT FOR YOUR HOMEPAGE
// It includes PDF logic, File Upload logic, and the new Authentication logic.
// ===============================================

// --- PDF CONVERSION LOGIC (Unchanged) ---
document.getElementById('convert-btn').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    pdf = new jsPDF('p', 'pt', 'a4');
    const images = document.querySelectorAll('#image-preview img');
    if (images.length === 0) {
        alert('Please upload at least one image.');
        return;
    }
    document.getElementById('loading-spinner').style.display = 'block';
    setTimeout(() => {
        images.forEach((img, index) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pageWidth = 595.28;
            const pageHeight = 841.89;
            let imgWidth = pageWidth;
            let imgHeight = (img.naturalHeight / img.naturalWidth) * pageWidth;
            if (imgHeight > pageHeight) {
                imgHeight = pageHeight;
                imgWidth = (img.naturalWidth / img.naturalHeight) * pageHeight;
            }
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            if (index > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
        });
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('download-btn').style.display = 'block';
    }, 2000);
});

// --- PDF DOWNLOAD LOGIC (Unchanged) ---
document.getElementById('download-btn').addEventListener('click', function() {
    if (pdf) {
        pdf.save('converted.pdf');
    } else {
        alert('Please convert images to PDF first.');
    }
});

// --- ACCOUNT POPUP TOGGLE LOGIC (Unchanged) ---
document.getElementById('account-btn').addEventListener('click', function(event) {
    let popup = document.getElementById('account-popup');
    event.stopPropagation();
    popup.classList.toggle('show');
});
document.addEventListener('click', function(event) {
    let popup = document.getElementById('account-popup');
    let button = document.getElementById('account-btn');
    if (!button.contains(event.target) && !popup.contains(event.target)) {
        popup.classList.remove('show');
    }
});


// ======================================================================
// --- ALL PAGE-LOAD LOGIC IS NOW INSIDE THIS ONE DOMContentLoaded ---
// ======================================================================
document.addEventListener("DOMContentLoaded", async () => {

 // -----------------------------------------------------------------
// --- NEW, SIMPLIFIED & FIXED: JWT-BASED AUTHENTICATION ---
// This version works with your CSS perfectly.
// -----------------------------------------------------------------

// Get all the navbar elements by their ID
const accountBtn = document.getElementById('account-btn');
const popupUserImage = document.getElementById('popup-user-image');
const popupUserName = document.getElementById('popup-user-name');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const profileBtn = document.querySelector('.account-option[onclick*="profile.html"]');

// Check for a token in localStorage
const token = localStorage.getItem('token');

if (token) {
    // USER IS LOGGED IN - Fetch data
    try {
        const response = await fetch('http://localhost:3000/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            setupLoggedOutState();
        } else {
            const userData = await response.json();
            setupLoggedInState(userData);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        setupLoggedOutState();
    }
} else {
    // USER IS LOGGED OUT
    setupLoggedOutState();
}

// Helper function to set up the "Logged In" UI
function setupLoggedInState(user) {
    if (accountBtn) accountBtn.classList.add('logged-in');
    if (popupUserImage) popupUserImage.classList.add('logged-in');
    if (popupUserName) popupUserName.textContent = user.username;
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (profileBtn) profileBtn.style.display = 'block';
}

// Helper function to set up the "Logged Out" UI
function setupLoggedOutState() {
    if (accountBtn) accountBtn.classList.remove('logged-in');
    if (popupUserImage) popupUserImage.classList.remove('logged-in');
    if (popupUserName) popupUserName.textContent = 'Guest';

    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (profileBtn) profileBtn.style.display = 'none';
}

// Event Listeners for login/logout
if(loginBtn) {
    loginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
}
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
    });
}


    // -----------------------------------------------------------------
    // --- FILE UPLOAD & DRAG/DROP LOGIC (Unchanged) ---
    // I moved this inside the main DOMContentLoaded listener.
    // -----------------------------------------------------------------
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadBtn = document.querySelector('.btn-primary');
    if (uploadArea && fileInput && imagePreview && uploadBtn) {
        let uploadedFiles = new Set();
        uploadBtn.addEventListener('click', function () {
            fileInput.value = '';
            fileInput.click();
        });
        fileInput.addEventListener('change', (event) => {
            event.preventDefault();
            handleFiles([...event.target.files]);
        });
        uploadArea.addEventListener('dragover', (event) => {
            event.preventDefault();
            uploadArea.style.border = '2px dashed #b7834c';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.border = '2px dashed #E0E0E0';
        });
        uploadArea.addEventListener('drop', (event) => {
            event.preventDefault();
            uploadArea.style.border = '2px dashed #E0E0E0';
            handleFiles([...event.dataTransfer.files]);
});
        function handleFiles(files) {
            files.forEach((file) => {
                if (file.type.startsWith('image/') && !uploadedFiles.has(file.name)) {
                    uploadedFiles.add(file.name);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imgContainer = document.createElement('div');
                        imgContainer.style.position = 'relative';
                        imgContainer.style.display = 'inline-block';
                        imgContainer.style.margin = '5px';
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100px';
                        img.style.height = '100px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '8px';
                        img.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        const removeBtn = document.createElement('button');
                        removeBtn.innerHTML = '✖';
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '5px';
                        removeBtn.style.right = '5px';
                        removeBtn.style.background = 'rgba(0, 0, 0, 0.7)';
                        removeBtn.style.color = 'white';
                        removeBtn.style.border = 'none';
                        removeBtn.style.borderRadius = '50%';
                        removeBtn.style.width = '24px';
                        removeBtn.style.height = '24px';
                        removeBtn.style.cursor = 'pointer';
                        removeBtn.style.fontSize = '14px';
                        removeBtn.style.display = 'flex';
                        removeBtn.style.alignItems = 'center';
                        removeBtn.style.justifyContent = 'center';
                        removeBtn.style.transition = '0.2s ease-in-out';
                        removeBtn.style.opacity = '0.8';
                        removeBtn.addEventListener('mouseover', () => {
                            removeBtn.style.opacity = '1';
                            removeBtn.style.transform = 'scale(1.1)';
                        });
                        removeBtn.addEventListener('mouseout', () => {
                            removeBtn.style.opacity = '0.8';
                            removeBtn.style.transform = 'scale(1)';
                        });
                        removeBtn.addEventListener('click', () => {
                            imagePreview.removeChild(imgContainer);
                            uploadedFiles.delete(file.name);
                        });
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(removeBtn);
                        imagePreview.appendChild(imgContainer);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }


    // -----------------------------------------------------------------
    // --- SCROLL ANIMATION LOGIC (Unchanged) ---
    // Moved here to the correct scope.
    // -----------------------------------------------------------------
    const faders = document.querySelectorAll('.fade-in');
    window.addEventListener('scroll', () => {
        faders.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    });
});