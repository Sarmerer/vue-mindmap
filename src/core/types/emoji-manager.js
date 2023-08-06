import * as library from 'node-emoji'

export class EmojiManager {
  constructor(tree) {
    this.tree = tree

    this.favorites = []
  }

  getAll() {
    return Object.entries(library.emoji).reduce((acc, [key, value]) => {
      if (key.startsWith('flag-')) return acc

      acc.push({ key, emoji: value })
      return acc
    }, [])
  }

  getFavorites() {
    return this.favorites.map((e) => library.find(e))
  }

  search(query) {
    return library.search(query)
  }

  toggleFavorite(emoji) {
    const index = this.favorites.indexOf(emoji)
    if (index === -1) {
      this.favorites.push(emoji)
    } else {
      this.favorites.splice(index, 1)
    }
  }

  toggleNodeEmoji(emoji, node = this.tree.activeNode) {
    if (!node) return

    const usedEmojis = new Set(
      this.extractEmojis(node.label).map(({ emoji }) => emoji)
    )
    if (usedEmojis.has(emoji)) {
      usedEmojis.delete(emoji)
    } else {
      usedEmojis.add(emoji)
    }

    const label = library.strip(node.label)
    const emojis = Array.from(usedEmojis).join('')
    node.setLabel(`${emojis} ${label}`)
  }

  extractEmojis(str) {
    const emojis = []
    library.replace(str, emojis.push.bind(emojis))

    return emojis
  }

  serialize() {
    return {
      favorites: this.favorites,
    }
  }

  deserialize(data) {
    this.favorites = data.favorites
  }
}
