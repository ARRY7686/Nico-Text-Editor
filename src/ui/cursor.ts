import { Pos2D } from "../utility/utility";

export class Cursor {
  private position: Pos2D;
  private lastPosition: Pos2D;
  private height: number;

  constructor(position: Pos2D, height: number = 20) {
    this.position = position;
    this.lastPosition = { ...position };
    this.height = height;
  }

  public setPosition(position: Pos2D) {
    this.lastPosition = { ...this.position };
    this.position = position;
  }

  public getPosition() {
    return this.position;
  }

  public draw(context: CanvasRenderingContext2D) {
    console.log(context);
    context.fillStyle = "white";
    context.fillRect(this.position.x, this.position.y, 2, this.height);
  }

  public erase(context: CanvasRenderingContext2D) {
    console.log(context);
    context.clearRect(this.lastPosition.x, this.lastPosition.y, 2, this.height);
  }

  public update(context: CanvasRenderingContext2D) {
    console.log(context);
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
}
