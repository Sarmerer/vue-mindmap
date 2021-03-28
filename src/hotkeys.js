import Vue from "vue";

export const eventBus = new Vue();

export const events = [
  {
    name: "Add child",
    action: "tree-add-child",
    hotkey: "tab",
    options: { prevent: true },
  },
  { name: "Add sibling", action: "tree-add-sibling", hotkey: "enter" },
  { name: "Collapse last node", action: "tree-node-collapse", hotkey: "c" },
  { name: "Edit last node", action: "tree-node-edit", hotkey: "e" },
  {
    name: "Delete last node",
    action: "tree-delete-last-node",
    hotkey: ["d", "delete", "backspace"],
  },
  { name: "Cursor up", action: "tree-go-up", hotkey: "arrowup" },
  { name: "Cursor right", action: "tree-go-right", hotkey: "arrowright" },
  { name: "Cursor down", action: "tree-go-down", hotkey: "arrowdown" },
  { name: "Cursor left", action: "tree-go-left", hotkey: "arrowleft" },
];

const eventsMap = {};

export function Init() {
  window.addEventListener("keydown", keydown);

  for (let event of events) {
    if (!(event.hotkey instanceof Array)) {
      event.hotkey = [event.hotkey];
    }

    for (let key of event.hotkey) {
      const k = key.toLowerCase();
      if (eventsMap[k]) {
        console.error(
          `Multiple hotkeys binding on single action: ${event.action}`
        );
        continue;
      }
      eventsMap[k] = event;
    }
  }
}

function keydown(e) {
  const key = getCombination(e);
  const match = eventsMap[key];
  if (match) call(match.action, e, match.options);

  function call(eventName, event, options = { prevent: false }) {
    if (options.prevent) e.preventDefault();
    eventBus.$emit(eventName, event);
  }
}

function getCombination(event) {
  let combination = [];

  if (event.ctrlKey && event.key !== "Control") combination.push("ctrl");
  if (event.altKey && event.key !== "Alt") combination.push("alt");
  if (event.shiftKey && event.key !== "Shift") combination.push("shift");

  combination.push(event.key.toLowerCase());
  return combination.join("+");
}
