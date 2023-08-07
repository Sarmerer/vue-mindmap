import { Mindmap } from './mindmap'

/**
 * @callback ActionRunner
 * @param {Mindmap} mindmap
 * @returns {Promise}
 *
 * @callback Condition
 * @param {Mindmap} mindmap
 * @returns {Boolean}
 *
 * @typedef Intent
 * @type {'danger' | 'success' | 'warning' | 'info'}
 *
 * @typedef {Object} ActionOptions
 * @property {String} id
 * @property {String} label
 * @property {String} icon
 * @property {Intent | ((mindmap: Mindmap) => Intent)} [intent]
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
   * @param {Mindmap} mindmap
   * @param {ActionOptions} actionLike
   */
  constructor(mindmap, actionLike) {
    this.mindmap = mindmap

    this.id = actionLike.id
    this.label = actionLike.label || actionLike.id
    this.icon = actionLike.icon || null
    this.intent_ = actionLike.intent || null
    this.hotkeys = actionLike.hotkeys || []

    this.isRunning = false
    this.run_ = actionLike.run
    this.when_ = actionLike.when

    this.toolbarGroupId = actionLike.toolbarGroupId || null
    this.toolbarOrder = actionLike.toolbarOrder ?? 1
    this.contextMenuGroupId = actionLike.contextMenuGroupId || null
    this.contextMenuOrder = actionLike.contextMenuOrder ?? 1
  }

  get intent() {
    if (typeof this.intent_ !== 'function') return this.intent_

    return this.intent_(this.mindmap)
  }

  run() {
    if (typeof this.run_ !== 'function') return
    if (this.isRunning) return
    if (!this.when()) return

    this.isRunning = true
    this.run_(this.mindmap)
    this.isRunning = false
  }

  when() {
    if (typeof this.when_ !== 'function') return true

    return this.when_(this.mindmap)
  }
}
