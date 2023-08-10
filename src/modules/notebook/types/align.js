export default class Align {
  constructor(sticky) {
    this.sticky = sticky

    this.x = 0
    this.y = 0

    this.isListening = false
    this.listeners = {
      align: this.align.bind(this),
    }
  }

  get isAligned() {
    return this.isAlignedX || this.isAlignedY
  }

  get isAlignedX() {
    return this.x !== 0
  }

  get isAlignedY() {
    return this.y !== 0
  }

  get up() {
    return this.y === -1
  }

  get right() {
    return this.x === 1
  }

  get bottom() {
    return this.y === 1
  }

  get left() {
    return this.x === -1
  }

  set(axis, value) {
    if (axis === 'x') this.x = value
    if (axis === 'y') this.y = value

    this.align()
  }

  alignLate() {
    setTimeout(this.align.bind(this), 0)
  }

  align() {
    if (!this.isAligned) {
      window.removeEventListener('resize', this.listeners.align)
      this.isListening = false
      return
    } else if (!this.isListening) {
      window.addEventListener('resize', this.listeners.align)
      this.isListening = true
    }

    const el = document.getElementById(this.sticky.id)
    if (!el) return

    const boundaries = this.getBoundaries()
    const { width, height } = el.getBoundingClientRect()

    if (this.y === -1) {
      console.log(boundaries.top)
      this.sticky.y = boundaries.top
    } else if (this.y === 1) {
      this.sticky.y = boundaries.bottom - height
    }

    if (this.x === -1) {
      this.sticky.x = boundaries.left
    } else if (this.x === 1) {
      this.sticky.x = boundaries.right - width
    }
  }

  getBoundaries() {
    const margin = 10
    const fallback = {
      top: margin,
      right: window.innerWidth - margin,
      bottom: window.innerHeight - margin,
      left: margin,
    }

    const canvas = this.sticky?.notebook?.mindmap?.canvas
    if (!canvas) return fallback

    const el = document.getElementById(canvas.id)
    if (!el) return fallback

    const { width, height } = el.getBoundingClientRect()
    return {
      top: margin,
      right: width - margin,
      bottom: height - margin,
      left: margin,
    }
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  deserialize(data) {
    this.x = data?.x ?? 0
    this.y = data?.y ?? 0

    this.alignLate()

    return this
  }
}
