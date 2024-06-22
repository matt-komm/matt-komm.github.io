class Particle
{
    constructor(ctx)
    {
        this.ctx = ctx;
    }

    reset(x, y)
    {
        this.x = x;
        this.y = y;

        
        this.charge = 1000*(Math.random()*2 - 1);
        this.stop = 0.5*Math.random()*Math.PI;

        this.istep = 0;
    }

    draw(dt, width, height)
    {
        var scale = Math.min(height,width);

        this.ctx.lineWidth =2;
        this.ctx.strokeStyle = "white";

        this.ctx.beginPath();
        if (this.charge>0)
        {
            this.ctx.arc(this.x-this.charge,this.y,Math.abs(this.charge),0,this.istep);
        }
        else
        {
            this.ctx.arc(this.x-this.charge,this.y,Math.abs(this.charge),Math.PI-this.istep,Math.PI);
        }
        this.ctx.stroke();

        
        this.istep+=0.001*dt;
        //console.log(this.istep);
        if (this.istep>this.stop)
        {
            this.reset(width/2,0);
        }
    }
}

function setup_pattern()
{
    var canvas = document.getElementById("canvas-cms");
    const div = document.getElementById("canvas-cms-container");
    const ctx = canvas.getContext("2d");

    var particles = [];
    for (var i = 0; i < 10; ++i)
    {
        var p = new Particle(ctx);
        p.reset(200,0);
        particles.push(p);
    }
    

    var lastTimeStamp = -1;
 
    function animate_pattern(timeStamp) 
    {
        var dt = timeStamp-lastTimeStamp;
        const width = div.clientWidth;
        const height = div.clientHeight;
        canvas.width = width;
        canvas.height = height;
        
        ctx.clearRect(0,0,width,height);

        if (lastTimeStamp>0)
        {
            for (var i = 0; i < 10; ++i)
            {
                particles.at(i).draw(dt,width,height);
            }
        }
        lastTimeStamp = timeStamp;

        requestAnimationFrame(animate_pattern);
    };
    
    animate_pattern(0);
};


window.addEventListener("load", (event) => {
    setup_pattern();
});
