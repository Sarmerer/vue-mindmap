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

  get repo() {
    return this.mindmap.repo.notebook
  }

  get actions() {
    return this.mindmap.actions
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

    if (this.activeSticky === group) {
      this.setActiveSticky(null)
    }

    this.groups.splice(index, 1)
  }

  addNote(note) {
    this.notes.push(note)
  }

  removeNote(note) {
    const index = this.notes.indexOf(note)
    if (index === -1) return

    if (this.activeSticky === note) {
      this.setActiveSticky(null)
    }

    this.notes.splice(index, 1)
  }

  serialize() {
    return {
      groups: this.groups.map((group) => group.serialize()),
      notes: this.notes.map((note) => note.serialize()),
    }
  }

  deserialize(data) {
    if (!data) return this

    const index = new Map()
    const dataGroups = data.groups ?? []
    const dataNotes = (data.notes ?? []).sort((a, b) => a.order - b.order)

    for (const groupData of dataGroups) {
      const group = new Group(this).deserialize(groupData)
      index.set(group.id, group)
      this.addGroup(group)
    }

    for (const noteData of dataNotes) {
      const note = new Note(this).deserialize(noteData)
      index.set(note.id, note)
      this.addNote(note)

      if (noteData.group) {
        const group = index.get(noteData.group) ?? null
        note.setGroup(group)
      }
    }

    return this
  }
}
