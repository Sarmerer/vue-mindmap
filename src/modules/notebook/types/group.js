import { Sticky } from './sticky'

export class Group extends Sticky {
  constructor(notebook) {
    super(notebook)

    this.notes = []
    this.alignment = { x: 0, y: 0 }

    this.listeners = {
      align: this.align.bind(this),
    }
  }

  get isAligned() {
    return this.isAlignedX || this.isAlignedY
  }

  get isAlignedX() {
    return this.alignment.x !== 0
  }

  get isAlignedY() {
    return this.alignment.y !== 0
  }

  setAxisAlignment(axis, value) {
    this.alignment[axis] = value

    if (!this.isAligned) {
      window.removeEventListener('resize', this.listeners.align)
    }

    window.addEventListener('resize', this.listeners.align)
    this.align()
  }

  alignLate() {
    setTimeout(this.align.bind(this), 0)
  }

  align() {
    if (!this.isAligned) return

    const canvas = document.getElementById(this.notebook.mindmap.canvas.id)
    if (!canvas) return

    const el = document.getElementById(this.id)
    if (!el) return

    const boundaries = canvas.getBoundingClientRect()
    const { width, height } = el.getBoundingClientRect()
    const margin = 10

    if (this.alignment.y === -1) {
      this.y = 0 + 48 + margin
    } else if (this.alignment.y === 1) {
      this.y = boundaries.height - height - 25 - margin
    }

    if (this.alignment.x === -1) {
      this.x = 0 + margin
    } else if (this.alignment.x === 1) {
      this.x = boundaries.width - width - margin
    }
  }

  addNote(note, index = -1) {
    if (this.notes.includes(note)) return

    if (index <= -1 || index >= this.notes.length) {
      this.notes.push(note)
      return
    }

    this.notes.splice(index, 0, note)
    this.alignLate()
  }

  removeNote(note) {
    const index = this.notes.indexOf(note)
    if (index === -1) return

    this.notes.splice(index, 1)

    if (this.notes.length === 0) {
      this.dispose()
      return
    }

    this.alignLate()
  }

  serialize() {
    return {
      ...super.serialize(),

      alignment: this.alignment,
    }
  }

  deserialize(data) {
    super.deserialize(data)

    this.setAxisAlignment('x', data.alignment?.x ?? 0)
    this.setAxisAlignment('y', data.alignment?.y ?? 0)

    return this
  }

  dispose() {
    this.notebook.removeGroup(this)
  }
}
