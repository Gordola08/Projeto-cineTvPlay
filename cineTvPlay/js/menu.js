document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');
  
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });
  });
  