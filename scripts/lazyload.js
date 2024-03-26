document.addEventListener("DOMContentLoaded", function () {
    var lazyBackgrounds = [].slice.call(document.querySelectorAll(".load-lazy"));

    if ("IntersectionObserver" in window) 
    {
        let lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) 
            {
                entries.forEach(function (entry) 
                {
                    if (entry.isIntersecting) 
                    {
                        entry.target.classList.add("lazy");
                        lazyBackgroundObserver.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: "-200px 0px 0px 0px"
            }
        );

        lazyBackgrounds.forEach(function (lazyBackground) 
        {
            lazyBackgroundObserver.observe(lazyBackground);
        });
    }
});
