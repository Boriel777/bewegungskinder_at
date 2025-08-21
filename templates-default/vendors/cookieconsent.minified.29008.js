var Cookieconsent = function () {

    var types = {
        1: 'opt-in',
        2: 'info'
    };

    return {
        init: function () {
            var type = Config.get('cookie_type');

            if (types.hasOwnProperty(type)) {
                var btn = $('<span class="btn-success" style="display:none" />').insertAfter('body'),
                    isOptIn = types[type] === 'opt-in',
                    message = Language.get(isOptIn ? 'cookie_optin_message' : 'cookie_optout_message'),
                    dismiss = Language.get(isOptIn ? 'cookie_optin_button' : 'cookie_optout_button');

                window.cookieconsent.initialise({
                    position: Config.get('cookie-position') || 'bottom-right',
                    type: types[type],
                    content: {
                        message: '<div class="cc-scroll">' + message + '</div>',
                        dismiss: dismiss,
                        allow: Language.get('cookie_optin_button'),
                        deny: Language.get('cookie_deny'),
                        link: Language.get('cookie_linktext'),
                        policy: Language.get('cookie_policy'),
                        href: "/privacy/#cookies",
                        target: "_self"
                    },
                    palette: {
                        popup: {
                            background: 'rgba(0,0,0,.8)'
                        },
                        button: {
                            background: btn.css('background-color'),
                            color: btn.css('color')
                        }
                    },
                    onPopupOpen: function () {
                        // add href for keyboard navigation
                        $('.cc-compliance a.cc-btn').attr('href', 'javascript:');
                    },
                    onStatusChange: function (status, chosenBefore) {
                        var type = this.options.type;
                        var didConsent = this.hasConsented();
                        if (type === 'opt-in' && didConsent) {
                            Cookieconsent.enableCookies();
                        } else if (type === 'opt-in' && !didConsent) {
                            Cookieconsent.disableCookies();
                        }
                    }
                });

                btn.remove();
            }
        },

        enableCookies: function () {
            // update GTM consent
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                });
            }

            // load custom javascripts
            $('script.cc').each(function () {
                var scriptData = $(this).html();
                if ($(this).attr('src')) {
                    $('body').append('<script src="' + $(this).attr('src') + '">' + scriptData + '</script>');
                } else {
                    $('body').append('<script>' + scriptData + '</script>');
                }
            });
        },

        disableCookies: function () {
            // update GTM consent
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                });
            }

            // delete cookies
            var needed_cookies = [
                'MYSESSION',
                'MYSESSION_LOCAL',
                'MYSESSION_DEV',
                'MYSESSION_STATE',
                'khost',
                'token',
                'cookieconsent_status',
                'et'
            ];

            $.each($.cookie(), function (c) {
                if ($.inArray(c, needed_cookies) === -1) {
                    $.removeCookie(c, {path: '/'})
                }
            });
        }
    }
}();