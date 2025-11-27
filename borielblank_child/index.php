<?php get_header(); ?>

<?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
        <article class="mb-4">
            <h2><?php the_title(); ?></h2>
            <div class="post-excerpt"><?php the_excerpt(); ?></div>
        </article>
    <?php endwhile; ?>
<?php endif; ?>

<?php get_footer(); ?>
