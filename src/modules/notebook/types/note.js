import { Sticky } from './sticky'

export class Note extends Sticky {
  constructor(notebook) {
    super(notebook)

    this.group = null
    this.label = 'Double click to edit'
    this.isEditing = false
    this.isShadow = false
  }

  setGroup(group, index = -1) {
    this.group?.removeNote(this)
    this.group = group
    group?.addNote(this, index)
  }

  detach() {
    this.moveToScreenSpace()
    this.setGroup(null)
  }

  moveToScreenSpace() {
    const el = document.getElementById(this.id)
    if (!el) return

    const { x, y } = el.getBoundingClientRect()
    this.x = x
    this.y = y
  }

  serialize() {
    return {
      ...super.serialize(),

      label: this.label,
      group: this.group?.id,
      order: this.group?.notes.indexOf(this) ?? -1,
    }
  }

  deserialize(data) {
    super.deserialize(data)

    this.label = data.label

    return this
  }

  dispose() {
    this.setGroup(null)
    this.notebook.removeNote(this)
  }
}
