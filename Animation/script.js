const rydrBrand = document.getElementById('rydr-brand');
const topSection = document.getElementById('topSection');
const slogan = document.getElementById('slogan');
const nextSections = document.querySelectorAll('.nextSection');

window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const topSectionTrigger = 50; // Adjust scroll trigger point (in pixels)
    const sloganTrigger = 200;
    const nextSectionTrigger = 300;

    // Hide the top section and show the brand name
    if (scrollPosition > topSectionTrigger) {
        topSection.style.opacity = 0;
        topSection.style.height = '0';
        rydrBrand.style.opacity = 1;
        rydrBrand.style.zIndex = -1;
        rydrBrand.classList.add('fadeInZoomIn');
        rydrBrand.style.animation = 'fadeInZoomIn 1s forwards';
    } else {
        topSection.style.opacity = 1;
        topSection.style.height = '100vh';
        rydrBrand.style.opacity = 0;
        rydrBrand.classList.remove('fadeInZoomIn');
        rydrBrand.style.animation = 'fadeOutZoomOut 1s forwards';
    }

    // Show the slogan
    if (scrollPosition > sloganTrigger) {
        slogan.style.top = '25vh'; // Adjust based on desired position
        slogan.style.opacity = 1;
    } else {
        slogan.style.top = '100vh';
        slogan.style.opacity = 0;
        // rydrBrand.remove();
    }

    // Show the next sections with animation
    if (scrollPosition > nextSectionTrigger) {
        nextSections.forEach(section => {
            section.classList.add('showNextSection');
            section.style.animation = 'slideUp 1s forwards';
        });
        slogan.style.opacity = 0; // Hide slogan when next section appears
        rydrBrand.style.opacity = 0; // Hide RYDR brand

        rydrBrand.style.animation = 'fadeOutZoomOut 1s forwards';
        // rydrBrand.style.position = 'relative'; // Make the brand name scroll with the page
    } else {
        nextSections.forEach(section => {
            section.classList.remove('showNextSection');
            section.style.animation = 'none';
        });
        rydrBrand.style.position = 'fixed'; // Keep the brand name fixed at the top
    }
});
