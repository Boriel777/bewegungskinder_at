document.addEventListener("DOMContentLoaded", () => {
    const articles = document.querySelectorAll(".bd_teaser_slider article");

    articles.forEach(a => {
        const randomDeg = (Math.random() * 2).toFixed(2); // 0 to 2 degrees
        const randomSign = Math.random() > 0.5 ? 1 : -1;  // left or right
        a.style.transform = `rotate(${randomDeg * randomSign}deg)`;
    });
});
