import Editor from "../editor";
import { Pos2D, Size2D } from "../utility/utility";

export class Cursor {
  private position: Pos2D;
  private lastPosition: Pos2D;
  private size: Size2D;
  private blinkIntervalID: number = -1;

  constructor(position: Pos2D, width: number = 2) {
    this.position = position;
    this.lastPosition = { ...position };
    this.size = { width, height: 25 };
  }

  public setPosition(position: Pos2D) {
    this.lastPosition = { ...this.position };
    this.position = position;
  }

  public getPosition() {
    return this.position;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "white";
    context.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }

  public erase(context: CanvasRenderingContext2D) {
    context.clearRect(
      this.lastPosition.x,
      this.lastPosition.y,
      this.size.width,
      this.size.height
    );
  }

  public update(context: CanvasRenderingContext2D) {
    this.erase(context);
    this.draw(context);
  }

  /**
   * Move cursor given pixels to the right
   * @param px size in pixels
   */
  public moveRight(px: number) {
    const pos = this.getPosition();
    const newPos = {
      x: pos.x + px,
      y: pos.y,
    };
    this.setPosition(newPos);
  }

  /**
   * Move cursor given pixels to the left
   * @param px size in pixels
   */
  public moveLeft(px: number) {
    const pos = this.getPosition();
    const newPos = {
      x: pos.x - px,
      y: pos.y,
    };
    this.setPosition(newPos);
  }

  public ToggleBlinking(context: CanvasRenderingContext2D) {
    if (this.blinkIntervalID === -1) {
      this.blinkIntervalID = setInterval(() => {
        Editor.cursorCanvas.context.clearRect(
          0,
          0,
          Editor.cursorCanvas.canvas.width,
          Editor.cursorCanvas.canvas.height
        );
        setTimeout(() => {
          this.draw(context);
        }, 300);
      }, 600);
    } else {
      clearInterval(this.blinkIntervalID);
      this.blinkIntervalID = -1;
    }
  }
}
