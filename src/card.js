export class Card {
  constructor(text = "", icon = "", props = { editing: false, x: 0, y: 0 }) {
    this.id = uuidv4();
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.text = text;
    this.icon = icon;
    this.editing = props.editing || false;
  }
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
