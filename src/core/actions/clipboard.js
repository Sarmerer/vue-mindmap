import { defineActions } from '../../modules/mindmap/types/actions-manager'

const when = ({ tree }) => tree.activeNode != null

export default defineActions(
  {
    id: 'clipboard-copy',
    contextMenuGroupId: 'clipboard',
    label: 'Copy',
    icon: 'clipboard-copy',
    hotkeys: ['ctrl+c'],
    when,
    run({ tree }) {
      tree.clipboard.copy(tree.activeNode)
    },
  },

  {
    id: 'clipboard-cut',
    contextMenuGroupId: 'clipboard',
    label: 'Cut',
    icon: 'scissors',
    hotkeys: ['ctrl+x'],
    when,
    run({ tree }) {
      tree.clipboard.cut(tree.activeNode)
    },
  },

  {
    id: 'clipboard-paste',
    contextMenuGroupId: 'clipboard',
    label: 'Paste',
    icon: 'clipboard-paste',
    hotkeys: ['ctrl+v'],
    when,
    run({ tree }) {
      tree.clipboard.paste(tree.activeNode)
    },
  }
)
