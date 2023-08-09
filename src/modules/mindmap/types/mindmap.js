import { Canvas } from './canvas'
import { Tree } from '../../tree'
import { Notebook } from '../../notebook/types/notebook'

import { ActionsManager } from './actions-manager'
import { EmojiManager } from '../../emoji/types/emoji-manager'
import MindmapRepo from '../repo'

import { uuidv4 } from '../../../utils'

export class Mindmap {
  constructor() {
    this.id = uuidv4()

    this.activeElement = null

    this.canvas = new Canvas()
    this.tree = new Tree(this)
    this.notebook = new Notebook(this)

    this.emoji = new EmojiManager(this)
    this.actions = new ActionsManager(this)
    this.repo = new MindmapRepo(this)
  }

  setActiveElement(element) {
    this.activeElement = element
  }

  serialize() {
    return {
      id: this.id,
      tree: this.tree.serialize(),
      notebook: this.notebook.serialize(),
    }
  }

  deserialize(data) {
    this.id = data.id
    this.tree.deserialize(data.tree)
    this.notebook.deserialize(data.notebook)
  }
}
