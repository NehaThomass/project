document.addEventListener('DOMContentLoaded', function () {
  const locationInput = document.querySelector('.location-input');
  const searchInput = document.querySelector('.search-box input');
  const notepadIcon = document.querySelector('.header-right img[alt="Notepad"]');
  const cartIcon = document.querySelector('.header-right img[alt="Cart"]');
  const loginIcon = document.querySelector('.header-right img[alt="User Profile"]');

  // Location enter key
  locationInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const location = locationInput.value.trim();
      if (location) {
        localStorage.setItem('userLocation', location);
        window.location.href = 'services.html';
      } else {
        alert('Please enter your location.');
      }
    }
  });

  // Search input
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const location = locationInput.value.trim();
      const query = searchInput.value.trim();

      if (!location) {
        alert('Please enter your location first.');
        return;
      }

      if (!query) {
        alert('Please enter a service to search.');
        return;
      }

      localStorage.setItem('userLocation', location);
      localStorage.setItem('searchQuery', query);
      window.location.href = 'services.html';
    }
  });

  // Top icons
  notepadIcon.addEventListener('click', () => {
    window.location.href = 'notes.html';
  });

  cartIcon.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  loginIcon.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
});
