<?php get_header(); ?>

<?php if (have_posts()): while (have_posts()): the_post(); ?>
<article class="mb-4">
    <p class="lead"><?php the_title(); ?></p>
    <?php the_content(); ?>
</article>
<?php endwhile; endif; ?>

<?php get_footer(); ?>

