import { Group } from './group'
import { Note } from './note'

export class Reorder {
  constructor(notebook) {
    this.notebook = notebook

    this.activeSticky = null
    this.shadow = null

    this.hoveredGroup = null
    this.potentialRelative = null
    this.potentialRelativeOffset = 1

    this.grabOffsetX = 0
    this.grabOffsetY = 0

    this.initialX = 0
    this.initialY = 0

    this.listeners = {
      update: this.update.bind(this),
      end: this.end.bind(this),
    }
  }

  getStickyRect(sticky) {
    if (!sticky) return null

    const el = document.getElementById(sticky.id)
    if (!el) return null

    return el.getBoundingClientRect()
  }

  get canvas() {
    return this.notebook.mindmap.canvas
  }

  maybeStart(sticky) {
    sticky.setActive()

    this.initialX = this.canvas.cursorScreenX
    this.initialY = this.canvas.cursorScreenY

    const xThreshold = 15
    const yThreshold = 15
    const maybeStart_ = () => {
      const dx = Math.abs(this.canvas.cursorScreenX - this.initialX)
      const dy = Math.abs(this.canvas.cursorScreenY - this.initialY)
      if (dx < xThreshold && dy < yThreshold) return

      this.start(sticky)
    }

    const cancel = () => window.removeEventListener('mousemove', maybeStart_)

    window.addEventListener('mousemove', maybeStart_)
    window.addEventListener('mouseup', cancel, { once: true })
  }

  start(sticky) {
    if (this.activeSticky) return

    sticky.detach()
    sticky.setActive()

    this.grabOffsetX = this.canvas.cursorScreenX - sticky.x
    this.grabOffsetY = this.canvas.cursorScreenY - sticky.y
    this.activeSticky = sticky

    window.addEventListener('mousemove', this.listeners.update)
    window.addEventListener('mouseup', this.listeners.end, { once: true })
  }

  update() {
    if (!this.activeSticky) return

    if (!this.activeSticky.align?.isAlignedX) {
      this.activeSticky.x = this.canvas.cursorScreenX - this.grabOffsetX
    }

    if (!this.activeSticky.align?.isAlignedY) {
      this.activeSticky.y = this.canvas.cursorScreenY - this.grabOffsetY
    }

    if (this.activeSticky instanceof Group) return

    const previousHoveredGroup = this.hoveredGroup
    const hoveredGroup = this.getHoveredSticky(this.notebook.groups)
    this.hoveredGroup = hoveredGroup

    const hoveredSticky = this.getHoveredSticky()
    if (!hoveredSticky || hoveredSticky === this.shadow) {
      if (!(previousHoveredGroup && hoveredGroup)) {
        this.shadow?.dispose()
        this.shadow = null
        this.potentialRelative = null
      }

      this.updatePotentialRelativeOffset()
      return
    }

    this.potentialRelative = hoveredSticky
    this.updatePotentialRelativeOffset()
    this.drawShadow()
  }

  end() {
    if (!this.activeSticky) return

    this.shadow?.dispose()
    this.shadow = null

    this.reorder()

    this.activeSticky = null
    this.potentialRelative = null
    this.potentialRelativeOffset = 1

    window.removeEventListener('mousemove', this.listeners.update)
  }

  updatePotentialRelativeOffset() {
    if (!this.potentialRelative) return

    const active = this.getStickyRect(this.activeSticky)
    const relative = this.getStickyRect(this.potentialRelative)
    const dx = active.x - (relative.x + relative.width / 2)

    this.potentialRelativeOffset = dx < 0 ? 0 : 1
  }

  drawShadow() {
    const group = this.potentialRelative?.group
    if (!group) return

    if (!this.shadow) {
      const shadow = new Note(this.notebook)
      shadow.isShadow = true
      this.notebook.addNote(shadow)
      this.shadow = shadow
    }

    const index = group.notes.indexOf(this.potentialRelative)
    this.shadow.setGroup(group, index + this.potentialRelativeOffset)
  }

  reorder() {
    if (!this.potentialRelative) return

    const group = this.getStickyGroup(this.potentialRelative)
    const index = group.notes.indexOf(this.potentialRelative)
    this.activeSticky.setGroup(group, index + this.potentialRelativeOffset)
  }

  getStickyGroup(sticky) {
    if (sticky.group) {
      return sticky.group
    }

    const group = new Group(this.notebook)
    group.x = sticky.x - 13
    group.y = sticky.y - 13

    this.notebook.addGroup(group)
    sticky.setGroup(group)

    return group
  }

  getHoveredSticky(stickies = this.notebook.notes) {
    const { x, y } = this.getStickyRect(this.activeSticky)

    for (const sticky of stickies) {
      if (sticky === this.activeSticky) continue
      if (!this.isHovering(x, y, sticky)) continue

      return sticky
    }

    return null
  }

  isHovering(x, y, sticky) {
    const rect = this.getStickyRect(sticky)
    if (!rect) return false

    return !(x < rect.x || x > rect.right || y < rect.y || y > rect.bottom)
  }
}
