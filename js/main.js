(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

})(jQuery);

// Toggle language function
function toggleLanguage() {
    const currentLang = new URLSearchParams(window.location.search).get('lang') || 'en';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    // Set the new language and update the URL
    setLanguage(newLang);
    updateURLLanguage(newLang);
}

// Set language function
function setLanguage(lang) {
    // Set the lang attribute for HTML and direction for body
    document.documentElement.setAttribute('lang', lang);
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update language toggle button text
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) {
        langToggle.innerText = lang === 'ar' ? 'English' : 'Arabic';
    }

    // Set the text for all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.innerText = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    });

    // Update navbar links to maintain the language in the URL
    updateNavbarLinksLanguage(lang);

    // Update the layout specifically for RTL if needed
    updateLayoutForRTL(lang);
}

// Update navbar links to maintain language in URLs
function updateNavbarLinksLanguage(lang) {
    document.querySelectorAll('.navbar .nav-link').forEach(link => {
        let url = new URL(link.href, window.location.origin);
        url.searchParams.set('lang', lang);
        link.href = url.toString();
    });
}

// Update the URL parameter to keep track of the current language
function updateURLLanguage(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
}

// Update layout specifically for RTL
function updateLayoutForRTL(lang) {
    const isRTL = lang === 'ar';

    // Adjust breadcrumb alignment for RTL
    const breadcrumbNav = document.querySelector('.breadcrumb-nav');
    if (breadcrumbNav) {
        breadcrumbNav.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        const breadcrumbItems = breadcrumbNav.querySelectorAll('.breadcrumb-item');
        
        // Update the breadcrumb separators dynamically
        if (isRTL) {
            breadcrumbItems.forEach((item, index) => {
                if (index < breadcrumbItems.length - 1) {
                    item.style.display = 'inline-block';
                    item.insertAdjacentHTML('afterend', '<span class="breadcrumb-separator"> / </span>');
                }
            });
        } else {
            // Remove any existing breadcrumb separators for LTR
            document.querySelectorAll('.breadcrumb-separator').forEach(separator => {
                separator.remove();
            });
        }
    }

    // Adjust other elements if necessary
    const heroHeader = document.querySelector('.hero-header');
    if (heroHeader) {
        heroHeader.style.textAlign = isRTL ? 'right' : 'left';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Get current language from URL or default to 'en'
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get('lang') || 'en';
    
    // Set the language on page load
    setLanguage(currentLang);

    // Add event listener for language toggle button
    const languageToggleButton = document.getElementById('language-toggle');
    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', toggleLanguage);
    }
});
