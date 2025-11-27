<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header class="main-header container py-3">
    <div class="top-nav">
    <?php
        wp_nav_menu([
            'theme_location' => 'top_social',
            'container'      => 'nav',
            'container_class' => 'social-links-nav', // Unique class for styling left nav
            'menu_class'     => 'social-list',      // Class for the UL
            'depth'          => 1,
            'fallback_cb'    => false,
        ]);
        ?>

        <?php
        wp_nav_menu([
            'theme_location' => 'login_links',      // New right-side menu handle
            'container'      => 'nav',
            'container_class' => 'login-links-nav', // Unique class for styling right nav
            'menu_class'     => 'login-list',       // Class for the UL
            'depth'          => 1,
            'fallback_cb'    => false,
        ]);
        ?>
        </div>
    <nav class="navbar navbar-expand-lg navbar-light">
        <a class="navbar-brand" href="<?php echo home_url(); ?>">
    <img src="<?php echo content_url( 'uploads/2025/10/logo_bewegungskinder_horisontal.svg' ); ?>" alt="Bewegungskinder Logo" class="logo-svg"></a>
        <?php
        wp_nav_menu([
            'theme_location' => 'primary',
            'container' => false,
            'menu_class' => 'navbar-nav ml-auto',
            'fallback_cb' => '__return_false',
            'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s</ul>',
        ]);
        ?>
    </nav>
</header>
<main class="container py-4">
