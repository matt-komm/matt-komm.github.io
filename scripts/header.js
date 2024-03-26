window.addEventListener("load",(e) => {
    const header = document.getElementById("header");
    const titleItem = document.getElementById("title-item");
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");

    const headerIntersectionObs = new IntersectionObserver(
        function(elements,headerIntersectionObs)
        {
            if (elements.length>0)
            {   
                if (!elements[0].isIntersecting)
                {
                    header.classList.add("header-flip-color");
                }
                else
                {
                    header.classList.remove("header-flip-color");
                }
            }
        },
        {
            rootMargin: "-100px 0px 0px 0px"
        }
    );
    headerIntersectionObs.observe(titleItem);
    
    //close menu after clicking a link
    menu.addEventListener('click', (event) => {
        if (menuBtn.checked)
        {
            menuBtn.checked = false;
        }
    });
});

window.addEventListener("resize", (event) => {
    const menuBtn = document.getElementById("menu-btn");
    menuBtn.checked = false; //uncheck when resizing;
});

