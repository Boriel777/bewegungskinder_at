document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".bd_teaser_slider.wp-block-uagb-post-carousel");
    if (!slider) return;

    const colors = [
        "var(--color-support-red)",
        "var(--color-support-yellow)",
        "var(--color-support-green)",
        "var(--color-support-blue)"
    ];

    let index = 0; // start with first color

    // Ensure slick is initialized before attaching event
    const waitForSlick = setInterval(() => {
        if (jQuery && jQuery(slider).hasClass("slick-initialized")) {

            clearInterval(waitForSlick);

            jQuery(slider).on("afterChange", function () {
                slider.style.backgroundColor = colors[index];

                // increment index in perfect loop
                index = (index + 1) % colors.length;
            });

        }
    }, 50);

});
