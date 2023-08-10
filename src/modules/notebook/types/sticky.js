import { uuidv4 } from '../../../utils'

export class Sticky {
  constructor(notebook) {
    this.notebook = notebook

    this.id = uuidv4()

    this.x = 0
    this.y = 0
  }

  get isActive() {
    return this.notebook.activeSticky === this
  }

  setActive() {
    this.notebook.setActiveSticky(this)
  }

  detach() {}

  serialize() {
    return {
      id: this.id,

      x: this.x,
      y: this.y,
    }
  }

  deserialize(data) {
    this.id = data.id

    this.x = data.x
    this.y = data.y

    return this
  }
}
