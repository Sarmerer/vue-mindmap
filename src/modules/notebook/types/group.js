import { Sticky } from './sticky'
import Align from './align'

export class Group extends Sticky {
  constructor(notebook) {
    super(notebook)

    this.notes = []
    this.align = new Align(this)
  }

  addNote(note, index = -1) {
    if (this.notes.includes(note)) return

    if (index <= -1 || index >= this.notes.length) {
      this.notes.push(note)
      return
    }

    this.notes.splice(index, 0, note)
    this.align.alignLate()
  }

  removeNote(note) {
    const index = this.notes.indexOf(note)
    if (index === -1) return

    this.notes.splice(index, 1)

    if (this.notes.length === 0) {
      this.dispose()
      return
    }

    this.align.alignLate()
  }

  serialize() {
    return {
      ...super.serialize(),

      align: this.align.serialize(),
    }
  }

  deserialize(data) {
    super.deserialize(data)

    this.align.deserialize(data.align)

    return this
  }

  dispose() {
    const notes = this.notes.slice()
    for (const note of notes) {
      note.dispose()
    }

    this.notebook.removeGroup(this)
  }
}
