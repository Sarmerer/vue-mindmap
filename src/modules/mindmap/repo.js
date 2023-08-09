import EmojiRepo from '../emoji/repo'
import NotebookRepo from '../notebook/repo'
import TreeRepo from '../tree/repo'

export default class MindmapRepo {
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
    this.tree.init()
    this.notebook.init()
    this.emoji.init()
  }

  cache(flush = false) {
    this.tree.cache(flush)
    this.notebook.cache(flush)
    this.emoji.cache(flush)
  }

  flush() {
    this.tree.flush()
    this.notebook.flush()
    this.emoji.flush()
  }
}
