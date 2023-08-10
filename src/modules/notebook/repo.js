export default class NotebookRepo {
  #didCache = false

  constructor(notebook) {
    this.notebook = notebook

    this.notebookCache = {}
  }

  init() {
    this.cache()

    const notebook = this.read()
    if (!notebook) return

    this.notebook.deserialize(notebook)
  }

  cache(flush = false) {
    if (this.#didCache && !flush) return

    try {
      this.notebookCache = JSON.parse(localStorage.getItem('notebook'))
    } catch (error) {
      console.error('Failed to initialize notebook from localStorage', error)
    }

    this.#didCache = true
  }

  flush() {
    localStorage.setItem('notebook', JSON.stringify(this.notebook.serialize()))
  }

  read() {
    return this.notebookCache
  }
}
