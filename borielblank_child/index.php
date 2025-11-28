<?php get_header(); ?>

<?php if (have_posts()): while (have_posts()): the_post(); ?>
<article class="mb-4">
    <h2><?php the_title(); ?></h2>
    <?php if (has_post_thumbnail()) the_post_thumbnail('medium', ['class' => 'img-fluid']); ?>
    <div><?php the_excerpt(); ?></div>
    <a class="btn btn-primary" href="<?php the_permalink(); ?>">Read more</a>
</article>
<?php endwhile; endif; ?>

<?php get_footer(); ?>
