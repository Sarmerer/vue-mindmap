import * as nodeEmoji from 'node-emoji'

/**
 * @callback ApplyEmoji
 * @param {string} emoji
 *
 * @callback RemoveEmoji
 * @param {string} emoji
 *
 * @callback GetEmoji
 * @returns {string[]}
 *
 * @typedef {Object} EmojiApplicableHandler
 * @property {ApplyEmoji} addEmoji
 * @property {RemoveEmoji} removeEmoji
 * @property {GetEmoji} getEmoji
 */
export default class EmojiApplicable {
  /**
   * @param {EmojiApplicableHandler} handlers
   */
  constructor(handlers) {
    this.getEmoji_ = handlers.getEmoji
    this.addEmoji_ = handlers.addEmoji
    this.removeEmoji_ = handlers.removeEmoji

    this.utils = nodeEmoji
  }

  getEmoji() {
    return this.getEmoji_?.() ?? []
  }

  addEmoji(emoji) {
    this.addEmoji_?.(emoji)
  }

  removeEmoji(emoji) {
    this.removeEmoji_?.(emoji)
  }
}
