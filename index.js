const solarSystem = [
    {
        x: 0,
        size: 11000,
        radius: 35,
        color: "yellow",
        velocity: 0,
        name: "sun",
        image: "sun.png"
    },
    {
        x: 75,
        size: 38.29,
        radius: 3,
        color: "gray",
        velocity: 4.15,
        name: "mercury"
    },
    {
        x: 100,
        size: 96.04,
        radius: 5,
        color: "red",
        velocity: 1.63,
        name: "venus"
    },
    {
        x: 150,
        size: 100,
        radius: 8,
        color: "blue",
        velocity: 1,
        name: "earth",
        image: "earth.png"
    },
    {
        x: 250,
        size: 53.79,
        radius: 6,
        color: "red",
        velocity: 0.532,
        name: "mars"
    },
    {
        x: 400,
        size: 1109,
        radius: 20,
        color: "brown",
        velocity: 0.084,
        name: "jupiter",
        image: "jupiter.png"
    },
    {
        x: 550,
        size: 924.31,
        radius: 18,
        color: "cyan",
        velocity: 0.034,
        name: "saturn",
        image: "saturn.png",

    },
    {
        x: 750,
        size: 402.57,
        radius: 15,
        color: "blue",
        velocity: 0.012,
        name: "uranus"
    },
    {
        x: 950,
        size: 390.82,
        radius: 13,
        color: "white",
        velocity: 0.006,
        name: "neptune"
    }
]

const moon = {
    x: 15, 
    size: 50,
    radius: 2, 
    velocity: 12,
    color: 'white',
    name: 'moon'
}

let fps = 60
let secondsPerYear = 31536000
let speed = secondsPerYear / 4
let gameLooper = null
let distanceScale = null
let ctx = null

function load() {
    const fpsInput = document.getElementById("fps")
    const speedInput = document.getElementById("speed")
    fpsInput.value = fps
    speedInput.value = speed

    fpsInput.addEventListener("keypress", fpsInputEvent)
    speedInput.addEventListener("keypress", speedInputEvent)

    startGameLooper()
}

function speedInputEvent(event) {
    const input = event.target
    if(event.code != "Enter") return
    const newSpeedValue = parseInt(input.value)
    if(!Number.isInteger(newSpeedValue)) return
    speed = newSpeedValue
}

function fpsInputEvent(event) {
    const input = event.target
    if(event.code != "Enter") return
    let newFpsValue = parseInt(input.value)
    if(!Number.isInteger(newFpsValue)) return

    if(newFpsValue < 1) newFpsValue = 1
    if(newFpsValue > 240) newFpsValue = 240

    fps = newFpsValue
    input.value = fps
    startGameLooper()
}

function startGameLooper() {
    if(gameLooper != null) clearInterval(gameLooper)
    const frameTime = 1000 / fps
    gameLooper = setInterval(draw, frameTime)
}

function draw() {
    const fpsInput = document.getElementById("fps")
    const inputHeight = fpsInput.offsetHeight + fpsInput.clientHeight

    const canvas = document.getElementById("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight - inputHeight

    if(ctx == null) ctx = canvas.getContext("2d")

    //The whole galaxy is between 0(sun) and 1000(neptune)
    //Wen can only use half of this because sun is centralized
    distanceScale = (Math.min(ctx.canvas.width, ctx.canvas.height) / 1000)

    const fitToScreenToggle = document.getElementById("fitToScreenToggle").checked
    if(fitToScreenToggle) distanceScale /= 2

    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()

    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    solarSystem.forEach(star => {
        if(star.angle === undefined) star.angle = 0
        /*         
            Star velocity 1 means a year to rotate 2π radians or 360° (Earth velocity)    
            First we need to convert the index to radian, multiplying by 2π
            Second we need to convert radians/year to radians/second
            The way to do this is dividing by how much seconds a year has that is 31536000
            And for last we need to convert radians/second to radians/frame dividing by the frame rate
        */
        const angleIncreasePerSecond = (star.velocity * speed * 2 * Math.PI) / secondsPerYear
        star.angle += angleIncreasePerSecond / fps //Angle increase per frame
        ctx.save()
        ctx.rotate(star.angle)
        drawStar(ctx, star)
        
        if(star.name == 'earth') {
            ctx.save()
            ctx.translate(star.x * distanceScale, 0)
            const moonAngle = star.angle * moon.velocity
            ctx.rotate(moonAngle)
            drawStar(ctx, moon)
            ctx.restore()
        }

        ctx.restore()
    })
    
    ctx.restore()
}

function drawStar(ctx, {x, angle, size, radius, name}) {

    const starImage = new Image()
    starImage.src = `stars/${name}.png`

    const proportionalSizesToggle = document.getElementById("proportionalSizes").checked
    let proportionalRadius = (radius * distanceScale * 1.5)
    let resizeRatio = 1
    if(proportionalSizesToggle) {
        realRadius = size / 2
        //Keep the sun in 200px
        const starResizeRatio = 200 / solarSystem.find(s => s.name == "sun").size
        proportionalRadius = starResizeRatio * realRadius
        const starDimension = proportionalRadius * 2
        resizeRatio =  starDimension / starImage.height
    } else {
        const starDimension = proportionalRadius * 2
        resizeRatio =  starDimension / starImage.height
    }
    
    ctx.save()
    ctx.translate(x * distanceScale, 0)
    ctx.rotate(angle)

    ctx.drawImage(
        starImage, 
        -proportionalRadius, 
        -proportionalRadius,
        starImage.width * resizeRatio,
        starImage.height * resizeRatio
    )

    ctx.restore()
}

document.addEventListener("DOMContentLoaded", load)