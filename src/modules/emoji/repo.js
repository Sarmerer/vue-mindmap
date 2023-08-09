export default class EmojiRepo {
  #didCache = false

  constructor(emoji) {
    this.emoji = emoji
  }

  init() {
    this.cache()
  }

  cache(flush = false) {
    if (this.#didCache && !flush) return

    try {
      this.emoji.favorites = JSON.parse(localStorage.getItem('favoriteEmojis'))
    } catch (error) {
      console.error('Failed to initialize emojis from localStorage', error)
    } finally {
      if (!Array.isArray(this.emoji.favorites)) {
        this.emoji.favorites = []
      }
    }

    this.#didCache = true
  }

  flush() {
    localStorage.setItem('favoriteEmojis', JSON.stringify(this.emoji.favorites))
  }
}
