export class GapBuffer {
  buffer: string[] = Array(4).fill("");
  start = 0;
  end = 4;
  n = 4;

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
    this.buffer[this.start++] = s;
  }

  Left(count: number): void {
    while (count > 0) {
      if (this.start === 0) return;
      this.start--;
      this.end--;
      this.buffer[this.end] = this.buffer[this.start];

      this.buffer[this.start] = "";
      count--;
    }
  }

  Right(count: number): void {
    while (count > 0) {
      if (this.end == this.n) return;
      this.buffer[this.start] = this.buffer[this.end];
      this.buffer[this.end] = "";

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
}

export function GapBufferTest() {
  const gapBuffer = new GapBuffer();
  gapBuffer.Insert("o");
  gapBuffer.Insert("j");
  gapBuffer.Insert("a");
  gapBuffer.Insert("s");
  gapBuffer.Insert("m");
  gapBuffer.Left(1);
  gapBuffer.Insert("x");
  gapBuffer.Right(1);
  gapBuffer.Insert("y");
  gapBuffer.Left(2);
  gapBuffer.Insert("c");
  gapBuffer.Backspace();
  console.log(gapBuffer.GetText());
}
