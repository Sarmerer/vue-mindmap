export class HotkeysManager {
  constructor() {
    this.hotkeys = new Map();
    this.didInit = false;
  }

  init() {
    if (this.didInit) return;

    document.addEventListener("keydown", (e) => {
      const hotkey = this.normalizeEvent(e);
      const actions = this.hotkeys.get(hotkey);
      if (!actions?.length) return;
      if (document.activeElement.tagName === "INPUT") return;

      e.preventDefault();

      const active = actions.filter((action) => action.when());
      for (const action of active) {
        action.run();
      }
    });

    this.didInit = true;
  }

  normalizeHotkey(hotkey) {
    const keys = hotkey.split("+");

    return keys.map((key) => key.trim().toLowerCase()).join("+");
  }

  normalizeEvent(e) {
    const keys = [];

    if (e.ctrlKey) keys.push("ctrl");
    if (e.shiftKey) keys.push("shift");
    if (e.altKey) keys.push("alt");
    if (e.metaKey) keys.push("meta");

    keys.push(e.key.toLowerCase());

    return keys.join("+");
  }

  on(hotkey, action) {
    this.init();

    if (hotkey instanceof Array) {
      for (const key of hotkey) {
        this.on(key, action);
      }
      return;
    }

    if (!Array.isArray(this.hotkeys.get(hotkey))) {
      this.hotkeys.set(hotkey, []);
    }

    this.hotkeys.get(hotkey).push(action);
  }

  off(hotkey) {
    this.hotkeys.delete(hotkey);
  }

  dispatch(hotkey) {
    const actions = this.hotkeys.get(this.normalizeHotkey(hotkey));
    if (!actions) return;

    for (const action of actions) {
      action.run();
    }
  }

  dispose() {
    this.hotkeys.clear();
  }
}
