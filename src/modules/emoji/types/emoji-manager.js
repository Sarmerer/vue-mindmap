import * as library from 'node-emoji'

export class EmojiManager {
  constructor(mindmap) {
    this.mindmap = mindmap

    this.favorites = []
  }

  get repo() {
    return this.mindmap.repo.emoji
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

  toggleFavorite(emoji) {
    const index = this.favorites.indexOf(emoji)
    if (index === -1) {
      this.favorites.push(emoji)
    } else {
      this.favorites.splice(index, 1)
    }
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
