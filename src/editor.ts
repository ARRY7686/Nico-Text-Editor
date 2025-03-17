/*
	Some Important Considerations:-
		=> Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

import { ERROR_CONTEXT_NOT_FOUND } from "./asserts";
import DynamicArray from "./DynamicArray";
import Event, {EventType} from "./event";
import { isPrintableCharacter } from "./utility";
import Font from "./font";

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

class Editor {
	private canvas: HTMLCanvasElement;
	private text: TextContent; 
	private context: CanvasRenderingContext2D | null;
	private font: Font = new Font();
	public static defaultText = "Hello world";
	private horizontalMeter = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.text = new TextContent();
		this.context = canvas.getContext("2d");
		if (!this.context) {
			ERROR_CONTEXT_NOT_FOUND();
		}

		this.text.add(Editor.defaultText);
		this.attachEventListeners();
		this.setFont(this.font);
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

	private handleKeyPress(keyEvent: KeyboardEvent) {
		const key = keyEvent.key;

		if (!this.context) {
			ERROR_CONTEXT_NOT_FOUND();
			return;
		}
		
		if (isPrintableCharacter(key)) {
			this.context.fillText(key, this.horizontalMeter, 50);
			this.horizontalMeter += this.context.measureText(key).width;
		}
	}

	private attachEventListeners() {
		if (this.canvas.tabIndex < 0) {
			console.error("Cannot attach event listeners to canvas as it does not have tabindex attribute set. Please set tabindex to >= 0 of the canvas element.");
			return;
		}

		this.canvas.addEventListener("keypress", (e) => {
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
