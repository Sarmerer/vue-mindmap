import { Note } from "./note";
import { Reorder } from "./reorder";

export class Notebook {
  constructor() {
    this.groups = [];
    this.notes = [];
    this.activeNote = null;

    this.reorder = new Reorder(this);

    const notes = JSON.parse(localStorage.getItem("notes"));
    if (!notes?.length) return;

    this.notes = notes.map((note) => new Note(this).deserialize(note));
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

  serialize() {
    return {
      groups: this.groups.map((group) => group.serialize()),
      notes: this.notes.map((note) => note.serialize()),
    };
  }

  deserialize(data) {}
}
