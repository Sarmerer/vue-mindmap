import { defineActions } from '../../modules/mindmap/types/actions-manager'
import { Note } from '../../modules/notebook/types/note'

const isAligned = (notebook, axis) => {
  const group = notebook.activeGroup
  if (!group) return false

  switch (axis) {
    case 'up':
      return group.alignment.y === -1
    case 'right':
      return group.alignment.x === 1
    case 'bottom':
      return group.alignment.y === 1
    case 'left':
      return group.alignment.x === -1
    default:
      return false
  }
}

export default defineActions(
  {
    id: 'add-note-to-group',
    toolbarGroupId: 'left',
    label: 'Add note',
    icon: 'sticker',
    hotkeys: ['n'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const note = new Note(notebook)
      note.isEditing = true
      notebook.addNote(note)
      note.setGroup(notebook.activeGroup)
      notebook.setActiveSticky(note)
    },
  },

  {
    id: 'align-group-up',
    toolbarGroupId: 'left',
    label: 'Align group up',
    icon: 'align-start-horizontal',
    intent: ({ notebook }) => (isAligned(notebook, 'up') ? 'success' : null),
    hotkeys: ['u'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = isAligned(notebook, 'up') ? 0 : -1
      notebook.activeGroup.setAxisAlignment('y', value)
    },
  },

  {
    id: 'align-group-right',
    toolbarGroupId: 'left',
    label: 'Align group right',
    icon: 'align-end-vertical',
    intent: ({ notebook }) => (isAligned(notebook, 'right') ? 'success' : null),
    hotkeys: ['r'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = isAligned(notebook, 'right') ? 0 : 1
      notebook.activeGroup.setAxisAlignment('x', value)
    },
  },

  {
    id: 'align-group-bottom',
    toolbarGroupId: 'left',
    label: 'Align group down',
    icon: 'align-end-horizontal',
    intent: ({ notebook }) =>
      isAligned(notebook, 'bottom') ? 'success' : null,
    hotkeys: ['b'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = isAligned(notebook, 'bottom') ? 0 : 1
      notebook.activeGroup.setAxisAlignment('y', value)
    },
  },

  {
    id: 'align-group-left',
    toolbarGroupId: 'left',
    label: 'Align group left',
    icon: 'align-start-vertical',
    intent: ({ notebook }) => (isAligned(notebook, 'left') ? 'success' : null),
    hotkeys: ['l'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = isAligned(notebook, 'left') ? 0 : -1
      notebook.activeGroup.setAxisAlignment('x', value)
    },
  },

  {
    id: 'delete-group',
    toolbarGroupId: 'left',
    label: 'Delete group with notes',
    icon: 'trash',
    intent: 'danger',
    hotkeys: ['del', 'backspace'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const group = notebook.activeGroup
      for (const note of group.notes) {
        note.dispose()
      }

      group?.dispose()
    },
  }
)
