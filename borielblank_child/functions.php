<?php
/**
 * Borielblank Child Theme — Clean Functions
 */

/* ---------------------------------------
 * 1. PRELOAD LOCAL FONTS (CLEAN + SAFE)
 * --------------------------------------- */
function borielblank_child_preload_fonts() {

    $fonts = [
        'Gluten-Bold.woff2',
        'Gluten-Regular.woff2',
        'Gluten-SemiBold.woff2',
        'PlaypenSans-Bold.woff2',
        'PlaypenSans-Light.woff2',
        'PlaypenSans-Regular.woff2',
        'PlaypenSans-SemiBold.woff2',
    ];

    foreach ($fonts as $font) {
        printf(
            '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
            esc_url( get_stylesheet_directory_uri() . '/fonts/' . $font )
        );
    }
}
add_action('wp_head', 'borielblank_child_preload_fonts');


/* ---------------------------------------
 * 2. ENQUEUE STYLES & SCRIPTS (CLEAN)
 * --------------------------------------- */
function borielblank_child_enqueue_assets() {

    /* 2.1 Parent theme stylesheet */
    wp_enqueue_style(
        'borielblank-parent-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme(get_template())->get('Version')
    );

    /* 2.2 Child main style */
    wp_enqueue_style(
        'borielblank-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        ['borielblank-parent-style', 'bootstrap-css'], // ensures correct order
        wp_get_theme()->get('Version')
    );

    /* 2.3 Font Awesome (local) */
    wp_enqueue_style(
        'fontawesome-local',
        get_stylesheet_directory_uri() . '/fonts/fontawesome/css/all.min.css',
        [],
        '7.1.0'
    );

    /* 2.4 AUTOLOAD all CSS from /styles/ */
    $styles_path = get_stylesheet_directory() . '/styles/';
    $styles_uri  = get_stylesheet_directory_uri() . '/styles/';

    foreach (glob($styles_path . '*.css') as $file) {
        $name = basename($file, '.css');

        wp_enqueue_style(
            'child-style-' . $name,
            $styles_uri . $name . '.css',
            ['borielblank-child-style'],
            filemtime($file)
        );
    }

    /* 2.5 AUTOLOAD all JS from /scripts/ */
    $scripts_path = get_stylesheet_directory() . '/scripts/';
    $scripts_uri  = get_stylesheet_directory_uri() . '/scripts/';

    foreach (glob($scripts_path . '*.js') as $file) {
        $name = basename($file, '.js');

        wp_enqueue_script(
            'child-script-' . $name,
            $scripts_uri . $name . '.js',
            ['jquery'],
            filemtime($file),
            true // load in footer
        );
    }
}
add_action('wp_enqueue_scripts', 'borielblank_child_enqueue_assets');


/* ---------------------------------------
 * 3. REGISTER EXTRA MENUS
 * --------------------------------------- */
function borielblank_child_register_menus() {
    register_nav_menus([
        'top_social'  => 'Top Social Navigation',
        'login_links' => 'Account Links (Right)',
    ]);
}
add_action('after_setup_theme', 'borielblank_child_register_menus');

/* Shortcode for copyright */

function bd_copyright_shortcode() {
    return '<p class="bd_copyright">&copy; ' . date('Y') . ' Bewegungskinder. Alle Rechte vorbehalten.</p>';
}
add_shortcode('bd_copyright', 'bd_copyright_shortcode');


