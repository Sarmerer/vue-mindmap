import Vue from "vue";

export const eventBus = new Vue();

export function Init() {
  window.addEventListener("keydown", keydown);
}

function keydown(e) {
  const key = getCombination(e);

  switch (key) {
    case "tab":
      call("tree-add-child", null, { prevent: true });
      break;
    case "enter":
      call("tree-add-sibling");
      break;
    case "c":
      call("tree-node-collapse");
      break;
    case "e":
      call("tree-node-edit", e);
      break;
    case "d":
    case "delete":
      call("tree-delete-last-node");
      break;
    case "arrowup":
      call("tree-go-up");
      break;
    case "arrowdown":
      call("tree-go-down");
      break;
    case "arrowleft":
      call("tree-go-left");
      break;
    case "arrowright":
      call("tree-go-right");
      break;
    default:
      break;
  }

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
