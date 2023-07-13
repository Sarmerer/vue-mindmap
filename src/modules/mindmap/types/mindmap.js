import { Tree } from "../../tree";
import { Notebook } from "../../notebook/types/notebook";

import { uuidv4 } from "../../../utils";

export class Mindmap {
  constructor() {
    this.id = uuidv4();

    this.tree = new Tree(this);
    this.notebook = new Notebook(this);

    this.activeElement = null;
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  serialize() {
    return {
      id: this.id,
      tree: this.tree.serialize(),
      notebook: this.notebook.serialize(),
    };
  }

  deserialize(data) {
    this.id = data.id;
    this.tree.deserialize(data.tree);
    this.notebook.deserialize(data.notebook);
  }
}
