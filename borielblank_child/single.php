<?php get_header(); ?>

<?php if (have_posts()): while (have_posts()): the_post(); ?>
<article class="mb-4">
    <?php if (has_post_thumbnail()) the_post_thumbnail('large', ['class' => 'img-fluid mb-3']); ?>
    <h1><?php the_title(); ?></h1>
    <div><?php the_content(); ?></div>
</article>
<?php endwhile; endif; ?>

<?php get_footer(); ?>
