
class Font {
    public sizeInPixels: number = 14;
    public fontFamily: string = "serif";
    public fontColor: string = "white";

    constructor(sizeInPixels = 14, fontFamily = "serif", fontColor = "white") {
        this.sizeInPixels = sizeInPixels;
        this.fontFamily = fontFamily;
        this.fontColor = fontColor;
    }
}

export default Font;