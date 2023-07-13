export default [
  {
    id: "reset-canvas",
    toolbarGroupId: "right",
    toolbarOrder: 0,
    label: "Reset canvas",
    icon: "locate-fixed",
    hotkeys: ["alt+r"],
    run({ tree }) {
      tree.canvas.reset();
    },
  },
];
