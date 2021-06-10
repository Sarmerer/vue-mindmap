import { uuidv4 } from "./utils";

export class Card {
  constructor(
    text = "",
    icon = "",
    props = { editing: false, x: 0, y: 0, group: undefined, dragging: false }
  ) {
    this.id = uuidv4();
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.text = text;
    this.icon = icon;
    this.editing = props.editing || false;
    this.group = props.group || null;
    this.dragging = props.dragging || false;

    this.focused = false;
    this.noPointerEvents = false;
    this.orderInGroup = 0;
  }

  get isChild() {
    return !!this.group;
  }
}
