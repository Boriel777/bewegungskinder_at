document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with inline styles
    const elements = document.querySelectorAll('[style]');

    // Loop through each element and replace the target font-family
    elements.forEach((el) => {
        const style = el.getAttribute('style');
        if (style) {
            const updatedStyle = style
                .replace(
                    /font-family:\s*(Pangolin,\s*cursive|'Adigiana Toybox');?/gi,
                    'font-family: duper, sans-serif;'
                )
                .replace(
                    /font-family:\s*("Shadows Into Light Two",\s*cursive|"Happy Monkey",\s*cursive);?/gi,
                    'font-family: chauncy-pro, sans-serif;'
                );

            if (updatedStyle !== style) {
                el.setAttribute('style', updatedStyle);
                console.log(`Updated style for element:`, el);
            }
        }
    });

    console.log('Inline styles updated.');
});