/*
	Some Important Considerations:-
		=> Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

import { ERROR_CONTEXT_NOT_FOUND } from "./utility/asserts";
import DynamicArray from "./data-structures/DynamicArray";
import Event, {EventType} from "./core/event";
import { isPrintableCharacter } from "./utility/utility";
import Font from "./ui/font";

class TextContent {
	private m_content: DynamicArray;

	constructor() {
		this.m_content = new DynamicArray();
	}

	public add(text: string) {
		this.m_content.push(text);
	}

	public getAssociatedDynamicArray() {
		return this.m_content;
	}

	public getString() {
		let str = "";
		const length = this.m_content.getLength();

		for (let i = 0; i < length; i++) {
			str += this.m_content.get(i);
		}
		return str;
	}
}

export interface Dimensions2D {
	width: number,
	height: number,
}

class Editor {
	private canvas: HTMLCanvasElement;
	private text: TextContent; 
	private context: CanvasRenderingContext2D | null;
	private font: Font = new Font();
	public static defaultText = "Hello world";
	private horizontalMeter = 0;
	private size: Dimensions2D;
	private scale: number = window.devicePixelRatio;

	constructor(canvas: HTMLCanvasElement, size: Dimensions2D) {
		this.canvas = canvas;
		this.size = size;
		this.text = new TextContent();
		this.context = canvas.getContext("2d");
		if (!this.context) {
			ERROR_CONTEXT_NOT_FOUND();
			return;
		}

		this.text.add(Editor.defaultText);
		this.attachEventListeners();
		this.setFont(this.font);

		canvas.width = Math.floor(this.size.width * this.scale); 
        canvas.height = Math.floor(this.size.height * this.scale);

		this.setBackground();
	}

	public setBackground(fillColor = "black") {
		if (!this.context) {
			ERROR_CONTEXT_NOT_FOUND;
			return;
		}

		this.context.fillStyle = fillColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private handleEvent(event: Event) {
		switch(event.type) {
			case EventType.KeyPress:
				if (event.data instanceof KeyboardEvent) {
					this.handleKeyPress(event.data);
				} else {
					console.error(`Event of type ${event.type} passed as a Keyboard Event.`);
				}
				break;
			case EventType.MouseClick:
				break;
			case EventType.MouseSelection:
				break;
			case EventType.None:
				break;
			default:
				console.error("Invalid event type");
		}
	}

	/**
	 * @todo Also update text in dynamic array
	 */
	private handleKeyPress(keyEvent: KeyboardEvent) {
		const key = keyEvent.key;

		if (!this.context) {
			ERROR_CONTEXT_NOT_FOUND();
			return;
		}
		
		if (isPrintableCharacter(key)) {
			const charSize = this.context.measureText(key);
			this.context.fillText(key, this.horizontalMeter, charSize.fontBoundingBoxAscent);
			this.horizontalMeter += this.context.measureText(key).width;
		}
	}

	private attachEventListeners() {
		if (this.canvas.tabIndex < 0) {
			console.error("Cannot attach event listeners to canvas as it does not have tabindex attribute set. Please set tabindex to >= 0 of the canvas element.");
			return;
		}

		this.canvas.addEventListener("keypress", (e) => {
			e.preventDefault()
			const event = new Event(EventType.KeyPress, e);
			this.handleEvent(event);
		});
	}

	public setFont(font: Font) {
		if (!this.context) {
			ERROR_CONTEXT_NOT_FOUND();
			return;
		}

		this.font = font;
		this.context.font = `${this.font.sizeInPixels}px ${this.font.fontFamily}`;
		this.context.fillStyle = `${this.font.fontColor}`;
	}
}

export default Editor;
