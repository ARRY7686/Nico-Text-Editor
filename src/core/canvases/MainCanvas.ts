import { Canvas, Size2D } from "../../utility/utility";

class MainCanvas extends Canvas {
  constructor(size: Size2D) {
    super();

    this.canvas.width = Math.floor(size.width);
    this.canvas.height = Math.floor(size.height);

    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.zIndex = "0";
    this.canvas.id = "MainCanvas";
  }
}

export default MainCanvas;
