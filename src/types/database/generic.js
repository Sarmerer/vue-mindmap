export class Database {
  init() {
    this.#override();
  }

  /**
   * @param {string} id
   * @returns {Object<string, any}
   */
  readTree(id) {
    this.#override();
  }

  /**
   *  @param {string} id
   * @param {Object<string, any>} tree
   * @returns {void}
   */
  writeTree(id, tree) {
    this.#override();
  }

  #override() {
    throw new Error("Not implemented");
  }
}
