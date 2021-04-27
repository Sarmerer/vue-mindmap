import Vue from "vue";

export const eventBus = new Vue();

export const events = [
  // { name: "Set root", action: "tree-push-root", hotkey: "g" },
  // { name: "Set root", action: "tree-pop-root", hotkey: "h" },
  {
    title: "Add Child",
    icon: "diagram2",
    event: "tree-add-child",
    hotkey: "tab",
    options: { prevent: true },
  },
  {
    title: "Add Sibling",
    icon: "node-plus",
    event: "tree-add-sibling",
    hotkey: "enter",
  },
  {
    title: "Collapse Node",
    icon: "arrows-collapse",
    event: "tree-node-collapse",
    hotkey: "c",
  },
  {
    title: "Edit Node",
    icon: "pencil",
    event: "tree-node-edit",
    hotkey: "e",
  },

  {
    title: "Toggle Node Done State",
    icon: "check2",
    event: "tree-node-toggle-done",
    hotkey: "d",
  },
  {
    title: "Delete Node",
    icon: "trash",
    event: "tree-delete-last-node",
    hotkey: ["delete", "backspace"],
  },
  {
    title: "Cursor Up",
    event: "tree-go-up",
    hotkey: "arrowup",
    UIIgnore: true,
  },
  {
    title: "Cursor Right",
    event: "tree-go-right",
    hotkey: "arrowright",
    UIIgnore: true,
  },
  {
    title: "Cursor Down",
    event: "tree-go-down",
    hotkey: "arrowdown",
    UIIgnore: true,
  },
  {
    title: "Cursor Left",
    event: "tree-go-left",
    hotkey: "arrowleft",
    UIIgnore: true,
  },
  {
    title: "Save Document",
    event: "document-save",
    hotkey: "ctrl+s",
    options: { prevent: true },
    UIIgnore: true,
  },
];

const eventsMap = {};

export function Init() {
  window.addEventListener("keydown", keydown);
  window.addEventListener("unload", unload);

  for (let event of events) {
    if (!(event.hotkey instanceof Array)) {
      event.hotkey = [event.hotkey];
    }

    for (let key of event.hotkey) {
      const k = key.toLowerCase();
      if (eventsMap[k]) {
        console.error(
          `Multiple hotkeys binding on single event: ${event.event}`
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
  if (match) call(match.event, match.options);

  function call(eventName, options = { prevent: false }) {
    if (options.prevent) e.preventDefault();
    eventBus.$emit(eventName);
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

function unload() {
  window.removeEventListener("keydown", keydown);
  window.removeEventListener("unload", unload);
}
