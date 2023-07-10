export class Database {
  init() {
    this.#override();
  }

  createTree() {
    this.#override();
  }

  /**
   * @returns {Array<Object<string, any>>} trees
   */
  getTrees() {
    this.#override();
  }

  /**
   * @param {string} id
   * @returns {Object<string, any}
   */
  getTree(id) {
    this.#override();
  }

  /**
   *  @param {string} id
   * @param {Object<string, any>} tree
   */
  setTree(id, tree) {
    this.#override();
  }

  /**
   *  @param {string} id
   */
  deleteTree(id) {
    this.#override();
  }

  #override() {
    throw new Error("Not implemented");
  }
}
