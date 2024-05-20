document.addEventListener('DOMContentLoaded', function() {
    const btnPopup = document.querySelector('.btnLogin-popup');
    const cover_box = document.querySelector('.cover_box'); // Note the underscore instead of dash
    console.log(cover_box); // Check if cover_box is correctly selected
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const iconClose = document.querySelector('.icon-close');

    function activateCoverBox() {
        cover_box.classList.add('active');
    }
    function deactivateCoverBox() {
        cover_box.classList.remove('active');
    }
    function activatePopup() {
        cover_box.classList.add('active-popup');
    }
    function deactivateCoverPopup() {
        cover_box.classList.remove('active-popup');
    }

    registerLink.addEventListener('click', activateCoverBox);
    loginLink.addEventListener('click', deactivateCoverBox);
    btnPopup.addEventListener('click', activatePopup);
    iconClose.addEventListener('click', deactivateCoverPopup);
});