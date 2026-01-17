</main>
<footer class="container py-4">
<?php
// footer.php in child theme

// Get the post by title (case-insensitive)
$footer_post = get_page_by_title('Footer', OBJECT, 'post');

if ($footer_post) {
    echo apply_filters('the_content', $footer_post->post_content);
} else {
    echo '<p>Please create a post titled "Footer" to display here. </br> Bitte erstelle einen Beitrag mit dem Titel „Footer“, der hier angezeigt wird.</p>';
}
?>
<a class="bd_tribute" href="https://www.boriel-designs.com" target="_blank" rel="noopener noreferrer"><p>Made by: <img src="http://bewegungskinder.local/wp-content/uploads/2025/10/White_Mark_Boriel_Designs@3x.png" alt="boriel designs logo"></p></a>
</footer>
<?php wp_footer(); ?>
</body>
</html>
