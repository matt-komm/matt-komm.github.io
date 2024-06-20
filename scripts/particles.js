function setup_pattern()
{
    var canvas = document.getElementById("canvas-bkg");
    const div = document.getElementById("canvas-bkg-container");
    const ctx = canvas.getContext("2d");

    const items = document.getElementsByClassName("textitem");


    var pos = [];
    
 
    function animate_pattern(timeStamp) 
    {
        const width = div.clientWidth;
        const height = div.clientHeight;
        canvas.width= width;
        canvas.height = height;
        
        ctx.clearRect(0,0,width,height);

        for (var i = 0; i < items.length; ++i)
        {
            const viewportOffset = items[i].getBoundingClientRect();
            // these are relative to the viewport, i.e. the window
            const top = viewportOffset.top;
            const left = viewportOffset.left;
        }

        requestAnimationFrame(animate_pattern);
    };
    
    animate_pattern(0);
};


window.addEventListener("load", (event) => {
    setup_pattern();
});
