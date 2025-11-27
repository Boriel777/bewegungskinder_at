document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header.container.py-3');
    const scrollThreshold = 50; // start shrinking after 50px

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Restore on hover
    header.addEventListener('mouseenter', () => {
        header.classList.remove('scrolled');
    });
});
