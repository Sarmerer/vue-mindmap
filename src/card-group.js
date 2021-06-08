import { uuidv4 } from "./utils";

export class CardGroup {
  constructor(x = 100, y = 100, cards = [], collapsed = false) {
    this.id = uuidv4();
    this.cards = cards;
    this.x = x;
    this.y = y;
    this.collapsed = collapsed;
  }

  addCard(cardID) {
    this.cards.push(cardID);
  }

  deleteCard(id) {
    const index = this.cards.findIndex((c) => c.id === id);
    if (index < 0) return;
    this.cards.splice(index, 1);
  }
}
