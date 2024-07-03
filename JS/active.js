!function (a) {
    "use strict";
    var t = a(window);

    // Fade out preloader on window load
    t.on("load", function () {
        a("#preloader").fadeOut("1000", function () {
            a(this).remove();
        });
    });

    // Initialize classyNav plugin
    a.fn.classyNav && a("#uzaNav").classyNav();

    // Initialize owlCarousel plugin
    if (a.fn.owlCarousel) {
        // Welcome slides carousel
        var o = a(".welcome-slides");
        o.owlCarousel({
            items: 1,
            loop: !0,
            autoplay: !0,
            smartSpeed: 1500,
            animateIn: "fadeIn",
            animateOut: "fadeOut",
            autoplayTimeout: 7e3,
            nav: !1
        });

        // Animation for welcome slides
        o.on("translate.owl.carousel", function () {
            a("[data-animation]").each(function () {
                var t = a(this).data("animation");
                a(this).removeClass("animated " + t).css("opacity", "0");
            });
        });

        // Set animation delay
        a("[data-delay]").each(function () {
            var t = a(this).data("delay");
            a(this).css("animation-delay", t);
        });

        // Set animation duration
        a("[data-duration]").each(function () {
            var t = a(this).data("duration");
            a(this).css("animation-duration", t);
        });

        // Reveal animations for welcome slides
        o.on("translated.owl.carousel", function () {
            o.find(".owl-item.active").find("[data-animation]").each(function () {
                var t = a(this).data("animation");
                a(this).addClass("animated " + t).css("opacity", "1");
            });
        });

        // Portfolio slides carousel
        a(".portfolio-sildes").owlCarousel({
            items: 4,
            margin: 50,
            loop: !0,
            autoplay: !0,
            smartSpeed: 1500,
            dots: !0,
            responsive: {
                0: { items: 1 },
                576: { items: 2 },
                992: { items: 3 },
                1400: { items: 4 }
            }
        });

        // Testimonial slides carousel
        a(".testimonial-slides").owlCarousel({
            items: 1,
            margin: 0,
            loop: !0,
            autoplay: !0,
            autoplayTimeout: 1e4,
            smartSpeed: 1500,
            nav: !0,
            navText: ['<i class="arrow_carrot-left"></i>', '<i class="arrow_carrot-right"></i>']
        });

        // Team slides carousel
        a(".team-sildes").owlCarousel({
            items: 4,
            margin: 50,
            loop: !0,
            autoplay: !0,
            smartSpeed: 1500,
            dots: !0,
            responsive: {
                0: { items: 1 },
                576: { items: 2 },
                992: { items: 3 },
                1400: { items: 4 }
            }
        });
    }

    // Initialize isotope plugin for portfolio
    if (a.fn.imagesLoaded) {
        a(".uza-portfolio").imagesLoaded(function () {
            a(".portfolio-menu").on("click", "button", function () {
                var o = a(this).attr("data-filter");
                t.isotope({ filter: o });
            });
            var t = a(".uza-portfolio").isotope({
                itemSelector: ".single-portfolio-item",
                percentPosition: !0,
                masonry: { columnWidth: ".single-portfolio-item" }
            });
        });
    }

    // Add active class to portfolio menu buttons
    a(".portfolio-menu button.btn").on("click", function () {
        a(".portfolio-menu button.btn").removeClass("active");
        a(this).addClass("active");
    });

    // Initialize magnificPopup plugin for video play
    a.fn.magnificPopup && a(".video-play-btn").magnificPopup({ type: "iframe" });

    // Initialize tooltip plugin
    a.fn.tooltip && a('[data-toggle="tooltip"]').tooltip();

    // Initialize WOW.js for animations on scroll
    t.width() > 767 && (new WOW).init();

    // Initialize jarallax plugin for parallax scrolling
    a.fn.jarallax && a(".jarallax").jarallax({ speed: .2 });

    // Initialize scrollUp plugin for scroll-to-top button
    a.fn.scrollUp && t.scrollUp({ scrollSpeed: 500, scrollText: '<i class="fa fa-angle-up"</i>' });

    // Add sticky class to main header on scroll
    t.on("scroll", function () {
        t.scrollTop() > 0 ? a(".main-header-area").addClass("sticky") : a(".main-header-area").removeClass("sticky");
    });

    // Initialize counterUp plugin for counters
    a.fn.counterUp && a(".counter").counterUp({ delay: 10, time: 1000 });

    // Prevent default action for anchor links with href="#"
    a('a[href="#"]').click(function (a) {
        a.preventDefault();
    });
}(jQuery);

