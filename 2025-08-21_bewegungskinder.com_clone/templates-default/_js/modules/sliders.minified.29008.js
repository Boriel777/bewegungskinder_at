/**
 * Sliders
 * @type {{init}}
 */
var Sliders = function () {

    /**
     * resize sliders on mobile view
     */
    var resizeSliders = function () {
        $('.slider-on-content').each(function () {
            // get container dimensions
            var maxWidth = 1900,
                width = $(this).width(),
                height = $(this).data('height') ? $(this).data('height') : $(this).height();

            // save original height
            if (!$(this).data('height')) {
                $(this).data('height', height);
            }

            // calculate new dimensions
            height = height / maxWidth * width;
            height = height < 200 ? 200 : height;

            // update height
            $(this).show().height(height);
            $(this).find('.slick-track').height(height);
        });
    };

    /**
     * public methods
     */
    return {
        init: function () {
            resizeSliders();
            $(window).resize(function () {
                resizeSliders();
            });
        }
    }
}();