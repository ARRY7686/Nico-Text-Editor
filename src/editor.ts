import Event, { EventType } from "./core/event";
import Font from "./ui/font";
import { Size2D, CanvasType, getRelativeCoords } from "./utility/utility";
import { TextCanvas } from "./core/canvases/TextCanvas";
import MainCanvas from "./core/canvases/MainCanvas";
import CursorCanvas from "./core/canvases/CursorCanvas";

class Editor {
  private font: Font = new Font();
  public static mainCanvas: MainCanvas;
  public static textCanvas: TextCanvas;
  public static cursorCanvas: CursorCanvas;
  private scale: number = window.devicePixelRatio;
  private container: HTMLDivElement;

  constructor(container: HTMLDivElement, size: Size2D) {
    this.container = container;
    this.container.tabIndex = 1;
    this.container.style.width = `${size.width}px`;
    this.container.style.height = `${size.height}px`;
    this.container.focus();

    Editor.cursorCanvas = new CursorCanvas(size);
    this.container.appendChild(Editor.cursorCanvas.canvas);

    Editor.mainCanvas = new MainCanvas(size);
    Editor.mainCanvas.setBackground("black");
    this.container.appendChild(Editor.mainCanvas.canvas);

    Editor.textCanvas = new TextCanvas(size);
    this.container.appendChild(Editor.textCanvas.canvas);

    this.attachEventListeners();
    this.setFont(this.font);
  }

  private attachEventListeners() {
    this.container.addEventListener("keypress", (e) => {
      e.preventDefault();
      const event = new Event(EventType.KeyPress, e);
      Editor.textCanvas.handleEvent(event);
    });
    this.container.addEventListener("keydown", (e) => {
      e.preventDefault();
      const event = new Event(EventType.KeyPress, e);
      Editor.textCanvas.handleEvent(event);
    });
    this.container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const event = new Event(EventType.MouseClick, e);
      Editor.textCanvas.handleEvent(event);
    });
    this.container.addEventListener("click", (e) => {
      const pos = getRelativeCoords(
        { x: e.clientX, y: e.clientY },
        Editor.mainCanvas.canvas
      );

      Editor.textCanvas.moveCursorToPoint(pos);
    });
  }

  public setFont(font: Font) {
    Editor.textCanvas.setFont(font);
  }
}

export default Editor;
