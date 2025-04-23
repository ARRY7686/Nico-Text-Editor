import {
  isPrintableCharacter,
  Size2D,
  ICharacterData,
  Pos2D,
} from "../utility/utility";
import { Cursor } from "../ui/cursor";
import Font from "../ui/font";
import GapBufferList from "../data-structures/GapBuffer";
import { EventType } from "./event";

const characterData: ICharacterData[] = [];
/**
 * A canvas-side code data and metadata representation for managing cursor movements, text selections etc.
 */
export const CanvasCharacterDB: { data: ICharacterData[]; pointer: number } = {
  data: characterData,
  pointer: 0,
};

export class TextCanvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private size: Size2D;
  private scale: number = window.devicePixelRatio;
  private font: Font;
  private gapBuffer: GapBufferList;

  constructor(canvas: HTMLCanvasElement, size: Size2D) {
    this.canvas = canvas;
    this.size = size;

    this.context = canvas.getContext("2d")!;

    this.gapBuffer = new GapBufferList(this.context);

    canvas.width = Math.floor(this.size.width * this.scale);
    canvas.height = Math.floor(this.size.height * this.scale);

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
    console.log(text);
    const tempCursor: Cursor = new Cursor({
      x: 0,
      y: 0,
    });

    this.gapBuffer.GetCursor().update(this.context);

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

  /**
   * Move the cursor x positions to the left after verification
   */
  /*
  public moveLeft(x: number) {
    console.log(CanvasCharacterDB.pointer);
    for (let i = 0; i < x; i++) {
      const currCharData =
        CanvasCharacterDB.data[CanvasCharacterDB.pointer - 1];
      this.cursor.moveLeft(currCharData.width);
      CanvasCharacterDB.pointer--;
    }
  }
    */

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
