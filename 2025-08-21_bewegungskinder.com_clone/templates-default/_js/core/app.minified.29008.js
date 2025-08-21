var App = function () {

    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;
    var isIE11 = false;

    var responsive = true;

    var hasTouch = false;
    var isMobile = false

    var responsiveHandlers = [];

    var handleInit = function () {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);
        isIE11 = !!navigator.userAgent.match(/MSIE 11.0/);

        // Set touch variable
        hasTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

        if (isIE10) {
            jQuery('html').addClass('ie10'); // detect IE10 version
        }
        if (isIE11) {
            jQuery('html').addClass('ie11'); // detect IE11 version
        }

        if (hasTouch) {
            jQuery('html').addClass('touch'); // has Touche support
        }

        // Add mobile class
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            jQuery('html').addClass('mobile'); // is Mobile
            isMobile = true;
        }

        $('.hidden').removeClass('hidden').hide();
    };

    // runs callback functions set by App.addResponsiveHandler().
    var runResponsiveHandlers = function () {
        // reinitialize other subscribed elements
        for (var i in responsiveHandlers) {
            var each = responsiveHandlers[i];
            each.call();
        }
    };

    // handle the layout reinitialization on window resize
    var handleResponsiveOnResize = function () {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function () {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    runResponsiveHandlers();
                }, 50); // wait 50ms until window resize finishes.
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function () {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    runResponsiveHandlers();
                }, 50); // wait 50ms until window resize finishes.
            });
        }
    };

    var handleIEFixes = function () {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            jQuery('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {

                var input = jQuery(this);

                if (input.val() == '' && input.attr("placeholder") != '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function () {
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };

    var handleSearch = function () {
        $('.search-btn').click(function () {
            if ($('.search-btn').hasClass('show-search-icon')) {
                if ($(window).width() > 767) {
                    $('.search-box').fadeOut(300);
                } else {
                    $('.search-box').fadeOut(0);
                }
                $('.search-btn').removeClass('show-search-icon');
            } else {
                if ($(window).width() > 767) {
                    $('.search-box').fadeIn(300);
                } else {
                    $('.search-box').fadeIn(0);
                }
                $('.search-box input').focus();
                $('.search-btn').addClass('show-search-icon');
            }
        }).on('keypress', function (e) {
            var key = e.which || e.keyCode || 0;

            // enter or space key
            if (key === 13 || key === 32) {
                e.preventDefault();
                $(this).click();
            }
        });

        // close search box on body click
        if ($('.search-btn').size() != 0) {
            $('.search-box, .search-btn').on('click', function (e) {
                e.stopPropagation();
            });

            $('body').on('click', function () {
                if ($('.search-btn').hasClass('show-search-icon')) {
                    $('.search-btn').removeClass("show-search-icon");
                    $('.search-box').fadeOut(300);
                }
            });
        }
    };

    // Handles scrollable contents using jQuery SlimScroll plugin.
    var handleScrollers = function () {
        $('.scroller').each(function () {
            var height;
            if ($(this).attr("data-height")) {
                height = $(this).attr("data-height");
            } else {
                height = $(this).css('height');
            }
            $(this).slimScroll({
                allowPageScroll: true, // allow page scroll when the element scroll is ended
                size: '7px',
                color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
                railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
                position: App.isRTL() ? 'left' : 'right',
                height: height,
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                disableFadeOut: true
            });
        });
    };

    var handleMenu = function () {
        $(".header .navbar-toggle").click(function () {
            if ($(".header .navbar-collapse").hasClass("open")) {
                $(".header .navbar-collapse").slideDown(300)
                    .removeClass("open");
            } else {
                $(".header .navbar-collapse").slideDown(300)
                    .addClass("open");
            }
        });

        if (!App.isMobileLayout() && !App.hasTouchSupport()) {
            $('.header .header-navigation li.dropdown > a').on('click', function () {
                if (!$('body').hasClass('keyboard-navigation')) {
                    window.location.href = $(this).attr('href');
                }
            });
        }
    };
    var handleSubMenuExt = function () {
        $(".header-navigation .dropdown").on("hover", function () {
            if ($(this).children(".header-navigation-content-ext").show()) {
                if ($(".header-navigation-content-ext").height() >= $(".header-navigation-description").height()) {
                    $(".header-navigation-description").css("height", $(".header-navigation-content-ext").height() + 22);
                }
            }
        });
    };

    function handleDifInits() {
        $(".header .navbar-toggle span:nth-child(2)").addClass("short-icon-bar");
        $(".header .navbar-toggle span:nth-child(4)").addClass("short-icon-bar");
    }

    function handleUniform() {
        if (!jQuery().uniform) {
            return;
        }

        if ($('#main-content').hasClass('editable-content')) {
            return false;
        }

        var test = $("input[type=checkbox]:not(.toggle, .md-check), input[type=radio]:not(.toggle, .star, .md-radiobtn)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() == 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }

    var handleFancybox = function () {
        if (!jQuery.fancybox) {
            return;
        }

        if (jQuery(".fancybox-fast-view").size() > 0) {
            jQuery(".fancybox-fast-view").fancybox();
        }

        if (jQuery(".fancybox-button").size() > 0) {
            jQuery(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });

            $('.fancybox-video').fancybox({
                type: 'iframe'
            });
        }
    };

    // Handles Bootstrap Accordions.
    var handleAccordions = function () {
        jQuery('body').on('shown.bs.collapse', '.accordion.scrollable', function (e) {
            App.scrollTo($(e.target), -100);
        });

    };

    // Handles Bootstrap Tabs.
    var handleTabs = function () {
        // fix content height on tab click
        $('body').on('shown.bs.tab', '.nav.nav-tabs', function () {
            handleSidebarAndContentHeight();
        });

        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabid = location.hash.substr(1);
            $('a[href="#' + tabid + '"]').click();
        }
    };

    var handleMobiToggler = function () {
        var toggler = $(".mobi-toggler");

        if (toggler.length && toggler.attr('href').indexOf('http') === -1) {
            toggler.on("click", function (event) {
                event.preventDefault();//the default action of the event will not be triggered

                $(".header").toggleClass("menuOpened");
                $(".header").find(".header-navigation").toggle(300);
            });
        }
    };

    return {
        init: function () {
            // init core variables
            handleInit();
            handleResponsiveOnResize();
            handleIEFixes();
            handleFancybox();
            handleDifInits();
            handleAccordions();
            handleMenu();
            handleScrollers();
            handleSubMenuExt();
            handleMobiToggler();
            handleSearch();
        },

        initUniform: function (els) {
            if (!jQuery.uniform) {
                return;
            }
            if (els) {
                jQuery(els).each(function () {
                    if ($(this).parents(".checker").size() == 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            } else {
                handleUniform();
            }
        },

        // wrapper function to scroll(focus) to an element
        scrollTo: function (el, offeset) {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('head').data('fixed-header') === true) {
                    pos = pos - $('.header').height() - 30;
                }
                pos = pos + (offeset ? parseInt(offeset) : -1 * el.height());
            }

            jQuery('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        //public function to add callback a function which will be called on window resize
        addResponsiveHandler: function (func) {
            responsiveHandlers.push(func);
        },

        scrollTop: function () {
            App.scrollTo();
        },

        startPageLoading: function (options) {
            if (options && options.animate) {
                $('.page-spinner-bar').remove();
                $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            } else {
                $('.page-loading').remove();
                $('body').append('<div class="page-loading"><img src="' + Config.get('template-default') + '/images/loading-spinner-grey.gif" alt="Loading..."/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
            }
        },

        stopPageLoading: function () {
            $('.page-loading, .page-spinner-bar').remove();
        },

        hasTouchSupport: function () {
            if (hasTouch) return true;
            else return false;
        },

        isMobileLayout: function () {
            if (isMobile) return true;
            else return false;
        },

        // wrapper function to  block element(indicate loading)
        blockUI: function (options) {
            var options = $.extend(true, {}, options);
            var html = '';
            if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img style="" src="' + Config.get('template-default') + '/images/loading-spinner-grey.gif" alt="Loading..." align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : Language.get('loading')) + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img style="" src="' + Config.get('template-default') + '/images/loading-spinner-grey.gif" alt="Loading..." align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : Language.get('loading')) + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = options.target;
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        //check RTL mode
        isRTL: function () {
            return isRTL;
        },

        // wrapper function to  un-block element(finish loading)
        unblockUI: function (target) {
            if (target) {
                target.unblock({
                    onUnblock: function () {
                        target.css('position', '');
                        target.css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },

    };
}();