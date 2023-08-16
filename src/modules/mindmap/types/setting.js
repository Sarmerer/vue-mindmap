import { Mindmap } from './mindmap'

/**
 * @callback SettingRunner
 * @param {Mindmap} mindmap
 *
 *
 * @typedef {Object} SettingLike
 * @property {sting} id
 * @property {string} label
 * @property {any} value
 * @property {string[]} [options]
 * @property {SettingRunner} [changed]
 */

export default class Setting {
  #change = null

  constructor(mindmap, settingLike) {
    this.mindmap = mindmap

    this.id = settingLike.id
    this.label = settingLike.label
    this.value = settingLike.value
    this.options = settingLike.options || []

    this.#change = settingLike.changed || null
  }

  set(value) {
    this.mindmap.settings.set(this.id, value)
  }

  changed() {
    if (typeof this.#change !== 'function') return

    this.#change(this.mindmap)
  }

  serialize() {
    return this.value
  }

  deserialize(value) {
    this.value = value

    this.changed()
  }
}
