class Particle {
  static Gravity = 9.8 / 100

  #element = null

  constructor(x, y, symbol = '⭐') {
    this.x = x
    this.y = y
    this.z = 0
    this.symbol = symbol

    this.angle = Math.random() * Math.PI * 2
    this.velocityX = (Math.random() - 0.5) * 5
    this.velocityY = -Math.random() * 3
    this.velocityZ = Math.random() - 0.5

    this.isDisposed = false
  }

  update() {
    this.x += this.velocityX
    this.y += this.velocityY
    this.z += this.velocityZ

    this.velocityY += Particle.Gravity
    this.element.style.transform = this.transform
  }

  dispose() {
    this.element.remove()
    this.#element = null
    this.isDisposed = true
  }

  get transform() {
    return `translate(${this.x}px, ${this.y}px) rotate(${this.angle}rad) skew(${this.z}deg)`
  }

  get element() {
    if (!this.#element) {
      const element = document.createElement('span')
      element.innerText = this.symbol

      Object.assign(element.style, {
        position: 'absolute',
        transformOrigin: 'top left',
        transform: this.transform,
        fontSize: `${Math.random() * 20 + 10}px`,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 9999,
      })

      this.#element = element
    }

    return this.#element
  }
}

export default function cascade(element, strength = 20, symbols = ['*']) {
  const rect = element.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  const container = document.createElement('div')
  Object.assign(container.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9999,
    overflow: 'hidden',
  })

  document.body.append(container)

  const particles = []
  for (let i = 0; i < strength; i++) {
    const particle = new Particle(x, y, symbols[i % symbols.length])
    container.append(particle.element)
    particles.push(particle)
  }

  requestAnimationFrame(function loop() {
    if (particles.every((particle) => particle.isDisposed)) {
      container.remove()
      return
    }

    for (const particle of particles) {
      particle.update()

      if (particle.y > window.innerHeight) {
        particle.dispose()
      }
    }

    requestAnimationFrame(loop)
  })
}
