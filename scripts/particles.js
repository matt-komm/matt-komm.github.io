class OrbitMode
{
    constructor(center_x, center_y, radius, rotation_yaw, rotation_pitch, eccentricity, phi, omega)
    {
        this.center_x = center_x;
        this.center_y = center_y;
        this.radius = radius;
        this.rotation_yaw = rotation_yaw;
        this.rotation_pitch = rotation_pitch;
        this.eccentricity = eccentricity;
        this.phi = phi;
        this.omega = omega;
        this.itime = 0;
    }
    
    update(dt)
    {
        this.itime += dt;
        var phi = this.phi+this.itime*this.omega;
        var r = (1.-this.eccentricity)*this.radius/(1.-this.eccentricity*Math.cos(phi));
        
        var x = r*Math.cos(phi);
        var y = r*Math.sin(phi);

        var x_yaw = x*Math.cos(this.rotation_yaw)-y*Math.sin(this.rotation_pitch);
        var y_yaw = x*Math.sin(this.rotation_yaw)+y*Math.cos(this.rotation_pitch);

        var x_pitch = x_yaw*Math.cos(this.rotation_pitch);
        var y_pitch = y_yaw;
        var z_pitch = -x_yaw*Math.sin(this.rotation_pitch);


        
        this.x = this.center_x + x_pitch;
        this.y = this.center_y + y_pitch;
        this.z = z_pitch;
    }
    
    get_x()
    {
        return this.x;
    }
    
    get_y()
    {
        return this.y;
    }

    get_z()
    {
        return this.z;
    }
}

class Particle
{
    constructor(ctx, size, speed, decay, mode)
    {
        this.ctx = ctx;
        this.size = size;
        this.speed = speed;
        this.mode = mode;
        this.decay = decay;
        
        this.x = 0;
        this.y = 0;
        this.z = size;
        
        this.itime=0;
    }
    
    draw(dt,width,height)
    {
        this.itime+=dt;
        this.mode.update(dt);
        var target_x = this.mode.get_x();
        var target_y = this.mode.get_y();
        var target_z = this.size+this.size*(this.mode.get_z()/this.mode.radius);
        
        var decay = 0; //Math.exp(-this.decay*this.itime);
        var new_x = target_x*(1-decay)+this.x*decay;
        var new_y = target_y*(1-decay)+this.y*decay;
        var new_z = target_z*(1-decay)+this.z*decay;
        
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;

         
        var scale = Math.min(height,width);
        
        this.ctx.fillStyle = "black";

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.z, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}



function setup_particles()
{
    var canvas = document.getElementById("canvas-bkg");
    const div = document.getElementById("canvas-bkg-container");
    const ctx = canvas.getContext("2d");

    const tags = document.getElementsByClassName("animation-tag");
    console.log(tags);
    
    
    var p1 = new Particle(
        ctx,
        10.,
        1.,
        0.00001,
        new OrbitMode(200,100,200,0.5 * Math.PI,0.25 * Math.PI,0.5,0,0.002)
    );
    
    var lastTimeStamp = -1;
    
    function animate_particles(timeStamp) 
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
        
        p1.draw(dt,width,height);
        var distance = 10000;
        for (var i = 0; i < tags.length; ++i)
        {

            const viewportOffset = tags[i].getBoundingClientRect();
            // these are relative to the viewport, i.e. the window
            const top = viewportOffset.top;
            const left = viewportOffset.left;

            ctx.fillStyle = "red";
            ctx.fillRect(left,top,10,10);

            var d = Math.abs(left-p1.x) + Math.abs(top-p1.y);
            if (d<distance)
            {
                d = distance;
                p1.mode.center_x = left;
                p1.mode.center_y = top;
            }
        }
        
        requestAnimationFrame(animate_particles);
    };
    
    animate_particles(0);
};


window.addEventListener("load", (event) => {
    setup_particles();
});
