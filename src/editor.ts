import Event, { EventType } from "./core/event";
import Font from "./ui/font";
import { Size2D, CanvasType, getRelativeCoords } from "./utility/utility";
import { TextCanvas } from "./core/TextCanvas";
import MainCanvas from "./core/MainCanvas";

class Editor {
  private font: Font = new Font();
  private mainCanvas: MainCanvas;
  private textCanvas: TextCanvas;
  private scale: number = window.devicePixelRatio;
  private container: HTMLDivElement;

  constructor(container: HTMLDivElement, size: Size2D) {
    this.container = container;
    this.container.tabIndex = 1;
    this.container.style.width = `${size.width}px`;
    this.container.style.height = `${size.height}px`;
    this.container.focus();

    this.mainCanvas = new MainCanvas();

    this.mainCanvas.canvas.width = Math.floor(size.width);
    this.mainCanvas.canvas.height = Math.floor(size.height);

    this.container.appendChild(this.mainCanvas.canvas);

    this.textCanvas = new TextCanvas(size);
    this.textCanvas.setBackground();

    this.container.appendChild(this.textCanvas.canvas);

    this.attachEventListeners();
    this.setFont(this.font);

    this.setBackground();
  }

  public setBackground(fillColor = "black") {
    this.mainCanvas.context.fillStyle = fillColor;
    this.mainCanvas.context.fillRect(
      0,
      0,
      this.mainCanvas.canvas.width,
      this.mainCanvas.canvas.height
    );
  }

  private attachEventListeners() {
    this.container.addEventListener("keypress", (e) => {
      e.preventDefault();
      const event = new Event(EventType.KeyPress, e);
      this.textCanvas.handleEvent(event);
    });
    this.container.addEventListener("keydown", (e) => {
      e.preventDefault();
      const event = new Event(EventType.KeyPress, e);
      this.textCanvas.handleEvent(event);
    });
    this.container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const event = new Event(EventType.MouseClick, e);
      this.textCanvas.handleEvent(event);
    });
    this.container.addEventListener("click", (e) => {
      const pos = getRelativeCoords(
        { x: e.clientX, y: e.clientY },
        this.mainCanvas.canvas
      );

      this.textCanvas.moveCursorToPoint(pos);
    });
  }

  public setFont(font: Font) {
    this.textCanvas.setFont(font);
  }
}

export default Editor;
