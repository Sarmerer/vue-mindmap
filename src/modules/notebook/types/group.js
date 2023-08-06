export class Group {
  constructor(notebook) {
    this.notebook = notebook

    this.id = uuidv4()
    this.x = 0
    this.y = 0
    this.notes = []
  }

  addNote(note) {
    if (this.notes.includes(note)) return

    this.notes.push(note)
  }

  removeNote(note) {
    const index = this.notes.indexOf(note)
    if (index === -1) return

    this.notes.splice(index, 1)
  }

  serialize() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      notes: this.notes.map((note) => note.id),
    }
  }

  deserialize(data) {
    this.id = data.id
    this.x = data.x
    this.y = data.y
    this.notes = data.notes

    return this
  }
}
