import { defineActions } from "../../modules/mindmap/types/actions-manager";

export default defineActions({
  id: "reset-canvas",
  toolbarGroupId: "right",
  toolbarOrder: 0,
  label: "Reset canvas",
  icon: "locate-fixed",
  hotkeys: ["alt+r"],
  run({ tree }) {
    tree.canvas.reset();
  },
});
