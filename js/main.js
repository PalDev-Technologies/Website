(function ($) {
    "use strict";

    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    new WOW().init();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 80) {
            $('.sticky-top').addClass('navbar-scrolled').css('top', '0');
            $('.sticky-top').addClass('bg-primary shadow-sm');
        } else {
            $('.sticky-top').removeClass('navbar-scrolled bg-primary shadow-sm');
        }
    });

    $('[data-toggle="counter-up"]').counterUp({ delay: 10, time: 2000 });

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

var LANG_STORAGE_KEY = 'paldev_lang';

function getStoredLanguage() {
    try {
        return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    } catch (e) {
        return 'en';
    }
}

function setStoredLanguage(lang) {
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {}
}

function toggleLanguage() {
    var current = getStoredLanguage();
    var next = current === 'ar' ? 'en' : 'ar';
    setStoredLanguage(next);
    setLanguage(next);
}

function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    var toggleBtns = document.querySelectorAll('#language-toggle, #language-toggle-mobile');
    toggleBtns.forEach(function (btn) {
        if (btn) btn.innerText = lang === 'ar' ? 'English' : 'العربية';
    });

    document.querySelectorAll('[data-en][data-ar]').forEach(function (el) {
        var text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
        if (text != null) el.innerText = text.trim();
    });

    var placeholders = document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]');
    placeholders.forEach(function (el) {
        var ph = lang === 'ar' ? el.getAttribute('data-placeholder-ar') : el.getAttribute('data-placeholder-en');
        if (ph != null) el.placeholder = ph;
    });

    try {
        document.dispatchEvent(new CustomEvent('paldev:languageChange', { detail: { lang: lang } }));
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function () {
    var lang = getStoredLanguage();
    setLanguage(lang);
    // Language toggle uses onclick="toggleLanguage()" in HTML to avoid double-firing
});
