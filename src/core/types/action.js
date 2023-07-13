import { Tree } from "../../modules/tree";

/**
 * @callback ActionRunner
 * @param {Tree} tree
 * @returns {Promise}
 *
 * @callback Condition
 * @param {Tree} tree
 * @returns {Boolean}
 *
 * @typedef {Object} ActionOptions
 * @property {String} id
 * @property {String} label
 * @property {String} icon
 * @property {ActionRunner} run
 * @property {Condition} when
 * @property {Array<String>} hotkeys
 * @property {'left' | 'right' | null} toolbarGroupId
 * @property {Number} toolbarOrder
 * @property {String} contextMenuGroupId
 * @property {Number} contextMenuOrder
 */

export class Action {
  /**
   * @param {Tree} tree
   * @param {ActionOptions} actionLike
   */
  constructor(tree, actionLike) {
    this.tree = tree;

    this.id = actionLike.id;
    this.label = actionLike.label || actionLike.id;
    this.icon = actionLike.icon || null;
    this.hotkeys = actionLike.hotkeys || [];

    this.isRunning = false;
    this.run_ = actionLike.run;
    this.when_ = actionLike.when;

    this.toolbarGroupId = actionLike.toolbarGroupId || null;
    this.toolbarOrder = actionLike.toolbarOrder ?? 1;
    this.contextMenuGroupId = actionLike.contextMenuGroupId || null;
    this.contextMenuOrder = actionLike.contextMenuOrder ?? 1;
  }

  run() {
    if (typeof this.run_ !== "function") return;
    if (this.isRunning) return;
    if (!this.when()) return;

    this.isRunning = true;
    this.run_(this.tree);
    this.isRunning = false;
  }

  when() {
    if (typeof this.when_ !== "function") return true;

    return this.when_(this.tree);
  }
}
