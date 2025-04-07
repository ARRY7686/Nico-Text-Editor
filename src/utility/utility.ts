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
