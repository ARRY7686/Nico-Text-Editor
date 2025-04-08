import {
  isPrintableCharacter,
  Size2D,
  ICharacterData,
} from "../utility/utility";
import { Cursor } from "../ui/cursor";
import { ERROR_CONTEXT_NOT_FOUND } from "../utility/asserts";
import Font from "../ui/font";

export class TextCanvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private size: Size2D;
  private cursor: Cursor;
  private scale: number = window.devicePixelRatio;
  private font: Font;
  private characterData: ICharacterData[] = [];

  constructor(canvas: HTMLCanvasElement, size: Size2D) {
    this.canvas = canvas;
    this.size = size;

    this.context = canvas.getContext("2d")!;

    canvas.width = Math.floor(this.size.width * this.scale);
    canvas.height = Math.floor(this.size.height * this.scale);
    // canvas.width = this.size.width;
    // canvas.height = this.size.height;

    this.cursor = new Cursor({
      x: 0,
      y: this.context.measureText("j").actualBoundingBoxDescent,
    });

    this.font = new Font();
    this.setFont(this.font);
    this.renderCursor();
  }

  public setBackground(fillColor = "black") {
    if (!this.context) {
      ERROR_CONTEXT_NOT_FOUND();
      return;
    }

    this.context.fillStyle = fillColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public getContext() {
    return this.context;
  }

  public getCursor() {
    return this.cursor;
  }
  public renderCursor(){
    this.cursor.erase(this.context);

    this.cursor.draw(this.context);
  }

  public getRawCanvas() {
    return this.canvas;
  }

  public appendChar(character: string) {
    if (!isPrintableCharacter(character)) {
      console.error(
        `Character ${character} is not printable or is not a valid character.`
      );
      return;
    }

    const { x, y } = this.cursor.getPosition();
    const charSize = this.context.measureText(character);
    this.characterData.push({
      x,
      y,
      width: Math.ceil(charSize.width),
      height: charSize.actualBoundingBoxDescent,
      actualAscent: charSize.actualBoundingBoxAscent,
      actualDescent: charSize.actualBoundingBoxDescent,
    });
    this.cursor.setPosition({
      x: x + charSize.width,
      y,
    });
    this.renderCursor();

    this.context.fillText(character, x, y);


  }
  public removeChar() {
    if (this.characterData.length <= 0) {
      console.warn("No characters to remove.");
      return;
    }
    const lastChar = this.characterData.pop()!;
    console.log(lastChar);
    const { x, y, width, height } = lastChar;
    this.context.clearRect(x, y, width, height);
    this.cursor.setPosition({
      x: x,
      y: y,
    });
    this.renderCursor();
  }

  public moveToNewLine() {
    const { y } = this.cursor.getPosition();
    this.cursor.setPosition({
      x: 0,
      y: y + this.context.measureText("a").fontBoundingBoxDescent,
    });
    this.renderCursor();
  }

  public setFont(font: Font) {
    this.font = font;
    this.context.font = `${this.font.sizeInPixels}px ${this.font.fontFamily}`;
    this.context.fillStyle = `${this.font.fontColor}`;
    this.context.textBaseline = "top";
  }
  public moveCursorLeft() {
    const { x, y } = this.cursor.getPosition();
    if (x > 0) {
      this.cursor.setPosition({
        x: x - this.characterData[this.characterData.length - 1].width,
        y,
      });
    }
    this.renderCursor();
  }
  public moveCursorRight() {
    const { x, y } = this.cursor.getPosition();
    if (x < this.canvas.width) {
      this.cursor.setPosition({
        x: x + this.characterData[this.characterData.length - 1].width,
        y,
      });
    }
    this.renderCursor();
  }
  public moveCursorUp() {
    const { x, y } = this.cursor.getPosition();
    if (y > 0) {
      this.cursor.setPosition({
        x,
        y: y - this.font.sizeInPixels,
      });
    }
    this.renderCursor();
  }
  public moveCursorDown() {
    const { x, y } = this.cursor.getPosition();
    if (y < this.canvas.height) {
      this.cursor.setPosition({
        x,
        y: y + this.font.sizeInPixels,
      });
    }
    this.renderCursor();
  }
}
