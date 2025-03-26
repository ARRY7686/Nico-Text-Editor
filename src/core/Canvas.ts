import { isPrintableCharacter, Size2D } from "../utility/utility";
import { Cursor } from "../ui/cursor";
import { ERROR_CONTEXT_NOT_FOUND } from "../utility/asserts";
import Font from "../ui/font";

export class Canvas {
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private size: Size2D;
	private cursor: Cursor;
	private scale: number = window.devicePixelRatio;
    private font: Font;

    constructor(canvas: HTMLCanvasElement, size: Size2D) {
		this.canvas = canvas;
		this.size = size;

		this.context = canvas.getContext("2d")!;

		canvas.width = Math.floor(this.size.width * this.scale); 
        canvas.height = Math.floor(this.size.height * this.scale);

		this.cursor = new Cursor({
			x: 0,
			y: this.context.measureText('a').fontBoundingBoxAscent + 20,
		});

        this.font = new Font();
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

    public getRawCanvas() {
        return this.canvas;
    }

    public appendChar(character: string) {
        if(!isPrintableCharacter(character)) {
            console.error(`Character ${character} is not printable or is not a valid character.`);
            return;
        }

		const {x, y} = this.cursor.getPosition();
        const charSize = this.context.measureText(character);
        this.context.fillText(character, x, y);
        this.cursor.setPosition({
            x: x + charSize.width,
            y
        });
    }

    public moveToNewLine() {
		const {y} = this.cursor.getPosition();
        this.cursor.setPosition({
            x: 0,
            y: y + this.context.measureText('a').fontBoundingBoxAscent
        });
    }

	public setFont(font: Font) {
		this.font = font;
		this.context.font = `${this.font.sizeInPixels}px ${this.font.fontFamily}`;
		this.context.fillStyle = `${this.font.fontColor}`;
	}
};