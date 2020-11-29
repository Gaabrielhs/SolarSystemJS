const solarSystem = [
    {
        x: 0,
        y: 0,
        radius: 35,
        color: "yellow",
        velocity: 0,
        name: "sun"
    },
    {
        x: 50,
        y: 0,
        radius: 3,
        color: "gray",
        velocity: 50,
        name: "mercury"
    },
    {
        x: 70,
        y: 0,
        radius: 5,
        color: "red",
        velocity: 35,
        name: "venus"
    },
    {
        x: 90,
        y: 0,
        radius: 8,
        color: "blue",
        velocity: 30,
        name: "earth"
    },
    {
        x: 125,
        y: 0,
        radius: 6,
        color: "red",
        velocity: 25,
        name: "mars"
    },
    {
        x: 175,
        y: 0,
        radius: 20,
        color: "brown",
        velocity: 20,
        name: "jupiter"
    },
    {
        x: 230,
        y: 0,
        radius: 18,
        color: "cyan",
        velocity: 15,
        name: "saturn"
    },
    {
        x: 290,
        y: 0,
        radius: 15,
        color: "blue",
        velocity: 10,
        name: "urano"
    },
    {
        x: 340,
        y: 0,
        radius: 13,
        color: "white",
        velocity: 5,
        name: "neptune"
    }
]

const moon = {
    x: 10, 
    y: 0, 
    radius: 2, 
    color: 'white'
}

document.addEventListener("DOMContentLoaded", evt => {
    console.log("initializing...")

    const canvas = document.getElementById("canvas")

    const ctx = canvas.getContext("2d")

    setInterval(e => {
        //Solar System
        
        ctx.fillRect(0, 0, 1000, 700)
        ctx.save()

        ctx.translate(500, 350)
        
        solarSystem.map(star => {  
            if(star.angle === undefined) star.angle = 0

            star.angle += star.velocity / 1000
            ctx.rotate(star.angle)
            drawCircle(ctx, star)
            
            if(star.name == 'earth') {
                ctx.save()            
                ctx.translate(star.x, star.y)
                const moonAngle = star.angle * 12
                ctx.rotate(moonAngle)
                console.log(`moonAngle: ${moonAngle}`)
                drawCircle(ctx, moon)      
                ctx.restore()      
            }

            ctx.rotate(-star.angle)
        })
        
        ctx.restore()
    }, 17)
    
})


function drawCircle(ctx, {x, y, radius, color}) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
}