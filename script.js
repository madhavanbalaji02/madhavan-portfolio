// Add JavaScript to handle dynamic behavior

// Smooth Scroll for Navigation Links
document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        // Prevent default behavior
        e.preventDefault();

        // Get the target section's ID
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Scroll to the section
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// Highlight Active Navigation Link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-links a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 50;
        const sectionHeight = section.offsetHeight;
        const scrollY = window.scrollY;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add Hover Effect to Circular Buttons
document.querySelectorAll('.circle-btn').forEach(button => {
    button.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.2)';
    });

    button.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Dynamic Footer Year
const yearElement = document.createElement('p');
yearElement.textContent = `© ${new Date().getFullYear()} Madhavan Balaji`;
yearElement.style.textAlign = 'center';
yearElement.style.marginTop = '10px';
document.querySelector('.footer').appendChild(yearElement);
