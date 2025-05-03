import {
  isPrintableCharacter,
  Size2D,
  Pos2D,
  Canvas,
} from "../utility/utility";
import { Cursor } from "../ui/cursor";
import Font from "../ui/font";
import GapBufferList from "../data-structures/GapBuffer";
import { EventType } from "./event";

export class TextCanvas extends Canvas {
  private size: Size2D;
  private scale: number = window.devicePixelRatio;
  private font: Font;
  private gapBuffer: GapBufferList;

  constructor(size: Size2D) {
    super();

    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.zIndex = "1";

    this.size = size;

    this.gapBuffer = new GapBufferList(this.context);

    this.canvas.width = Math.floor(this.size.width);
    this.canvas.height = Math.floor(this.size.height);

    this.font = new Font();
    this.setFont(this.font);
  }

  public setBackground(fillColor = "black") {
    this.context.fillStyle = fillColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public getContext() {
    return this.context;
  }

  public getRawCanvas() {
    return this.canvas;
  }

  /**
   * Inserts the character to text canvas at cursor position
   */
  public Insert(character: string) {
    if (!isPrintableCharacter(character)) {
      console.error(
        `Character ${character} is not printable or is not a valid character.`
      );
      return;
    }

    this.gapBuffer.Insert(character);

    this.update();
  }

  /**
   * Removes character from text canvas at current cursor position
   */
  public removeChar() {
    this.gapBuffer.Backspace();
    this.update();
  }

  public setFont(font: Font) {
    this.font = font;
    this.context.font = `${this.font.sizeInPixels}px ${this.font.fontFamily}`;
    this.context.fillStyle = `${this.font.fontColor}`;
    this.context.textBaseline = "top";
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const text = this.gapBuffer.GetText();
    const tempCursor: Cursor = new Cursor({
      x: 0,
      y: 0,
    });

    this.gapBuffer.GetCursor().draw(this.context);

    for (const char of text) {
      const { x, y } = tempCursor.getPosition();
      if (char === "\n") {
        tempCursor.setPosition({
          x: 0,
          y: y + this.context.measureText("j").actualBoundingBoxDescent,
        });
      } else {
        const { width } = this.context.measureText(char);

        this.context.fillText(char, x, y);
        tempCursor.setPosition({
          x: x + width,
          y,
        });
      }
    }
  }

  public moveLeft() {
    this.gapBuffer.Left(1);
    this.update();
  }

  public moveRight() {
    this.gapBuffer.Right(1);
    this.update();
  }

  public moveUp() {
    this.gapBuffer.Up(1);
    this.update();
  }

  public moveDown() {
    this.gapBuffer.Down(1);
    this.update();
  }

  public moveToNewLine() {
    this.gapBuffer.NewLine();
    this.update();
  }

  public handleKeyPress(event: KeyboardEvent) {
    const key = event.key;

    if (isPrintableCharacter(key)) {
      this.Insert(key);
    } else if (key === "Backspace") {
      this.removeChar();
    } else if (key === "ArrowLeft") {
      this.moveLeft();
    } else if (key === "ArrowRight") {
      this.moveRight();
    } else if (key === "ArrowUp") {
      this.moveUp();
    } else if (key === "ArrowDown") {
      this.moveDown();
    } else if (key === "Enter") {
      this.moveToNewLine();
    } else {
      console.log("Not printable character");
    }
  }

  public handleEvent(event: any) {
    switch (event.type) {
      case EventType.KeyPress:
        this.handleKeyPress(event.data);
        break;
      default:
        console.warn("Not implemented yet or unknown event");
    }
  }

  public moveCursorToPoint(pos: Pos2D): void {
    this.gapBuffer.MoveCursorToPoint(pos);
    this.update();
  }
}
