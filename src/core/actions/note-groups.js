import { defineActions } from '../../modules/mindmap/types/actions-manager'
import { Note } from '../../modules/notebook/types/note'

export default defineActions(
  {
    id: 'add-note-to-group',
    toolbarGroupId: 'left',
    label: 'Add note',
    icon: 'file-plus-2',
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
    intent: ({ notebook }) => (notebook.activeGroup.align.up ? 'info' : null),
    hotkeys: ['u'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = notebook.activeGroup.align.up ? 0 : -1
      notebook.activeGroup.align.set('y', value)
    },
  },

  {
    id: 'align-group-right',
    toolbarGroupId: 'left',
    label: 'Align group right',
    icon: 'align-end-vertical',
    intent: ({ notebook }) =>
      notebook.activeGroup.align.right ? 'info' : null,
    hotkeys: ['r'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = notebook.activeGroup.align.right ? 0 : 1
      notebook.activeGroup.align.set('x', value)
    },
  },

  {
    id: 'align-group-bottom',
    toolbarGroupId: 'left',
    label: 'Align group down',
    icon: 'align-end-horizontal',
    intent: ({ notebook }) =>
      notebook.activeGroup.align.bottom ? 'info' : null,
    hotkeys: ['b'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = notebook.activeGroup.align.bottom ? 0 : 1
      notebook.activeGroup.align.set('y', value)
    },
  },

  {
    id: 'align-group-left',
    toolbarGroupId: 'left',
    label: 'Align group left',
    icon: 'align-start-vertical',
    intent: ({ notebook }) => (notebook.activeGroup.align.left ? 'info' : null),
    hotkeys: ['l'],
    when: ({ notebook }) => notebook.activeGroup !== null,
    run({ notebook }) {
      const value = notebook.activeGroup.align.left ? 0 : -1
      notebook.activeGroup.align.set('x', value)
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
