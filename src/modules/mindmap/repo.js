import NotebookRepo from '../notebook/repo'
import TreeRepo from '../tree/repo'

export default class MindmapRepo {
  constructor(mindmap) {
    this.mindmap = mindmap

    this.tree = new TreeRepo(this.mindmap.tree)
    this.notebook = new NotebookRepo(this.mindmap.notebook)

    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }

  init() {
    this.tree.init()
    this.notebook.init()
  }

  cache(flush = false) {
    this.tree.cache(flush)
    this.notebook.cache(flush)
  }

  flush() {
    this.tree.flush()
    this.notebook.flush()
  }
}
