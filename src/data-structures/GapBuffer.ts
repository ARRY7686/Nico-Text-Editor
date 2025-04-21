import { Cursor } from "../ui/cursor";

class GapBuffer {
  private buffer: string[] = Array(4).fill("");
  private start = 0;
  private end = 4;
  private n = 4;
  private context: CanvasRenderingContext2D;
  private cursor: Cursor;

  constructor(context: CanvasRenderingContext2D, cursor: Cursor) {
    this.context = context;
    this.cursor = cursor;
  }

  SetContext(ctx: CanvasRenderingContext2D) {
    this.context = ctx;
  }

  SetCursor(cursor: Cursor) {
    this.cursor = cursor;
  }

  Expand(): void {
    let new_buffer = Array(this.n * 2).fill("");
    for (let i = 0; i < this.start; i++) {
      new_buffer[i] = this.buffer[i];
    }
    for (let i = this.end; i < this.n; i++) {
      new_buffer[this.n + i] = this.buffer[i];
    }
    this.end += this.n;
    this.n *= 2;
    this.buffer = new_buffer;
  }

  Insert(s: string): void {
    if (this.start == this.end) {
      this.Expand();
    }
    const currPos = this.cursor.getPosition();
    const measurements = this.context.measureText(s);
    const newPos = {
      x: currPos.x + measurements.width,
      y: currPos.y,
    };
    this.cursor.setPosition(newPos);
    this.buffer[this.start++] = s;
  }

  Left(count: number): void {
    while (count > 0) {
      if (this.start === 0) return;
      const { x, y } = this.cursor.getPosition();
      const { width } = this.context.measureText(this.buffer[this.start - 1]);
      const newPos = {
        x: x - width,
        y,
      };
      this.cursor.setPosition(newPos);

      this.start--;
      this.end--;
      this.buffer[this.end] = this.buffer[this.start];

      count--;
    }
  }

  Right(count: number): void {
    while (count > 0) {
      if (this.end == this.n) return;
      this.buffer[this.start] = this.buffer[this.end];

      const { x, y } = this.cursor.getPosition();
      const { width } = this.context.measureText(this.buffer[this.start]);
      const newPos = {
        x: x + width,
        y,
      };
      this.cursor.setPosition(newPos);

      this.start++;
      this.end++;
      count--;
    }
  }

  MoveCursor(pos: number): void {
    const contentLength = this.start + (this.n - this.end);
    pos = Math.max(0, Math.min(pos, contentLength));
    while (this.start > pos) this.Left(1);
    while (this.start < pos) this.Right(1);
  }

  Backspace(): void {
    if (this.start) {
      const { x, y } = this.cursor.getPosition();
      const { width } = this.context.measureText(this.buffer[this.start - 1]);
      const newPos = {
        x: x - width,
        y,
      };
      this.cursor.setPosition(newPos);
      this.start--;
    }
  }

  DeleteForward(): void {
    if (this.end < this.n) {
      this.buffer[this.end] = "";
      this.end++;
    }
  }

  DeleteFromCursorTillEnd(): void {
    while (this.end < this.n) {
      this.buffer[this.end] = "";
      this.end++;
    }
  }

  Length(): number {
    return this.n - (this.end - this.start);
  }

  Get(pos: number): string {
    console.assert(
      pos >= 0 && pos < this.Length(),
      "GapBuffer Error: Index out of bounds"
    );
    if (pos < this.start) return this.buffer[pos];
    return this.buffer[pos + this.end - this.start];
  }

  GetText(): string {
    const preGap = this.buffer.slice(0, this.start).join("");
    const postGap = this.buffer.slice(this.end, this.n).join("");
    return preGap + postGap;
  }

  GetTextTillCursor(): string {
    return this.buffer.slice(0, this.start).join("");
  }

  getCursor(): Cursor {
    return this.cursor;
  }

  GetStart(): number {
    return this.start;
  }

  GetPostGapText(): string {
    return this.buffer.slice(this.end, this.n).join("");
  }
}

class GapBufferList {
  private buffers: GapBuffer[] = [];
  private cursor: Cursor = new Cursor({
    x: 0,
    y: 0,
  });
  private context: CanvasRenderingContext2D;
  private activeBuffer: number = 0;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;

