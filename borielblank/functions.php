<?php
// Sicherheit: direktes Laden verhindern
if (!defined('ABSPATH')) exit;

// --- Theme Setup ---
add_action('after_setup_theme', function() {
    // Beitragsbilder aktivieren
    add_theme_support('post-thumbnails');
    // Titel-Tag dynamisch
    add_theme_support('title-tag');
    // HTML5 Markup
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    // Menüs
    register_nav_menus([
        'primary' => __('Primary Menu', 'borielblank')
    ]);
});

// --- Styles & Scripts ---
add_action('wp_enqueue_scripts', function() {
    // Bootstrap CDN
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.bundle.min.js', ['jquery'], null, true);

    // Eigenes Stylesheet
    wp_enqueue_style('borielblank-style', get_stylesheet_uri());
});
