var A = function () {
    var getViewport = function () {

        var viewPortWidth;
        var viewPortHeight;

        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerWidth !== 'undefined') {
            viewPortWidth = window.innerWidth;
            viewPortHeight = window.innerHeight;
        }

        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement !== 'undefined'
            && typeof document.documentElement.clientWidth !==
            'undefined' && document.documentElement.clientWidth !== 0) {
            viewPortWidth = document.documentElement.clientWidth;
            viewPortHeight = document.documentElement.clientHeight;
        }

        // older versions of IE
        else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
            viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
        }

        return [viewPortWidth, viewPortHeight];
    };

    var getFlashVersion = function () {
        // ie
        try {
            try {
                // avoid fp6 minor version lookup issues
                // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
                var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
                try {
                    axo.AllowScriptAccess = 'always';
                } catch (e) {
                    return '6,0,0';
                }
            } catch (e) {
            }
            return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
            // other browsers
        } catch (e) {
            try {
                if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                    return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
                }
            } catch (e) {
            }
        }
        return '0,0,0';
    };

    var detectBrowserFeatures = function () {
        var i,
            mimeType,
            browserFeatures = {},
            pluginMap = {
                // document types
                pdf: 'application/pdf',

                // media players
                qt: 'video/quicktime',
                realp: 'audio/x-pn-realaudio-plugin',
                wma: 'application/x-mplayer2',

                // interactive multimedia
                dir: 'application/x-director',
                fla: 'application/x-shockwave-flash',

                // RIA
                java: 'application/x-java-vm',
                gears: 'application/x-googlegears',
                ag: 'application/x-silverlight'
            };

        function isFunction(property) {
            return typeof property === 'function';
        }

        function isDefined(property) {
            var propertyType = typeof property;
            return propertyType !== 'undefined';
        }

        function hasCookies() {
            var cookieEnabled = navigator.cookieEnabled;
            if (!cookieEnabled) {
                document.cookie = "testcookie";
                cookieEnabled = document.cookie.indexOf("testcookie") != -1;
            }
            return cookieEnabled;
        }

        // detect browser features except IE < 11 (IE 11 user agent is no longer MSIE)
        if (!((new RegExp('MSIE')).test(navigator.userAgent))) {
            // general plugin detection
            if (navigator.mimeTypes && navigator.mimeTypes.length) {
                for (i in pluginMap) {
                    if (Object.prototype.hasOwnProperty.call(pluginMap, i)) {
                        mimeType = navigator.mimeTypes[pluginMap[i]];
                        browserFeatures[i] = (mimeType && mimeType.enabledPlugin) ? '1' : '0';
                    }
                }
            }

            // Safari and Opera
            // IE6/IE7 navigator.javaEnabled can't be aliased, so test directly
            // on Edge navigator.javaEnabled() always returns `true`, so ignore it
            if (!((new RegExp('Edge[ /](\\d+[\\.\\d]+)')).test(navigator.userAgent)) &&
                typeof navigator.javaEnabled !== 'unknown' &&
                isDefined(navigator.javaEnabled) &&
                navigator.javaEnabled()) {
                browserFeatures.java = '1';
            }

            // Firefox
            if (isFunction(window.GearsFactory)) {
                browserFeatures.gears = '1';
            }

            // other browser features
            browserFeatures.cookie = hasCookies();
        }

        var width = parseInt(screen.width, 10);
        var height = parseInt(screen.height, 10);
        browserFeatures.res = parseInt(width, 10) + 'x' + parseInt(height, 10);

        return browserFeatures;
    };

    return {
        init: function () {
            if ($.cookie('cookieconsent_status') !== 'allow') {
                return;
            }

            var viewport = getViewport(),
                plugins = detectBrowserFeatures(),
                flash_version = getFlashVersion();

            // save client data
            if (!$.cookie('as')) {
                $.post(Config.get('base-url') + '/analytics/user/', {
                    resolution: window.screen.width + 'x' + window.screen.height,
                    viewport: viewport[0] + 'x' + viewport[1],
                    colors: screen.colorDepth + '-bit',
                    user_language: navigator.language || navigator.userLanguage,
                    flash_version: flash_version,
                    has_java: typeof (navigator.javaEnabled) !== 'undefined' && navigator.javaEnabled() ? 1 : 0,
                    has_flash: flash_version === '0,0,0' ? 0 : 1,
                    has_quicktime: plugins.hasOwnProperty('qt') ? plugins.qt : 0,
                    has_pdf: plugins.hasOwnProperty('pdf') ? plugins.pdf : 0,
                    has_windows_media: plugins.hasOwnProperty('wma') ? plugins.wma : 0,
                    has_realplayer: plugins.hasOwnProperty('realp') ? plugins.realp : 0,
                    has_gears: plugins.hasOwnProperty('gears') ? plugins.gears : 0,
                    has_silverlight: plugins.hasOwnProperty('ag') ? plugins.ag : 0,
                    has_directory: plugins.hasOwnProperty('dir') ? plugins.dir : 0,
                    has_cookies: plugins.hasOwnProperty('cookie') ? (plugins.cookie ? 1 : 0) : 0
                });
            }

            // send ping every 30 seconds
            // if (!$('body').hasClass('iframe')) {
            //     setInterval(function () {
            //         $.get(Config.get('base-url') + '/analytics/ping/');
            //     }, 30000);
            // }
        },
        addToCart: function (position, id, name, price, category, list, callback) {
            if ($('body').hasClass('iframe')) {
                if (typeof (callback) === 'function') {
                    callback();
                }
                return;
            }

            $.post(Config.get('base-url') + '/analytics/add-product-to-cart/', {
                id: id,
                position: position,
                name: name,
                price: parseFloat(price.toString()).toFixed(2),
                category: category,
                list: list
            });

            if (typeof (callback) === 'function') {
                setTimeout(function () {
                    callback();
                }, 1000);
            }
        }
    }
}();