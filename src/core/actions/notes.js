import { defineActions } from '../../modules/mindmap/types/actions-manager'
import { Group } from '../../modules/notebook/types/group'
import { Note } from '../../modules/notebook/types/note'

const isActionable = ({ notebook }) =>
  notebook.activeNote !== null && !notebook.activeNote.isEditing

export default defineActions(
  {
    id: 'add-note',
    toolbarGroupId: 'left',
    label: 'Add note',
    icon: 'file-plus',
    hotkeys: ['n'],
    when: ({ notebook, tree }) =>
      notebook.activeSticky === null && tree.activeNode === null,
    run({ notebook }) {
      const note = new Note(notebook)
      note.isEditing = true
      note.x = window.innerWidth / 2
      note.y = window.innerHeight / 2
      notebook.addNote(note)
      notebook.setActiveSticky(note)
    },
  },

  {
    id: 'add-note-sibling',
    toolbarGroupId: 'left',
    label: 'Add sibling note',
    icon: 'file-plus-2',
    hotkeys: ['n'],
    when: ({ notebook }) =>
      notebook.activeNote !== null && notebook.activeNote.group !== null,
    run({ notebook }) {
      const note = new Note(notebook)
      note.isEditing = true
      notebook.addNote(note)
      note.setGroup(notebook.activeNote.group)
      notebook.setActiveSticky(note)
    },
  },

  {
    id: 'make-notes-group',
    toolbarGroupId: 'left',
    label: 'Create a group',
    icon: 'folder-plus',
    hotkeys: ['g'],
    when: ({ notebook }) =>
      isActionable({ notebook }) && notebook.activeNote.group === null,
    run({ notebook }) {
      const group = new Group(notebook)

      const padding = 13
      group.x = notebook.activeNote.x - padding
      group.y = notebook.activeNote.y - padding

      notebook.addGroup(group)
      notebook.activeNote.setGroup(group)
      notebook.setActiveSticky(group)
    },
  },

  {
    id: 'edit-note',
    toolbarGroupId: 'left',
    label: 'Edit note',
    icon: 'edit',
    hotkeys: ['e'],
    when: isActionable,
    run({ notebook }) {
      notebook.activeNote.isEditing = true
    },
  },

  {
    id: 'edit-note-save',
    toolbarGroupId: 'left',
    label: 'Save note',
    icon: 'check',
    hotkeys: ['enter'],
    when: ({ notebook }) =>
      notebook.activeNote !== null && notebook.activeNote.isEditing,
    run({ notebook }) {
      notebook.activeNote.isEditing = false
    },
  },

  {
    id: 'delete-note',
    toolbarGroupId: 'left',
    label: 'Delete note',
    icon: 'trash',
    intent: 'danger',
    hotkeys: ['del', 'backspace', 'd'],
    when: isActionable,
    run({ notebook }) {
      notebook.removeNote(notebook.activeNote)
    },
  }
)
