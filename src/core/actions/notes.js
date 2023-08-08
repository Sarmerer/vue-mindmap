import { defineActions } from '../../modules/mindmap/types/actions-manager'
import { Group } from '../../modules/notebook/types/group'
import { Note } from '../../modules/notebook/types/note'

export default defineActions(
  {
    id: 'add-note',
    toolbarGroupId: 'left',
    label: 'Add note',
    icon: 'sticker',
    hotkeys: ['n'],
    when: ({ notebook, tree }) =>
      notebook.activeSticky === null && tree.activeNode === null,
    run({ notebook }) {
      notebook.addNote(new Note(notebook))
    },
  },

  {
    id: 'edit-note',
    toolbarGroupId: 'left',
    label: 'Edit note',
    icon: 'edit',
    hotkeys: ['e'],
    when: ({ notebook }) =>
      notebook.activeNote !== null && !notebook.activeNote.isEditing,
    run({ notebook }) {
      notebook.activeNote.isEditing = true
    },
  },

  {
    id: 'make-notes-group',
    toolbarGroupId: 'left',
    label: 'Create a group',
    icon: 'folder-plus',
    hotkeys: ['g'],
    when: ({ notebook }) => notebook.activeNote?.group === null,
    run({ notebook }) {
      const group = new Group(notebook)

      const padding = 13
      group.x = notebook.activeNote.x - padding
      group.y = notebook.activeNote.y - padding

      notebook.addGroup(group)
      notebook.activeNote.setGroup(group)
    },
  },

  {
    id: 'delete-note',
    toolbarGroupId: 'left',
    label: 'Delete note',
    icon: 'trash',
    hotkeys: ['del', 'backspace', 'd'],
    when: ({ notebook }) => notebook.activeNote !== null,
    run({ notebook }) {
      notebook.removeNote(notebook.activeNote)
    },
  }
)
