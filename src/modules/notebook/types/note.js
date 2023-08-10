import EmojiApplicable from '../../emoji/types/emoji-applicable'
import { Sticky } from './sticky'

export class Note extends Sticky {
  constructor(notebook) {
    super(notebook)

    this.group = null
    this.label = 'Double click to edit'
    this.icon = null
    this.emoji = new EmojiApplicable({
      getEmoji: this.getEmoji.bind(this),
      addEmoji: this.addEmoji.bind(this),
      removeEmoji: this.removeEmoji.bind(this),
    })

    this.isEditing = false
    this.isShadow = false
  }

  setGroup(group, index = -1) {
    this.group?.removeNote(this)
    this.group = group
    group?.addNote(this, index)
  }

  detach() {
    if (!this.group) return

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

  getEmoji() {
    if (typeof this.icon !== 'string') return []

    const emoji = this.emoji.utils.find(this.icon)
    if (!emoji) return []

    return [emoji]
  }

  addEmoji(emoji) {
    this.icon = emoji
  }

  removeEmoji() {
    this.icon = null
  }

  serialize() {
    return {
      ...super.serialize(),

      label: this.label,
      icon: this.icon,
      group: this.group?.id,
      order: this.group?.notes.indexOf(this) ?? -1,
    }
  }

  deserialize(data) {
    super.deserialize(data)

    this.label = data.label
    this.icon = data.icon

    return this
  }

  dispose() {
    this.setGroup(null)
    this.notebook.removeNote(this)
  }
}
