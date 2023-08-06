import { uuidv4 } from '../../../utils'

export class Note {
  constructor(notebook) {
    this.notebook = notebook

    this.id = uuidv4()
    this.group = null

    this.x = 0
    this.y = 0

    this.label = 'Double click to edit'

    this.isEditing = false
  }

  get isActive() {
    return this.notebook.activeNote === this
  }

  setGroup(group) {
    if (this.group === group) return

    this.group?.removeNote(this)

    this.group = group

    group?.addNote(this)
  }

  serialize() {
    return {
      id: this.id,

      x: this.x,
      y: this.y,

      label: this.label,
    }
  }

  deserialize(data) {
    this.id = data.id

    this.x = data.x
    this.y = data.y

    this.label = data.label

    return this
  }
}
