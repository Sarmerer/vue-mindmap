import { Note } from "./note";
import { Reorder } from "./reorder";

export class Notebook {
  constructor(mindmap) {
    this.mindmap = mindmap;

    this.groups = [];
    this.notes = [];

    this.reorder = new Reorder(this);

    const notes = JSON.parse(localStorage.getItem("notes"));
    if (!notes?.length) return;

    this.notes = notes.map((note) => new Note(this).deserialize(note));
  }

  get activeNote() {
    if (!(this.mindmap.activeElement instanceof Note)) return null;

    return this.mindmap.activeElement;
  }

  addNote() {
    this.notes.push(new Note());
  }

  removeNote(note) {
    const index = this.notes.indexOf(note);
    if (index !== -1) {
      this.notes.splice(index, 1);
    }
  }

  setActiveNote(note) {
    this.mindmap.setActiveElement(note);
  }

  serialize() {
    return {
      groups: this.groups.map((group) => group.serialize()),
      notes: this.notes.map((note) => note.serialize()),
    };
  }

  deserialize(data) {}
}
