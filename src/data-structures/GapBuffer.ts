import { Cursor } from "../ui/cursor";

class GapBuffer {
  private buffer: string[] = Array(4).fill("");
  private start = 0;
  private end = 4;
  private n = 4;
  private context: CanvasRenderingContext2D;
  private cursor: Cursor = new Cursor({
    x: 0,
    y: 0,
  });

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
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

  getCursor(): Cursor {
    return this.cursor;
  }
}

export default GapBuffer;
