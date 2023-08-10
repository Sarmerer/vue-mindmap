import { Action } from './action'
import { HotkeysManager } from './hotkeys-manager'

export class ActionsManager {
  constructor(mindmap) {
    this.mindmap = mindmap
    this.actions = []

    this.hotkeysManager = new HotkeysManager()
  }

  /**
   * @param {Array<import("./action").ActionOptions>} actions
   */
  addActions(...actions) {
    for (const action of actions) {
      this.addAction(action)
    }
  }

  /**
   * @param {import("./action").ActionOptions} actionLike
   * @returns {Action}
   */
  addAction(actionLike) {
    const action = new Action(this.mindmap, actionLike)
    const index = this.actions.findIndex((a) => a.id === action.id)
    if (index === -1) {
      this.actions.push(action)
    } else {
      this.actions.splice(index, 1)
    }

    for (const hotkey of action.hotkeys) {
      this.hotkeysManager.on(hotkey, action)
    }
  }

  run(id) {
    const action = this.actions.find((a) => a.id === id)
    if (!action) {
      console.error(`Action "${id}" not found`)
      return
    }

    action.run()
  }
}

/**
 *
 * @param  {...import("./action").ActionOptions} actions
 * @returns
 */
export function defineActions(...actions) {
  return actions
}
