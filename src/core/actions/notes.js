import { defineActions } from '../../modules/mindmap/types/actions-manager'
import { Note } from '../../modules/notebook/types/note'

export default defineActions(
  {
    id: 'add-note',
    toolbarGroupId: 'left',
    label: 'Add note',
    icon: 'sticker',
    hotkeys: ['n'],
    when: ({ notebook }) => notebook.activeNote !== null,
    run({ notebook }) {
      notebook.addNote(new Note(notebook))
    },
  },
  {
    id: 'delete-note',
    toolbarGroupId: 'left',
    label: 'Delete note',
    icon: 'trash',
    hotkeys: ['del'],
    when: ({ notebook }) => notebook.activeNote !== null,
    run({ notebook }) {
      notebook.removeNote(notebook.activeNote)
    },
  }
)
