class Font {
  public sizeInPixels: number = 80;
  public fontFamily: string = "serif";
  public fontColor: string = "white";

  constructor(
    sizeInPixels = 24,
    fontFamily = "monospace",
    fontColor = "white"
  ) {
    this.sizeInPixels = sizeInPixels;
    this.fontFamily = fontFamily;
    this.fontColor = fontColor;
  }
}

export default Font;
