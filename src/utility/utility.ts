import Font from "../ui/font";

export function isPrintableCharacter(char: string) {
  const charCode = char.charCodeAt(0);

  // Check if length is 1 (A single character) and is ASCII
  return char.length === 1 && charCode >= 0 && charCode <= 127;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface Pos2D {
  x: number;
  y: number;
}

export enum CanvasType {
  MainCanvas,
  TextCanvas,
}

export interface ICharacterData {
  x: number;
  y: number;
  width: number;
  height: number;
  actualAscent: number;
  actualDescent: number;
}

export function getRelativeCoords(pos: Pos2D, container: HTMLElement): Pos2D {
  const { left, top } = container.getBoundingClientRect();
  return {
    x: pos.x - left,
    y: pos.y - top,
  };
}

export abstract class Canvas {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  protected font: Font;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
  }

  public setBackground(fillColor = "black") {
    this.context.fillStyle = fillColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public setFont(font: Font) {
    this.font = font;
    this.context.font = `${this.font.sizeInPixels}px ${this.font.fontFamily}`;
    this.context.fillStyle = `${this.font.fontColor}`;
    this.context.textBaseline = "top";
  }
}
