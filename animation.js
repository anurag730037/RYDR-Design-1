const rydrBrand = document.getElementById('rydr-brand');
const topSection = document.getElementById('topSection');
const slogan = document.getElementById('slogan');
const nextSections = document.querySelectorAll('.nextSection');

// Set initial styles for rydrBrand (outside any if block)
rydrBrand.style.opacity = 0; // Initially hidden
rydrBrand.style.transform = 'translate(-50%, -50%) scale(1)'; // Not zoomed in

window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const topSectionTrigger = 100; // Adjust scroll trigger point (in pixels)
    const sloganTrigger = 200;
    const nextSectionTrigger = 350;

    // Hide the top section and show the brand name
    // Hide the top section and show the brand name
    if (scrollPosition > topSectionTrigger) {

        topSection.style.opacity = 0;
        topSection.style.height = '0';
        topSection.style.opacity = 0;
        rydrBrand.style.opacity = 1;
        rydrBrand.style.zIndex = -1;
        rydrBrand.style.animation = 'fadeInZoomIn 1s forwards';

        console.log('Top Section Triggered')
    }
    else {
        topSection.style.opacity = 1;
        topSection.style.display = 'flex';
        rydrBrand.style.opacity = 0;
        rydrBrand.classList.remove('fadeInZoomIn');
        // rydrBrand.style.animation = 'fadeOutZoomOut 1s forwards';
    }

    // Show the slogan
    if (scrollPosition > sloganTrigger) {
        slogan.style.top = '25vh'; // Adjust based on desired position
        slogan.style.opacity = 1;

        console.log('Slogan Section Triggered')
    } else {
        slogan.style.top = '100vh';
        slogan.style.opacity = 0;
    }

    // Show/Hide next sections with animation
    if (scrollPosition > nextSectionTrigger) {
        slogan.style.opacity = 0; // Hide slogan when next section appears
        rydrBrand.style.opacity = 0; // Hide RYDR brand

        console.log('Next Section Triggered')
        rydrBrand.style.animation = 'fadeOutZoomOut 1s forwards';

        // Show next sections with animation

        nextSections.forEach(section => {
            section.classList.add('showNextSection');
            // section.style.animation = 'slideUp 1s forwards';
        });


    } else {
        rydrBrand.style.position = 'fixed'; // Keep the brand name fixed at the top
        // Hide next sections
        nextSections.forEach(section => {
            section.classList.remove('showNextSection');
            section.style.animation = 'none';
            section.style.transform = 'translateY(0)';
        });
    }
});


