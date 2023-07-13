export class Reorder {
  constructor() {
    this.activeNote = null;

    this.grabOffsetX = 0;
    this.grabOffsetY = 0;

    this.listeners = {
      update: this.update.bind(this),
      end: this.end.bind(this),
    };
  }

  start(event, note) {
    if (this.activeNote) return;

    this.grabOffsetX = event.clientX - note.x;
    this.grabOffsetY = event.clientY - note.y;
    this.activeNote = note;

    window.addEventListener("mousemove", this.listeners.update);
    window.addEventListener("mouseup", this.listeners.end, { once: true });
  }

  update(event) {
    if (!this.activeNote) return;

    this.activeNote.x = event.clientX - this.grabOffsetX;
    this.activeNote.y = event.clientY - this.grabOffsetY;
  }

  end() {
    if (!this.activeNote) return;

    this.activeNote = null;

    window.removeEventListener("mousemove", this.listeners.update);
  }
}
