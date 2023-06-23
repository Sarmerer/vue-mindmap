import { Action } from "./action";
import { HotkeysManager } from "./hotkeys-manager";

export class ActionsManager {
  constructor(tree) {
    this.tree = tree;
    this.actions = [];

    this.hotkeysManager = new HotkeysManager();
  }

  /**
   * @param {Array<import("./action").ActionOptions>} actions
   */
  addActions(...actions) {
    for (const action of actions) {
      this.addAction(action);
    }
  }

  /**
   * @param {import("./action").ActionOptions} actionLike
   * @returns {Action}
   */
  addAction(actionLike) {
    const action = new Action(this.tree, actionLike);
    const index = this.actions.findIndex((a) => a.id === action.id);
    if (index !== -1) {
      this.actions.splice(index, 1);
    } else {
      this.actions.push(action);
    }

    for (const hotkey of action.hotkeys) {
      this.hotkeysManager.on(hotkey, action);
    }
  }

  runAction(id) {
    const action = this.actions.get(id);
    if (!action) return;

    action.run();
  }
}
