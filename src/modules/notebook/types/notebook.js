import { Group } from './group'
import { Note } from './note'
import { Reorder } from './reorder'
import { Sticky } from './sticky'

export class Notebook {
  constructor(mindmap) {
    this.mindmap = mindmap

    this.groups = []
    this.notes = []

    this.reorder = new Reorder(this)
  }

  get activeSticky() {
    if (!(this.mindmap.activeElement instanceof Sticky)) return null

    return this.mindmap.activeElement
  }

  get activeNote() {
    if (!(this.activeSticky instanceof Note)) return null

    return this.activeSticky
  }

  get activeGroup() {
    if (!(this.activeSticky instanceof Group)) return null

    return this.activeSticky
  }

  setActiveSticky(sticky) {
    this.mindmap.setActiveElement(sticky)
  }

  getNotes() {
    return this.notes.filter((note) => note.group === null)
  }

  addGroup(group) {
    this.groups.push(group)
  }

  removeGroup(group) {
    const index = this.groups.indexOf(group)
    if (index === -1) return

    this.groups.splice(index, 1)
  }

  addNote(note) {
    this.notes.push(note)
  }

  removeNote(note) {
    const index = this.notes.indexOf(note)
    if (index === -1) return

    this.notes.splice(index, 1)
  }

  serialize() {
    return {
      groups: this.groups.map((group) => group.serialize()),
      notes: this.notes.map((note) => note.serialize()),
    }
  }

  deserialize(data) {}
}
