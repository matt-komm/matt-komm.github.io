class Band
{
    constructor(ctx,freq, lambda, amplitude, alphaFill,alphaStroke)
    {
        this.ctx = ctx;
        this.freq = freq;
        this.lambda = lambda;
        this.amplitude = amplitude;
        this.iframe = 0;
        this.phase = 0;
        this.ampl_speed = 0;
        this.phase_speed = 0;
        this.alphaFill = alphaFill;
        this.alphaStroke = alphaStroke;
        this.focus = -1;
    }
    
    setPhaseSpeed(speed)
    {
        this.phase_speed = speed;
    }
    
    setAmplSpeed(speed)
    {
        this.ampl_speed = speed;
    }
    
    setFocus(x)
    {
        this.focus = x;
    }
    
    draw(dt,width,height)
    {
        this.iframe+=dt;
        
        var scale = Math.min(height,width);
        
        var meanAmplitude = this.amplitude*scale/2.;
        var currentAmplitude = meanAmplitude*(1.+0.2*Math.sin(this.ampl_speed*this.iframe));
        
        
        if (this.focus>=0)
        {
            this.phase += 0.005*dt*(this.focus-width/2);
        }
        else
        {
            this.phase += dt;
        }
        
        var g = this.ctx.createLinearGradient(
            0,height/2.+currentAmplitude,
            0,height/2.-currentAmplitude
        );

        g.addColorStop(0.1, `rgba(255,255,255,${this.alphaFill})`);
        g.addColorStop(0.4, `rgba(255,255,255,0.0)`);
        g.addColorStop(0.5, `rgba(255,255,255,0.0)`);
        g.addColorStop(0.9, `rgba(255,255,255,${this.alphaFill})`);
        this.ctx.fillStyle = g;
        
        
        var gstroke = this.ctx.createLinearGradient(
            0,0,
            width,0
        );
        gstroke.addColorStop(0.01, '#ffffff00');
        gstroke.addColorStop(0.4, `rgba(255,255,255,${this.alphaStroke})`);
        gstroke.addColorStop(0.6, `rgba(255,255,255,${this.alphaStroke})`);
        gstroke.addColorStop(0.99, '#ffffff00');

        this.ctx.lineWidth =2;
        this.ctx.strokeStyle = gstroke;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, height/2.);
        for (let ix = 0; ix <= width; ix+=1) 
        {
            var modulation = Math.sin(this.freq*2*Math.PI*ix/scale+this.phase_speed*this.phase);
            var damp = Math.exp(-this.lambda/width*(ix-width/2.)*(ix-width/2.));
            
            var iy = height/2.+currentAmplitude*damp*modulation;
            
            this.ctx.lineTo(ix, iy);
        }
        this.ctx.lineTo(width, height/2.);

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fill();

        /*
        this.ctx.strokeStyle = g;
        for (let ix = 0; ix <= width; ix+=10) 
        {
            this.ctx.beginPath();
            this.ctx.moveTo(ix, height/2.);
            var modulation = Math.sin(this.freq*2*Math.PI*ix/scale+this.phase_speed*this.phase);
            var damp = Math.exp(-this.lambda/width*(ix-width/2.)*(ix-width/2.));
            
            var iy = height/2.+currentAmplitude*damp*modulation;
            
            this.ctx.lineTo(ix, iy);
            this.ctx.stroke();
        }
        */
    }
}



function setup_title()
{
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    var canvas = document.getElementById("canvas-title");
    const div = document.getElementById("canvas-title-container");
    const ctx = canvas.getContext("2d");
    
    var mouseX = -1;
    var mouseY = -1;
    
    canvas.addEventListener("mousemove", function (evt) {
        var mousePos = getMousePos(canvas, evt);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
    }, false);
    
    canvas.addEventListener("mouseleave", function (evt) {
        mouseX = -1;
        mouseY = -1;
    }, false);

    var phase = 0;

    var band1 = new Band(
        ctx,
        1.13,
        0.02,
        0.7,
        0.35,
        0.3
    );  
    band1.setAmplSpeed(0.001); 
    band1.setPhaseSpeed(-0.0005);
    
    var band2 = new Band(
        ctx,
        2.6,
        0.01,
        0.3,
        0.25,
        0.15
    ); 
    band2.setAmplSpeed(0.0007); 
    band2.setPhaseSpeed(0.00033);
    
    var band3 = new Band(
        ctx,
        3.7,
        0.005,
        0.1,
        0.0,
        0.1
    ); 
    band3.setAmplSpeed(0.0013); 
    band3.setPhaseSpeed(-0.00023);
    
    var lastTimeStamp = -1;
    
    
    function animate_title(timeStamp) 
    {
        var dt = timeStamp-lastTimeStamp;
        if (lastTimeStamp<0)
        {
            dt = 0.0;
        }
        lastTimeStamp = timeStamp;
        
        const width = div.clientWidth;
        const height = div.clientHeight;
        canvas.width= width;
        canvas.height = height;
        
        ctx.clearRect(0,0,width,height);
        
        band1.draw(dt,width,height);
        band2.draw(dt,width,height);
        band3.draw(dt,width,height);
        /*
        if (mouseX>0)
        {
            ctx.beginPath();
            ctx.fillStyle = "#ffffff99";
            ctx.ellipse(
                mouseX,mouseY,
                10,10, 0, 0, 2 * Math.PI
            );
            ctx.closePath();
            ctx.fill();
        }*/
        band1.setFocus(mouseX);
        band2.setFocus(mouseX);
        band3.setFocus(mouseX);
        
        requestAnimationFrame(animate_title);
    };
    
    animate_title(0);
};


window.addEventListener("load", (event) => {
    setup_title();
});
