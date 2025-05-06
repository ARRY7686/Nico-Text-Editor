import { Canvas, getRelativeCoords, Size2D } from "../../utility/utility";
import Font from "../../ui/font";
import Editor from "../../editor";
import { TextCanvas } from "./TextCanvas";

class CursorCanvas extends Canvas {
  private size: Size2D;

  constructor(size: Size2D) {
    super();
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.zIndex = "2";
    this.canvas.id = "CursorCanvas";
    this.canvas.style.cursor = "text";

    this.size = size;

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;

    this.setFont(new Font());

    this.attachEventListeners();
  }

  public attachEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const coords = getRelativeCoords(
        { x: e.clientX, y: e.clientY },
        this.canvas
      );

      const idx = TextCanvas.gapBuffer.GetDataIdxAtPoint(coords);
      console.log("Idx", idx);
    });
  }
}

export default CursorCanvas;
