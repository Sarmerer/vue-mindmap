import EmojiRepo from '../emoji/repo'
import NotebookRepo from '../notebook/repo'
import TreeRepo from '../tree/repo'

export default class MindmapRepo {
  #didCache = false

  constructor(mindmap) {
    this.mindmap = mindmap

    this.tree = new TreeRepo(this.mindmap.tree)
    this.notebook = new NotebookRepo(this.mindmap.notebook)
    this.emoji = new EmojiRepo(this.mindmap.emoji)

    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }

  init() {
    this.#init()
    this.tree.init()
    this.notebook.init()
    this.emoji.init()
  }

  cache(flush = false) {
    this.#cache(flush)
    this.tree.cache(flush)
    this.notebook.cache(flush)
    this.emoji.cache(flush)
  }

  flush() {
    this.#flush()
    this.tree.flush()
    this.notebook.flush()
    this.emoji.flush()
  }

  #init() {
    this.#cache()
  }

  #cache(flush = false) {
    if (this.#didCache && !flush) return

    try {
      const settings = JSON.parse(localStorage.getItem('settings'))
      this.mindmap.settings.deserialize(settings || {})
    } catch (error) {
      console.error('failed to initialize settings from local storage')
    }

    this.#didCache = true
  }

  #flush() {
    localStorage.setItem(
      'settings',
      JSON.stringify(this.mindmap.settings.serialize())
    )
  }
}
