import { Canvas } from "../utility/utility";

class MainCanvas extends Canvas {
  constructor() {
    super();
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.zIndex = "0";
  }
}

export default MainCanvas;
