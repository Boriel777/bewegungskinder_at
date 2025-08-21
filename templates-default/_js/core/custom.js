//# sourceURL=/templates-default/_js/core/custom.js
/**
 Custom App module for overwrite the original functions
 **/
var Custom = function () {

    // private functions & variables

    // Handles Bootstrap Tabs.
    var handleTabs = function () {
        // fix content height on tab click
        $('body').on('shown.bs.tab', '.nav.nav-tabs', function () {
            //App.handleSidebarAndContentHeight();
        });

        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabs = location.hash.split('#');

            for (var i = 0; i < tabs.length; ++i) {
                if (tabs[i]) {
                    var tab = tabs[i];
                    setTimeout(function () {
                        $('a[href="#' + tab + '"]').click();
                    }, 500);
                }
            }
        }
    };

    // Handles Image Preview using jQuery Fancybox plugin
    var handleFancybox = function () {
        if (!jQuery.fancybox) {
            return;
        }
        if (jQuery(".fancybox-button").size() > 0) {
            jQuery(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'elastic',
                nextEffect: 'elastic',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    };

    // Confirm
    var handleConfirm = function () {
        $('a[data-confirm]').on('click', function () {
            var href = $(this).attr('href');

            swal({
                type: 'question',
                title: Language.get('question'),
                html: $(this).attr('data-confirm'),
                showCancelButton: true,
                showCloseButton: false,
                focusConfirm: false,
                focusCancel: true,
                allowOutsideClick: false,
                confirmButtonText: Language.get('yes'),
                cancelButtonText: Language.get('no')
            }).then(function (result) {
                if (result.value) {
                    goTo(href);
                    return true;
                }
            });

            return false;
        });
    };

    // Ajax Modal
    var handleAjaxModal = function () {

        $('a[data-target="ajax"]').unbind('click').on('click', function (ev) {
            var href = $(this).attr('href'),
                oldContent = $('#dataConfirmModal'),
                oldBackDrop = $('.modal-backdrop');

            if (oldContent.length) oldContent.remove();
            if (oldBackDrop.length) oldBackDrop.remove();

            $('body').append('<div class="modal fade" id="dataConfirmModal" tabindex="-1" role="basic" aria-hidden="true"><img src="/templates-default/images/ajax-modal-loading.gif" alt="" class="loading"></div>');

            var content = $('#dataConfirmModal');

            if (window.hasOwnProperty('offsetScroll')) {
                content.css('padding-top', window.offsetScroll + 'px');
            }

            $.ajax({
                type: "GET",
                cache: false,
                url: href,
                dataType: "html",
                success: function (res) {
                    content.html(res);
                    App.initUniform(content);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    content.html('<h4>' + Language.get('ajax_load_error') + '</h4>');
                },
                async: false
            });

            content.modal({show: true});

            return false;
        });
    };

    var handleFixedHeader = function () {
        if (!App.isMobileLayout() && !App.hasTouchSupport() && !document.location.search.indexOf('?ce=1') === -1) {
            if (jQuery('.header').outerHeight() > 100) {
                jQuery("body").addClass("large-header");
            }
            jQuery(window).scroll(function () {
                if (jQuery(window).scrollTop() > 37) {
                    jQuery("body").addClass("page-header-fixed");
                } else {
                    jQuery("body").removeClass("page-header-fixed");
                }
            });
        }
    };

    // Handles Bootstrabs Select
    var handleBootstrapSelect = function () {
        if (!jQuery().selectpicker) {
            return;
        }
        if ($('#main-content').hasClass('editable-content')) {
            return false;
        }

        $('.bs-select').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check',
            noneResultsText: Language.get('no_result'),
            countSelectedText: Language.get('x_of_x_selected'),
            noneSelectedText: Language.get('choose')
        });
    };

    // Handles Bootstrap Accordions.
    var handleAccordions = function () {
        jQuery('body').on('shown.bs.collapse', '.accordion.scrollable', function (e) {
            App.scrollTo($(e.target), -100);
        });

    };

    // last popep popover
    var lastPopedPopover;

    var handlePopovers = function () {
        jQuery('.popovers').popover();

        // close last poped popover

        $(document).on('click.bs.popover.data-api', function (e) {
            if (lastPopedPopover) {
                lastPopedPopover.popover('hide');
            }
        });
    };

    // Handles Bootstrap Tooltips.
    var handleTooltips = function () {
        // global tooltips
        $('.tooltips').tooltip({container: 'body'});

        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen').tooltip({
            container: 'body',
            title: 'Fullscreen'
        });
        $('.portlet > .portlet-title > .tools > .reload').tooltip({
            container: 'body',
            title: 'Reload'
        });
        $('.portlet > .portlet-title > .tools > .remove').tooltip({
            container: 'body',
            title: 'Remove'
        });
        $('.portlet > .portlet-title > .tools > .config').tooltip({
            container: 'body',
            title: 'Settings'
        });
        $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
            container: 'body',
            title: 'Collapse/Expand'
        });
    };

    var handleBootstrap = function () {
        if (document.location.href.indexOf('ce=1') === -1) {
            jQuery('.carousel').carousel();
            normalizeCarousel(jQuery('.carousel'));
        }
        jQuery('.popovers').popover();
    };

    var normalizeCarousel = function (objects) {
        $.each(objects, function (i, obj) {
            var items = $('.item', obj), //grab all slides
                heights = [], //create empty array to store height values
                tallest; //create variable to make note of the tallest slide

            if (items.length) {
                function normalizeHeights() {
                    items.each(function () { //add heights to array
                        heights.push($(this).height());
                    });
                    tallest = Math.max.apply(null, heights); //cache largest value
                    items.each(function () {
                        $(this).css('min-height', tallest + 'px');
                    });
                };
                normalizeHeights();

                $(window).on('resize orientationchange', function () {
                    tallest = 0, heights.length = 0; //reset vars
                    items.each(function () {
                        $(this).css('min-height', '0'); //reset min-height
                    });
                    normalizeHeights(); //run it again
                });
            }
        });
    };

    var handleOWL = function () {
        if (!jQuery.owlCarousel) {
            return;
        }
        $(".owl-carousel3").owlCarousel({
            items: 3,
            loop: true,
            margin: 20,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: true,
                    loop: true
                },
                480: {
                    items: 2,
                    nav: true,
                    loop: true
                },
                600: {
                    items: 3,
                    nav: false,
                    loop: true
                }
            }
        });
    };

    // Revolution Slider
    var handleSlider = function () {
        //setTimeout("", 1000);
        //jQuery('#revolutionul').show();

        if (!$('div.fullwidthabnner').length) {
            return;
        }

        if (!jQuery().revolution) {
            return false;
        }

        $('#revolutionul').show();
        $('div.fullwidthabnner').revolution(
            {
                delay: 2000,
                startheight: 380,
                startwidth: 1150,

                hideThumbs: 10,

                thumbWidth: 100,                   // Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
                thumbHeight: 50,
                thumbAmount: 5,

                navigationType: "bullet",          // bullet, thumb, none
                navigationArrows: "solo",          // nexttobullets, solo (old name verticalcentered), none

                navigationStyle: "round",          // round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom


                navigationHAlign: "center",        // Vertical Align top,center,bottom
                navigationVAlign: "bottom",        // Horizontal Align left,center,right
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 20,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 20,
                soloArrowRightVOffset: 0,

                touchenabled: "on",                // Enable Swipe Function : on/off
                onHoverStop: "on",                 // Stop Banner Timet at Hover on Slide on/off

                stopAtSlide: -1,
                stopAfterLoops: -1,

                hideCaptionAtLimit: 0,							// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
                hideAllCaptionAtLilmit: 0,					// Hide all The Captions if Width of Browser is less then this value
                hideSliderAtLimit: 0,							// Hide the whole slider, and stop also functions if Width of Browser is less than this value

                shadow: 1,                         //0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
                fullWidth: "on"                    // Turns On or Off the Fullwidth Image Centering in FullWidth Modus
            });
    };

    var handleNavigation = function () {
        $('.touch .header-navigation a.dropdown-toggle').on('click', function (event) {
            var $this = $(this);

            // open link if not clicked on dropdown icon
            if ($(event.target, $this).hasClass('dropdown-toggle') && !$(event.target, $this).hasClass('empty')) {
                event.preventDefault();
                Custom.setLocation($this.attr('href'));
                return false;
            }
        });
    };

    var handleLogin = function () {

        $('a[data-target="login"]').unbind('click').on('click', function (ev) {
            var href = $(this).attr('href'),
                oldContent = $('#dataConfirmModal'),
                oldBackDrop = $('.modal-backdrop'),
                laddaLoginBtn = typeof (Ladda) == 'object'
                    ? Ladda.create($(this)[0])
                    : false;

            ev.preventDefault();

            laddaLoginBtn.start();

            if (oldContent.length) oldContent.remove();
            if (oldBackDrop.length) oldBackDrop.remove();

            $('body').append('<div class="modal fade" id="dataConfirmModal" tabindex="-1" role="basic" aria-hidden="true"><img src="/templates-default/images/ajax-modal-loading.gif" alt="" class="loading"></div>');

            var confirmModal = $('#dataConfirmModal');

            confirmModal.modal({show: true});

            $.ajax({
                type: "GET",
                cache: false,
                url: href,
                dataType: "html",
                success: function (res) {
                    confirmModal.html(res);
                    App.initUniform(confirmModal);

                    if (typeof Auth === 'object') {
                        Auth.init();
                    }

                    var $form = $('form', confirmModal)

                    Custom.initFormToken($form);

                    $form.on('submit', function (e) {
                        e.preventDefault();

                        var $this = $(this),
                            ladda = typeof (Ladda) == 'object'
                                ? Ladda.create($(this).find('input[type="submit"],button[type="submit"]')[0])
                                : false;

                        ladda.start();

                        $.ajax({
                            type: 'POST',
                            url: $this.attr('action'),
                            data: {
                                email: $('#email', confirmModal).val(),
                                password: $('#password', confirmModal).val(),
                                token: $('.form_token', confirmModal).val(),
                                msg: $('.form_message', confirmModal).val(),
                                captcha: $('input[name="captcha"]', confirmModal).val(),
                                autologin: $('#autoLogin', confirmModal).is(':checked') ? 1 : 0
                            },
                            success: function (c) {
                                if (c === 'done') {
                                    window.location.reload();
                                    confirmModal.modal('hide');
                                    Custom.blockUI({target: $('body'), iconOnly: true});
                                } else if (c && (c === 'error' || c.length > 20 || $this.attr('action').indexOf('/forgot/') > -1)) {
                                    Custom.alert(c === 'error' ? 'E-Mail oder Passwort sind falsch!' : c);
                                    $('#email').val('');
                                    $('#password').val('');
                                    ladda.stop();

                                    confirmModal.modal('hide');
                                    $('a[data-target="login"]').click();
                                }
                            }
                        });

                        return false;
                    })
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    confirmModal.html('<h4>' + Language.get('ajax_load_error') + '</h4>');
                },
                async: false
            });

            confirmModal.on('hidden.bs.modal', function () {
                laddaLoginBtn.stop();
            });

            return false;
        });
    };

    // Ajax Modal
    var handleAjaxSwal = function () {
        $('a[data-target="swal"]:not(.ajax-initiated)').unbind('click').on('click', function () {
            var $this = $(this),
                width = $this.data('width') ? $this.data('width') : 600,
                table = $('#' + $this.data('table')),
                id = $this.data('id'),
                url = $this.data('url'),
                data = [];

            // check ajax options
            if ($(this).data('swal-option') === 'once') {
                $this.data('target', null);
                $this.unbind('click');
            }

            // hide elements on load
            $this.find('[data-hide="swal"]').fadeOut();

            // mark ajax link as initiated
            $(this).addClass('ajax-initiated').blur();

            // add selected id from table
            if (table.length > 0) {
                $('input[name="id[]"]:checked', table).each(function () {
                    var id = $(this).val();
                    data.push(id);
                });

                if (data.length === 0) {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: Language.get('no_item_select')
                    }).then(function (result) {
                        if (result) {
                            $('.checker').pulsate({
                                color: "#ff0000",
                                repeat: 10
                            });
                        }
                    });

                    return false;
                }
            }

            // add single id
            if (id) {
                data.push(id);
            }

            // open sweet alerts
            swal({
                html: '<div style="padding:3em"><em class="fa fa-circle-o fa-4x fa-spin"></em></div>',
                width: window.innerWidth > width ? width : window.innerWidth,
                allowOutsideClick: !$this.data('forbidden-outside-click'),
                showCloseButton: true,
                showCancelButton: !$this.data('hide-buttons'),
                showConfirmButton: false,
                cancelButtonText: Language.get('close'),
                focusConfirm: false,
                allowEnterKey: false,
                onOpen: function () {
                    // load ajax contents
                    setTimeout(function () {
                        $.ajax({
                            type: 'GET',
                            cache: false,
                            url: $this.attr('href'),
                            dataType: 'html',
                            success: function (html) {
                                // wrap html
                                html = $('<div class="text-left">' + html + '</div>');

                                // remove container class
                                html.find('.container').removeClass('container');

                                // set title
                                var title = html.find('.ajax-title:visible');

                                if (title.length) {
                                    $('#swal2-title').html(title.html());
                                    title.remove();
                                }

                                // set contents
                                $('#swal2-content').html(html);

                                // close on click
                                html.find('[data-dismiss="swal"]').click(function () {
                                    swal.close();
                                    return false;
                                });

                                // re-init ajax methods
                                Custom.initAjax();

                                // hide element, if defined
                                if ($this.data('swal-hide-on-open')) {
                                    $($this.data('swal-hide-on-open')).fadeOut();
                                }

                                // check form is given and put ids from table into form
                                var form = $('form', html);

                                if (form.length) {
                                    var submitBtn = form.find('[type="submit"]'),
                                        ladda = typeof (Ladda) == 'object'
                                            ? Ladda.create(submitBtn[0])
                                            : false;

                                    form.on('submit', function () {
                                        ladda.start();
                                    });

                                    if (data.length) {
                                        // set redirect url
                                        if (url) $('#url', form).val(url);

                                        // add selected id's from table
                                        for (var i = 0; i < data.length; i++) {
                                            form.append('<input type="hidden" name="data[]" value="' + data[i] + '">');
                                        }
                                    }
                                }

                                // run callback, if defined
                                if ($this.data('swal-callback')) {
                                    var fn = '';
                                    $.each($this.data('swal-callback').split('.'), function (i, f) {
                                        if (!fn && window.hasOwnProperty(f)) {
                                            fn = window[f];
                                        } else if (fn.hasOwnProperty(f) && typeof (fn[f]) === 'function') {
                                            fn[f]();
                                        }
                                    });
                                }
                            },
                            error: function () {
                                $('#swal2-content').html(Language.get('ajax_load_error'));
                            },
                            async: false
                        });
                    }, 200);
                }
            });

            return false;
        });
    };

    var handleThirdPartyIframes = function () {
        $('.embedded-third-party').each(function () {
            var info = $(this).data('info'),
                type = $(this).data('type'),
                suffix = $(this).data('suffix');

            $(this).html('');

            if (location.href.indexOf('ce=') === -1) {
                if ($.cookie('tp_' + type)) {
                    $('.embedded-third-party[data-type="' + type + '"]').each(function () {
                        enableThirdPartyIframe($(this));
                    });
                } else {
                    $(this).append('<div class="info">' +
                        '<span>' + info + '<a href="/privacy/">' + Language.get('more_info') + '</a></span>' +
                        '<a href="javascript:void(0)" class="play"></a>' +
                        '<label><input type="checkbox" checked />' + suffix + '</label>' +
                        '</div>');

                    $(this).find('a.play').click(function () {
                        var container = $(this).closest('.embedded-third-party'),
                            type = container.data('type'),
                            enabled = container.find('input').is(':checked');

                        enableThirdPartyIframe(container, true);

                        if (enabled) {
                            $.cookie('tp_' + type, 1, {expires: 365, path: '/'});
                            $('.embedded-third-party[data-type="' + type + '"]').each(function () {
                                enableThirdPartyIframe($(this));
                            });
                        }
                    });
                }
            }
        });
    };

    var enableThirdPartyIframe = function (container, autoplay) {
        var src = container.attr('src');

        if (autoplay) {
            src += (src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
        }

        var scrolling = container.attr('scrolling') || 'no';

        container
            .replaceWith('<iframe ' +
                'src="' + src + '"' +
                'width="' + container.attr('width') + '" ' +
                'height="' + container.attr('height') + '"' +
                'class="' + container.attr('class') + '"' +
                'allowfullscreen frameborder="0" scrolling="' + scrolling + '"' +
                '></iframe>');
    };

    var handleAlert = function () {
        $('[data-alert]').unbind('click').on('click', function () {
            Custom.alert($(this).data('alert'), $(this).data('callback'), $(this).data('param'));
        });
    };

    var handleInputFields = function () {
        $('input[id^="inputId-"]').each(function () {
            var name = $(this).attr('name'),
                type = $(this).data('type'),
                newName = atob(name.split('-')[1])
            ;

            if (type) {
                $(this).attr('type', type);
            }

            if (newName.indexOf('pass') > -1) {
                if ($(this).val().length > 0) {
                    $(this).attr('type', 'password')
                } else {
                    $(this).focus(function () {
                        $(this).attr('type', 'password')
                    });
                }
            }
        });
    }

    var handleUserGroup = function () {
        $('#group').on('change', function () {
            var hasPassword = $('option:selected', $(this)).data('has-password'),
                groupPassword = $('#groupPassword');

            if (hasPassword) {
                groupPassword.show('fast');
            } else {
                groupPassword.hide('fast');
            }
        });
    }

    var handleCheckUserGroupPassword = function () {
        $('#group_password').on('change', function () {
            var form = $('form'),
                groupPassword = $('#groupPassword'),
                password = $(this),
                group = $('#group'),
                groupSelect = $('option:selected', group),
                groupId = groupSelect.data('group-id');

            Custom.blockUI({target: form, iconOnly: true});

            $.ajax({
                url: Config.get('base-url') + '/account/check-group-password/' + groupId + '/',
                type: "GET",
                dataType: 'json',
                data: {
                    password: password.val()
                },
            }).done(function (result) {
                if (result.error === false) {
                    swal({
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                } else {
                    password.val('');
                    groupPassword.hide('fast');
                    group.val('');
                    group.prop("selected", false)
                    group.selectpicker('refresh');
                    swal({type: 'error', title: result.msg});
                }

                Custom.unblockUI(form);
            });
        });
    }

    /**
     * Handles web accessibility features by toggling a CSS class on the body element
     * based on user interaction. This helps to distinguish between keyboard navigation
     * and mouse usage, allowing for improved accessibility styling.
     *
     * Detects tab key presses to enable keyboard navigation mode by adding the
     * 'keyboard-navigation' class to the body element. Removes the class when
     * mouse movement is detected, signaling a transition back to mouse input.
     */
    var handleWebAccessibility = function () {
        var $body = $('body');

        // detect tab change
        $body.on('keydown', function (e) {
            var key = e.which || e.keyCode || 0;
            if (key === 9 && !$body.hasClass('keyboard-navigation')) {
                $body.addClass('keyboard-navigation');
            }
        });

        // detect mouse move
        $body.mousemove(function (e) {
            if ($body.hasClass('keyboard-navigation')) {
                $body.removeClass('keyboard-navigation')
            }
        });

        // accessibility settings
        var $settings = $('#accessibility-settings'),
            contrastMode = (localStorage.getItem('contrast-mode') || 'false') === 'true',
            zoom = parseInt(localStorage.getItem('document-zoom') || 100);

        $settings
            .removeAttr('title')
            .tooltip()
            .popover({
                placement: 'bottom',
                trigger: 'click',
                html: true,
                title: $settings.attr('aria-label'),
                content: '<div class="text-center"><button id="contrastToggle" data-placement="left" title="' + $settings.data('contrast-title') + '" aria-label="' + $settings.data('contrast-title') + '" class="btn btn-sm' + (contrastMode ? ' enabled' : '') + '"><em class="fa fa-adjust margin-right-0"></em></button><a id="decreaseFontSize" data-placement="left" title="' + $settings.data('decrease-title') + '"  href="javascript:" class="btn btn-sm btn-default">-</a> <span id="currentFontSize"><span>' + zoom + '</span>%</span> <a id="increaseFontSize" data-placement="right" title="' + $settings.data('increase-title') + '"  href="javascript:" class="btn btn-sm btn-default">+</a></div>',
            })
            .on('inserted.bs.popover', function () {
                var $this = $(this),
                    $contrastToggle = $('#contrastToggle'),
                    $increaseButton = $('#increaseFontSize'),
                    $decreaseButton = $('#decreaseFontSize'),
                    $currentFontSize = $('#currentFontSize > span');

                // set current font size text
                $currentFontSize.text(zoom);

                // methods
                var closeFontSizePopup = function () {
                    $this.popover('hide');
                    $this.data('bs.popover').inState.click = false;
                    $body.off('.font_size');
                }

                // set font size
                var updateFontSize = function () {
                    $currentFontSize.text(zoom);
                    localStorage.setItem('document-zoom', zoom);
                    $body.css({'zoom': zoom / 100});
                }

                // handle tooltips
                $this.tooltip('hide');
                $contrastToggle.tooltip({container: 'body'});
                $increaseButton.tooltip({container: 'body'});
                $decreaseButton.tooltip({container: 'body'});

                // hide on outside click
                $body.on('click.font_size', function (e) {
                    if ($(e.target).parent().attr('id') !== $this.attr('id') && $('div.popover').length > 0 && !$(e.target).parents().is('.popover.in')) {
                        closeFontSizePopup();
                    }
                });

                // hide on esc keyboard
                $body.on('keydown.font_size', function (e) {
                    var key = e.which || e.keyCode || 0;
                    if (key === 27) {
                        closeFontSizePopup();
                    }
                });

                // show popover
                $(this).blur();
                if ($body.hasClass('keyboard-navigation')) {
                    $increaseButton.focus();
                }

                // increase font size
                $increaseButton.click(function () {
                    zoom += 10;
                    if (zoom > 300) zoom = 300;
                    updateFontSize();
                    $increaseButton.tooltip('destroy');
                });

                // decrease font size
                $decreaseButton.click(function () {
                    zoom -= 10;
                    if (zoom < 50) zoom = 50;
                    updateFontSize();
                    $decreaseButton.tooltip('destroy');
                });

                // toggle contrast mode
                $contrastToggle.click(function () {
                    $(this).toggleClass('enabled').tooltip('destroy').blur();
                    $body.toggleClass('high-contrast-mode');
                    localStorage.setItem('contrast-mode', $(this).hasClass('enabled'));
                });
            });

        // text to speech (currently for captchas only)
        if (typeof (SpeechSynthesisUtterance) === 'function') {
            // handle speech
            var handleSpeech = function (obj, text) {
                // hide tooltip
                obj.tooltip('hide');

                // add spaces, to read captcha char by char
                text = text.toString().split('').join(' ');

                // create instance
                var speech = new SpeechSynthesisUtterance(text);

                // settings
                speech.voice = speechSynthesis.getVoices()[0]; // first voice
                speech.rate = 0.1; // speed rate
                speech.onend = function (e) {
                    var $icon = obj.find('em');
                    $icon.removeClass('fa-circle-o-notch fa-spin').addClass('fa-volume-up');
                }

                // speak the text
                speechSynthesis.speak(speech);
            }

            // convert speech elements to links
            $('span.speech').each(function () {
                $(this).append('<a href="javascript:void(0)"><em class="fa fa-volume-up"></em></a>');
                $(this).tooltip({container: 'body'});

                $(this).click(function () {
                    var $this = $(this),
                        $icon = $(this).find('em');

                    // skip, if already speaking
                    if ($icon.hasClass('fa-spin')) {
                        return;
                    }

                    // show loading indicator
                    $icon.removeClass('fa-volume-up').addClass('fa-circle-o-notch fa-spin').blur();

                    // handle speech
                    if ($this.data('encrypted')) {
                        $.post('/tools/d/', {data: $this.data('text')}, function (decrypted) {
                            handleSpeech($this, decrypted);
                        });
                    } else {
                        handleSpeech($this, $this.data('text'));
                    }

                    // focus to element
                    if ($this.data('focus')) {
                        $($this.data('focus')).focus();
                    }
                });
            })
        }
    }

    // public functions
    return {

        //main function
        init: function () {
            handleTabs();
            handleFancybox();
            handleConfirm();
            handleAjaxModal();
            handleFixedHeader();
            handleBootstrapSelect();
            App.initUniform();
            handleAccordions();
            handlePopovers();
            handleTooltips();
            handleBootstrap();
            handleOWL();
            handleSlider();
            handleNavigation();
            handleLogin();
            handleAjaxSwal();
            handleThirdPartyIframes();
            handleAlert();
            handleInputFields();
            handleWebAccessibility();

            // set sweet alert default button texts
            if (sweetAlert) {
                sweetAlert.setDefaults({
                    confirmButtonText: Language.get('ok'),
                    cancelButtonText: Language.get('cancel')
                });
            }

            // default ajax setup
            $.ajaxSetup({
                cache: false,
                headers: {'x-requested-with': 'XMLHttpRequest'} // idn domains workaround
            });
        },

        //main function to initiate core javascript after ajax complete
        initAjax: function () {
            handleConfirm(); // handle confirm modal
            handleAjaxModal(); // handle ajax modal
            handleFancybox();
            handleBootstrapSelect();
            App.initUniform();
            handlePopovers();
            handleTooltips();
            handleLogin();
            handleAjaxSwal();
            handleInputFields();
        },

        initGroupCheck: function () {
            handleUserGroup();
            handleCheckUserGroupPassword();
        },

        initBootstrapSwitch: function (container, sel) {
            var selector = sel ? sel : $('.make-switch, .mswitch', container);

            selector.bootstrapSwitch('destroy', true);
            selector.bootstrapSwitch({
                size: 'small',
                onSwitchChange: function () {
                    $(this).trigger('change');
                }
            });

            var switchOn = $('.bootstrap-switch-handle-on', container),
                switchOff = $('.bootstrap-switch-handle-off', container);

            switchOn.css('width', switchOn.width() + 5);
            switchOff.css('width', switchOff.width() + 5);
        },

        //public function to remember last opened popover that needs to be closed on click
        setLastPopedPopover: function (el) {
            lastPopedPopover = el;
        },

        fb_like: function () {
            url = location.href;
            title = document.title;
            window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(title), 'sharer', 'toolbar=0,status=0,width=626,height=436');
            return false;
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
                    baseZ: options.zIndex ? options.zIndex : 99999,
                    centerY: options.cenrerY != undefined ? options.cenrerY : false,
                    css: {
                        top: '50%',
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

        //some helper function
        confirm: function (question, callback, param) {
            swal({
                type: 'question',
                title: Language.get('confirm'),
                html: question,
                confirmButtonText: Language.get('ok'),
                cancelButtonText: Language.get('no'),
                showCancelButton: true
            }).then(function (result) {
                if (result.value) {
                    if (callback) {
                        if (typeof (callback) == 'function') {
                            return callback(param);
                        }
                    }
                } else if (param.hasOwnProperty('ladda') && typeof (param.ladda) === 'object') {
                    param.ladda.stop();
                }
            });

            return false;
        },

        alert: function (text, callback, param) {

            var alertModal =
                $('<div class="modal fade" tabindex="-1" role="basic" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
                    '<h4 class="modal-title">' + Language.get('alert') + '</h4>' +
                    '<div class="modal-body">' + text + '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn blue" id="okButton">' + Language.get('ok') + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +

                    '</div>');
            alertModal.find('#okButton').click(function (event) {
                if (callback) {
                    if (typeof (callback) == 'function') {
                        return callback(param);
                    } else if (callback == 'reload') {
                        location.reload();
                    }
                }
                alertModal.modal('hide');
            });
            alertModal.modal('show');
            return false;
        },

        formatPrice: function (price, decimals, hideNullSuffix, hideCurrency) {
            if (typeof (decimals) !== 'number') {
                decimals = 2;
            }

            var currency = Config.get('currency') || 'EUR',
                nullSuffix = (!hideNullSuffix ? (currency === 'CHF' ? '.–' : ',-') : ''),
                dec_point = (currency === 'CHF') ? '.' : ',',
                thousands_sep = (currency === 'CHF') ? '\'' : '.';

            price = Custom.number_format(price, decimals, dec_point, thousands_sep) + (decimals > 0 ? '' : nullSuffix);

            if (!hideCurrency) {
                switch (currency) {
                    case 'CHF':
                        price = currency + ' ' + price;
                        break;
                    default:
                        price = price + ' ' + currency;
                        break;
                }
            }

            return price;
        },

        /**
         * Helper to convert number to valid price
         *
         * @param number
         * @param decimals
         * @param dec_point
         * @param thousands_sep
         *
         * @returns {string|*}
         */
        number_format: function (number, decimals, dec_point, thousands_sep) {
            number = (number + '')
                .replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
                .split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '')
                .length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1)
                    .join('0');
            }
            return s.join(dec);
        },

        isTouchDevice: function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        isMobileLayout: function () {
            if (jQuery('html').hasClass('mobile')) return true;
            else return false;
        },

        isHTML: function (str) {
            return /^<.*?>$/.test(str) && !!$(str)[0];
        },

        /**
         * Helper to set location url
         *
         * @param url
         */
        setLocation: function (url) {
            if (typeof (url) == 'string') {
                if (url.length === 0) {
                    url = document.location.href;
                    if (url.indexOf('?') !== -1) {
                        url = url.substring(0, url.indexOf('?'))
                    }
                }
            } else if (!url)
                url = '/';

            window.location.href = url;
        },

        getUrlVars: function () {
            var vars = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                if (key.indexOf('[') > -1) {
                    var element = key.split('['),
                        ek = element[0] || key,
                        ev = element[1].replace(']', '');

                    if (!vars.hasOwnProperty(ek)) {
                        vars[ek] = {};
                    }

                    vars[ek][ev] = value;
                } else {
                    vars[key] = value;
                }
            });

            return vars;
        },

        checkFsk: function (value, min) {
            var today = new Date();
            var birthDate = new Date(value);
            var age = today.getFullYear() - birthDate.getFullYear();

            if (age > (min + 1)) {
                return true;
            }

            var m = today.getMonth() - birthDate.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age >= min;
        },

        dateDiffInDays: function (a, b) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;

            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        },

        inArray: function (entity, arr) {
            for (var i = 0; i < arr.length; ++i) {
                if (String(entity) === String(arr[i])) {
                    return true;
                }
            }
            return false;
        },

        inObject: function (entity, key, arr) {
            for (var i = 0; i < arr.length; ++i) {
                if (String(entity) === String(arr[i][key])) {
                    return i;
                }
            }
            return false;
        },

        isObject: function (obj) {
            if (obj instanceof Array) {
                return obj[0] instanceof Object;
            } else {
                return obj instanceof Object;
            }
        },

        initFormToken: function ($form) {
            if (!$form.find('input.form_token').length) {
                var $honeypot = $form.find('input.form_message');

                if ($honeypot.length) {
                    var sessionName = 'MYSESSION';
                    if (Config.get('IS_LOCAL')) sessionName += '_LOCAL';
                    else if (Config.get('IS_DEV')) sessionName += '_DEV';

                    var token = FORM_TOKEN + '@' + Custom.md5($.cookie(sessionName)) + '|' + $honeypot.data('index');
                    $form.append('<input type="' + (!Config.get('IS_LOCAL') || $honeypot.is(':hidden') ? 'hidden' : 'text') + '" class="form_token" name="token" value="' + token + '">');
                }
            }
        },

        md5: function (str) {
            var xl;

            var rotateLeft = function (lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            };

            var addUnsigned = function (lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            };

            var _F = function (x, y, z) {
                return (x & y) | ((~x) & z);
            };
            var _G = function (x, y, z) {
                return (x & z) | (y & (~z));
            };
            var _H = function (x, y, z) {
                return (x ^ y ^ z);
            };
            var _I = function (x, y, z) {
                return (y ^ (x | (~z)));
            };

            var _FF = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _GG = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _HH = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _II = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var convertToWordArray = function (str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            var wordToHex = function (lValue) {
                var wordToHexValue = '',
                    wordToHexValue_temp = '',
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    wordToHexValue_temp = '0' + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                }
                return wordToHexValue;
            };

            var utf8_encode = function (string) {
                string = (string + '').replace(/\r\n/g, "\n").replace(/\r/g, "\n");

                var utftext = "";
                var start, end;
                var stringl = 0;

                start = end = 0;
                stringl = string.length;
                for (var n = 0; n < stringl; n++) {
                    var c1 = string.charCodeAt(n);
                    var enc = null;

                    if (c1 < 128) {
                        end++;
                    } else if ((c1 > 127) && (c1 < 2048)) {
                        enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
                    } else {
                        enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
                    }
                    if (enc != null) {
                        if (end > start) {
                            utftext += string.substring(start, end);
                        }
                        utftext += enc;
                        start = end = n + 1;
                    }
                }

                if (end > start) {
                    utftext += string.substring(start, string.length);
                }

                return utftext;
            }

            var x = [],
                k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;

            str = utf8_encode(str);
            x = convertToWordArray(str);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;

            xl = x.length;
            for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }

            var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

            return temp.toLowerCase();
        }
    };

}();
