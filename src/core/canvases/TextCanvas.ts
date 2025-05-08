import {
  isPrintableCharacter,
  Size2D,
  Pos2D,
  Canvas,
} from "../../utility/utility";
import { Cursor } from "../../ui/cursor";
import Font from "../../ui/font";
import GapBufferList from "../../data-structures/GapBuffer";
import { EventType } from "../event";
import Editor from "../../editor";
import { getRelativeCoords } from "../../utility/utility";
import MainCanvas from "./MainCanvas";

export class TextCanvas extends Canvas {
  private size: Size2D;
  private scale: number = window.devicePixelRatio;
  public static gapBuffer: GapBufferList;
  private colorPicker: HTMLInputElement;
  private selectionStartInp: HTMLInputElement;
  private selectionEndInp: HTMLInputElement;

  constructor(size: Size2D) {
    super();

    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.zIndex = "1";
    this.canvas.id = "TextCanvas";

    this.size = size;

    TextCanvas.gapBuffer = new GapBufferList(this.context);

    this.canvas.width = Math.floor(this.size.width);
    this.canvas.height = Math.floor(this.size.height);

    this.font = new Font();
    this.setFont(this.font);

    TextCanvas.gapBuffer
      .GetCursor()
      .ToggleBlinking(Editor.cursorCanvas.context);

    this.colorPicker =
      document.querySelector<HTMLInputElement>("#color-picker")!;
    this.selectionStartInp = document.querySelector<HTMLInputElement>(
      "#selection-start-idx"
    )!;
    this.selectionEndInp =
      document.querySelector<HTMLInputElement>("#selection-end-idx")!;

    this.attachEventListeners();
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

    TextCanvas.gapBuffer.Insert(character, this.colorPicker.value);

    this.update();
  }

  /**
   * Removes character from text canvas at current cursor position
   */
  public removeChar() {
    TextCanvas.gapBuffer.Backspace();
    this.update();
  }

  public update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    Editor.mainCanvas.context.clearRect(
      0,
      0,
      Editor.mainCanvas.canvas.width,
      Editor.mainCanvas.canvas.height
    );
    Editor.mainCanvas.setBackground();
    /**
     * TODO: We don't need to clear the entire cursor canvas
     * We can just clear the cursor's prev position and render it on the new position
     * But it doesn't work as expected
     * Find a way to fix this
     */
    Editor.cursorCanvas.context.clearRect(
      0,
      0,
      Editor.cursorCanvas.canvas.width,
      Editor.cursorCanvas.canvas.height
    );

    const data = TextCanvas.gapBuffer.GetFullData();
    const tempCursor: Cursor = new Cursor({
      x: 0,
      y: 0,
    });

    console.log(data);
    let highlight = false;

    for (const obj of data) {
      if (obj.selectionStart) highlight = true;

      const { char, color } = obj;
      const { x, y } = tempCursor.getPosition();
      if (char === "\n") {
        tempCursor.setPosition({
          x: 0,
          y: y + this.context.measureText("j").actualBoundingBoxDescent,
        });
      } else {
        const { width } = this.context.measureText(char);
        if (highlight) {
          Editor.mainCanvas.context.fillStyle = "blue";
          Editor.mainCanvas.context.fillRect(
            x,
            y,
            width,
            this.context.measureText("j").actualBoundingBoxDescent
          );
        } else {
          this.context.fillStyle = color;
        }
        this.context.fillText(char, x, y);
        tempCursor.setPosition({
          x: x + width,
          y,
        });
      }

      if (obj.selectionEnd) highlight = false;
    }
  }

  public moveLeft() {
    TextCanvas.gapBuffer.Left(1);
    this.update();
  }

  public moveRight() {
    TextCanvas.gapBuffer.Right(1);
    this.update();
  }

  public moveUp() {
    TextCanvas.gapBuffer.Up(1);
    this.update();
  }

  public moveDown() {
    TextCanvas.gapBuffer.Down(1);
    this.update();
  }

  public moveToNewLine() {
    TextCanvas.gapBuffer.NewLine();
    this.update();
  }

  public DeleteForward() {
    TextCanvas.gapBuffer.DeleteForward();
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
    } else if (key === "Delete") {
      this.DeleteForward();
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
    TextCanvas.gapBuffer.MoveCursorToPoint(pos);
    this.update();
  }

  public attachEventListeners() {
    this.selectionStartInp.addEventListener("input", (e) => {
      TextCanvas.gapBuffer.SetSelectionStart(
        Number(this.selectionStartInp.value)
      );
      this.update();
    });

    this.selectionEndInp.addEventListener("input", (e) => {
      TextCanvas.gapBuffer.SetSelectionEnd(Number(this.selectionEndInp.value));
      this.update();
    });
  }
}
