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

      let idx = TextCanvas.gapBuffer.GetDataIdxAtPoint(coords);
      TextCanvas.gapBuffer.SetSelectionStart(idx);

      const setSelectionEnd = (e: MouseEvent) => {
        const coords = getRelativeCoords(
          { x: e.clientX, y: e.clientY },
          this.canvas
        );
        let end_idx = TextCanvas.gapBuffer.GetDataIdxAtPoint(coords);
        if (end_idx < idx) {
          TextCanvas.gapBuffer.SetSelectionStart(end_idx);
          TextCanvas.gapBuffer.SetSelectionEnd(idx);
        } else {
          console.log("Selection End: ", idx);
          TextCanvas.gapBuffer.SetSelectionEnd(end_idx);
        }
      };

      this.canvas.addEventListener("mousemove", setSelectionEnd);

      this.canvas.addEventListener("mouseup", (e) => {
        console.log("mouse up");
        this.canvas.removeEventListener("mousemove", setSelectionEnd);

        console.log("Data", TextCanvas.gapBuffer.GetFullData());
      });
    });
  }
}

export default CursorCanvas;
