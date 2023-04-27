const Constellation = (canvas, options) => {
	let context = canvas.getContext('2d')

	let defaults = {
		star: {
			color: '#ffffff',
			width: 1,
			randomWidth: true
		},
		line: {
			color: '#ffffff',
			width: 0.2
		},
		position: {
			x: 0,
			y: 0
		},
		width: window.innerWidth,
		height: window.innerHeight,
		velocity: 0.1,
		length: 100,
		distance: 120,
		radius: 150,
		stars: []
	}

	let config = Object.assign({}, defaults, options)

	function Star() {
		this.x = Math.random() * canvas.width
		this.y = Math.random() * canvas.height

		this.vx = (config.velocity - (Math.random() * 0.5))
		this.vy = (config.velocity - (Math.random() * 0.5))

		this.radius = config.star.randomWidth ? (Math.random() * config.star.width) : config.star.width
	}

	Star.prototype = {
		create: function(){
			context.beginPath()
			context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
			context.fill()
		},
		animate: function(){
			let i;
			for (i = 0; i < config.length; i++) {
					
					let star = config.stars[i];
	
					if (star.y < 0 || star.y > canvas.height) {
						star.vx = star.vx;
						star.vy = - star.vy;
					} else if (star.x < 0 || star.x > canvas.width) {
						star.vx = - star.vx;
						star.vy = star.vy;
					}
					star.x += star.vx;
					star.y += star.vy;
				}
		},
		line: function(){
			let length = config.length,
				iStar,
				jStar,
				i,
				j;
	
			for (i = 0; i < length; i++) {
				for (j = 0; j < length; j++) {
					iStar = config.stars[i];
					jStar = config.stars[j];
	
					if (
						(iStar.x - jStar.x) < config.distance &&
						(iStar.y - jStar.y) < config.distance &&
						(iStar.x - jStar.x) > - config.distance &&
						(iStar.y - jStar.y) > - config.distance
					) {
						if (
							(iStar.x - config.position.x) < config.radius &&
							(iStar.y - config.position.y) < config.radius &&
							(iStar.x - config.position.x) > - config.radius &&
							(iStar.y - config.position.y) > - config.radius
						) {
							context.beginPath();
							context.moveTo(iStar.x, iStar.y);
							context.lineTo(jStar.x, jStar.y);
							context.stroke();
							context.closePath();
						}
					}
				}
			}
		}
	}

	this.createStars = () => {
		let length = config.length,
			star,
			i;
	
		context.clearRect(0, 0, canvas.width, canvas.height);
	
		for (i = 0; i < length; i++) {
			config.stars.push(new Star());
			star = config.stars[i];
	
			star.create();
		}
	
		star.line();
		star.animate();
	}

	this.setCanvas = () => {
		canvas.width = config.width;
		canvas.height = config.height;
	}

	this.setContext = () => {
		context.fillStyle = config.star.color;
		context.strokeStyle = config.line.color;
		context.lineWidth = config.line.width;
	}

	this.setInitialPosition = () => {
		if (!options || !options.hasOwnProperty('position')) {
			config.position = {
				x: canvas.width * 0.5,
				y: canvas.height * 0.5
			}
		}
	}

	this.loop = callback => {
		callback()
		window.requestAnimationFrame(() => {
			this.loop(callback)
		})
	}

	this.bind = () => {
		window.addEventListener('mousemove', e => {
			config.position.x = e.pageX - canvas.offsetLeft
			config.position.y = e.pageY - canvas.offsetTop
		})
	}

	this.init = () => {
		this.setCanvas()
		this.setContext()
		this.setInitialPosition()
		this.loop(this.createStars)
		this.bind()
	}

	window.addEventListener('resize', () => {
		config.width = window.innerWidth
		config.height = window.innerHeight
	})

	return this.init()
}

Constellation(document.querySelector('#starry-background'), {
	star: {
		width: 1,
		color: '#ffffff'
	  },
	  line: {
		color: '#ffffff99'
	  },
	  length: (window.innerWidth / 6),
	  radius: (window.innerWidth / 5)
})