    let buffer = new GapBuffer(this.context, this.cursor);
    this.buffers.push(buffer);
    this.activeBuffer = 0;
  }

  Expand(): void {
    this.buffers[this.activeBuffer].Expand();
  }

  Insert(s: string): void {
    this.buffers[this.activeBuffer].Insert(s);
  }

  Left(count: number): void {
    this.buffers[this.activeBuffer].Left(count);
  }

  Right(count: number): void {
    this.buffers[this.activeBuffer].Right(count);
  }

  MoveCursor(pos: number): void {
    this.buffers[this.activeBuffer].MoveCursor(pos);
  }

  Backspace(): void {
    this.buffers[this.activeBuffer].Backspace();
  }

  DeleteForward(): void {
    this.buffers[this.activeBuffer].DeleteForward();
  }

  Length(): number {
    let length = 0;
    for (const buffer of this.buffers) {
      length += buffer.Length();
    }

    return length;
  }

  Get(pos: number): string {
    // To Be Implemented
    return "";
  }

  GetText(): string {
    let text = "";
    for (const buffer of this.buffers) {
      text += buffer.GetText() + "\n";
    }
    return text;
  }

  GetCursor(): Cursor {
    return this.cursor;
  }

  NewLine() {
    const newGapBuffer = new GapBuffer(this.context, this.cursor);
    const currBuffer = this.buffers[this.activeBuffer];
    const currBufferStart = currBuffer.GetStart();
    const currBufferLen = currBuffer.Length();

    if (currBufferStart < currBufferLen) {
      const remText = currBuffer.GetPostGapText();
      currBuffer.DeleteFromCursorTillEnd();

      this.buffers.splice(this.activeBuffer + 1, 0, newGapBuffer);
      for (const char of remText) {
        newGapBuffer.Insert(char);
      }
      newGapBuffer.MoveCursor(0);
    } else {
      this.buffers.splice(this.activeBuffer + 1, 0, newGapBuffer);
    }

    this.cursor.setPosition({
      x: 0,
      y:
        this.cursor.getPosition().y +
        this.context.measureText("j").actualBoundingBoxDescent,
    });
    this.activeBuffer++;
  }

  Down(count: number) {
    while (count > 0) {
      if (this.activeBuffer == this.buffers.length - 1) return;

      const currBuffer = this.buffers[this.activeBuffer];
      const downBuffer = this.buffers[this.activeBuffer + 1];
      const currStart = currBuffer.GetStart();
      const downLen = downBuffer.Length();

      const currCursorPos = this.cursor.getPosition();

      if (downLen > currStart) {
        // Simply move cursor one unit down
        downBuffer.MoveCursor(currStart);
        this.cursor.setPosition({
          x: currCursorPos.x,
          y:
            currCursorPos.y +
            this.context.measureText("j").actualBoundingBoxDescent,
        });
      } else {
        // Move cursor to end of down line
        downBuffer.MoveCursor(downLen);

        const downLineFullText = downBuffer.GetText();
        const { width } = this.context.measureText(downLineFullText);
        this.cursor.setPosition({
          x: width,
          y:
            currCursorPos.y +
            this.context.measureText("j").actualBoundingBoxDescent,
        });
      }

      this.activeBuffer++;
      count--;
    }
  }

  Up(count: number) {
    while (count > 0) {
      if (this.activeBuffer == 0) return;

      const currBuffer = this.buffers[this.activeBuffer];
      const upBuffer = this.buffers[this.activeBuffer - 1];
      const currStart = currBuffer.GetStart();
      const upLineLength = upBuffer.Length();
      const currCursorPos = this.cursor.getPosition();

      if (upLineLength > currStart) {
        // Simply move cursor one unit up
        upBuffer.MoveCursor(currStart);
        this.cursor.setPosition({
          x: currCursorPos.x,
          y:
            currCursorPos.y -
            this.context.measureText("j").actualBoundingBoxDescent,
        });
      } else {
        // Move cursor to end of up line
        upBuffer.MoveCursor(upLineLength);

        const upLineFullText = upBuffer.GetText();
        const { width } = this.context.measureText(upLineFullText);
        this.cursor.setPosition({
          x: width,
          y:
            currCursorPos.y -
            this.context.measureText("j").actualBoundingBoxDescent,
        });
      }

      this.activeBuffer--;
      count--;
    }
  }
}

export default GapBufferList;
