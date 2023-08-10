export default class TreeRepo {
  #didCache = false

  constructor(tree) {
    this.tree = tree

    this.trees = {}
    this.lastTreeId = null
  }

  init() {
    this.cache()

    const lastTree = this.readLast()
    if (!lastTree) return

    this.tree.deserialize(lastTree)
    this.tree.renderer.render()
  }

  cache(flush = false) {
    if (this.#didCache && !flush) return

    try {
      this.trees = JSON.parse(localStorage.getItem('trees'))
    } catch (error) {
      console.error('Failed to initialize trees from localStorage', error)
    } finally {
      if (!this.trees || typeof this.trees !== 'object') {
        this.trees = {}
      }
    }

    this.lastTreeId = localStorage.getItem('lastTree') ?? null
    this.#didCache = true
  }

  flush() {
    this.update(this.tree.id, this.tree.serialize())

    localStorage.setItem('lastTree', this.lastTreeId)
    localStorage.setItem('trees', JSON.stringify(this.trees))
  }

  create(id, tree) {
    this.trees[id] = tree
  }

  read(id) {
    return this.trees[id] ?? null
  }

  readAll() {
    return this.trees
  }

  update(id, tree) {
    if (!this.read(id)) return

    this.trees[id] = tree
  }

  delete(id) {
    delete this.trees[id]
  }

  readLast() {
    return this.read(this.lastTreeId) ?? null
  }

  readLastId() {
    return this.lastTreeId
  }

  setLastId(id) {
    this.lastTreeId = id
  }
}
