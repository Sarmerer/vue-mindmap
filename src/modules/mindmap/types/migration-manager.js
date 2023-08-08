import { uuidv4 } from '../../../utils'
import { get } from 'node-emoji'

export class MigrationManager {
  constructor(mindmap) {
    this.mindmap = mindmap
  }

  isMigrationNeeded() {
    return localStorage.getItem('vuex') !== null
  }

  migrate() {
    if (!this.isMigrationNeeded()) return

    this.mindmap.repo.flush()

    const legacyData = JSON.parse(localStorage.getItem('vuex'))

    localStorage.setItem(
      'trees',
      JSON.stringify(this.migrateTrees(legacyData.documents))
    )

    localStorage.setItem(
      'notebook',
      JSON.stringify({
        groups: this.migrateNoteGroups(legacyData.cardGroups),
        notes: this.migrateNotes(legacyData.cards),
      })
    )

    if (legacyData.settings?.lastDocument) {
      localStorage.setItem('lastTree', legacyData.settings.lastDocument)
      delete legacyData.settings
    }

    localStorage.setItem('vuex-migrated', JSON.stringify(legacyData))
    localStorage.removeItem('vuex')

    this.mindmap.repo.cache(true)
    this.mindmap.repo.init()
  }

  migrateTrees(legacyTrees) {
    const documents = Object.entries(legacyTrees)
    if (!Array.isArray(documents)) return []

    const trees = localStorage.getItem('trees')
      ? JSON.parse(localStorage.getItem('trees'))
      : {}

    for (const [id, legacyTree] of documents) {
      if (trees[id]) continue

      legacyTree.id = id
      trees[id] = this.migrateTree(legacyTree)
    }

    return trees
  }

  migrateTree(legacyTree) {
    return {
      id: legacyTree.id,
      label: legacyTree.name,
      nodes: this.migrateNode(legacyTree.data),
    }
  }

  migrateNode(legacyNode, legacyParent = null) {
    const node = {
      id: uuidv4(),
      parent: legacyParent?.id || null,
      label: this.migrateNodeLabel(legacyNode),
      weight: legacyNode.weight || 1,
      isCompleted: legacyNode.done || false,
      isCollapsed: legacyNode.collapsed || false,
      childrenCountOverride: legacyNode.virtualChildren || 0,
      completedChildrenCountOverride: legacyNode.virtualFinishedChildren || 0,
    }

    if (!Array.isArray(legacyNode.children)) return [node]

    const nodes = [node]
    for (const legacyChild of legacyNode.children) {
      nodes.push(...this.migrateNode(legacyChild, node))
    }

    return nodes
  }

  migrateNodeLabel(legacyNode) {
    if (!Array.isArray(legacyNode.emoji)) return legacyNode.name

    const emoji = legacyNode.emoji.map((emoji) => get(emoji)).join(' ')
    return `${emoji} ${legacyNode.name}`
  }

  migrateNoteGroups(legacyNoteGroups) {
    if (!Array.isArray(legacyNoteGroups)) return []

    const groups = []
    for (const legacyNoteGroup of legacyNoteGroups) {
      groups.push(this.migrateNoteGroup(legacyNoteGroup))
    }

    return groups
  }

  migrateNoteGroup(legacyNoteGroup) {
    return {
      id: legacyNoteGroup.id,
      x: legacyNoteGroup.x,
      y: legacyNoteGroup.y,
      alignment: this.migrateLegacyGroupAlignment(legacyNoteGroup.snap),
    }
  }

  migrateLegacyGroupAlignment(legacyAlignment) {
    const alignment = { x: 0, y: 0 }

    if (!legacyAlignment) return alignment

    if (legacyAlignment.top) alignment.y = -1
    else if (legacyAlignment.bottom) alignment.y = 1

    if (legacyAlignment.left) alignment.x = -1
    else if (legacyAlignment.right) alignment.x = 1

    return alignment
  }

  migrateNotes(legacyNotes) {
    if (!Array.isArray(legacyNotes)) return []

    const notes = []
    for (const legacyNote of legacyNotes) {
      const note = this.migrateNote(legacyNote)

      notes.push(note)
    }

    return notes
  }

  migrateNote(legacyNote) {
    return {
      id: legacyNote.id,
      x: legacyNote.x,
      y: legacyNote.y,
      label: legacyNote.text,
      group: legacyNote.group,
      order: legacyNote.orderInGroup,
    }
  }
}
