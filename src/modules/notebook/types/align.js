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

    const boundaries = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    const { width, height } = el.getBoundingClientRect()
    const margin = 10

    if (this.y === -1) {
      this.sticky.y = 0 + 48 + margin
    } else if (this.y === 1) {
      this.sticky.y = boundaries.height - height - 25 - margin
    }

    if (this.x === -1) {
      this.sticky.x = 0 + margin
    } else if (this.x === 1) {
      this.sticky.x = boundaries.width - width - margin
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
