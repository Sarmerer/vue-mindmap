import { uuidv4 } from "../utils";

export class Canvas {
  constructor() {
    this.id = uuidv4();

    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;

    this.initialPanX = 0;
    this.initialPanY = 0;

    this.cursorX = 0;
    this.cursorY = 0;

    this.isPanning = false;
    this.isZooming = false;

    this.listeners = {
      pan: this.#pan.bind(this),
    };

    window.addEventListener("mousemove", this.#updateCursorPosition.bind(this));
  }

  #updateCursorPosition(event) {
    event = this.toCanvasSpaceEvent(event);
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  pan(event) {
    if (this.isZooming || this.isPanning) return;

    this.isPanning = true;

    this.initialPanX = event.clientX;
    this.initialPanY = event.clientY;

    window.addEventListener("mousemove", this.listeners.pan);
    window.addEventListener("mouseup", this.#panEnd.bind(this), { once: true });
  }

  #pan(event) {
    const dx = event.clientX - this.initialPanX;
    const dy = event.clientY - this.initialPanY;

    this.offsetX += dx;
    this.offsetY += dy;

    this.initialPanX = event.clientX;
    this.initialPanY = event.clientY;
  }

  #panEnd() {
    this.isPanning = false;
    this.initialPanX = 0;
    this.initialPanY = 0;

    window.removeEventListener("mousemove", this.listeners.pan);
  }

  zoom(event) {
    if (this.isZooming || this.isPanning) return;

    const delta = event.deltaY;
    const zoomFactor = 0.1;

    if (delta > 0) {
      this.scale -= zoomFactor;
    }

    if (delta < 0) {
      this.scale += zoomFactor;
    }

    this.scale = Math.max(0.1, this.scale);
  }

  reset() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
  }

  toCanvasSpaceEvent(event) {
    if (event.normalized) return event;

    const { x, y } = this.toCanvasSpace(event.clientX, event.clientY);
    return new MouseEvent(event.type, {
      ...event,
      normalized: true,
      clientX: x,
      clientY: y,
    });
  }

  toCanvasSpace(x, y) {
    const el = document.getElementById(this.id);
    if (!el) return { x, y };

    const rect = el.getBoundingClientRect();

    return {
      x: (x - rect.left) / this.scale,
      y: (y - rect.top) / this.scale,
    };
  }

  toScreenSpace(x, y) {
    const el = document.getElementById(this.id);
    if (!el) return { x, y };

    const rect = el.getBoundingClientRect();

    return {
      x: x * this.scale + rect.left,
      y: y * this.scale + rect.top,
    };
  }
}
