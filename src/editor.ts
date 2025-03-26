/*
	Some Important Considerations:-
		=> Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

import DynamicArray from "./data-structures/DynamicArray";
import Event, {EventType} from "./core/event";
import { isPrintableCharacter } from "./utility/utility";
import Font from "./ui/font";
import { Size2D } from "./utility/utility";
import { Canvas } from "./core/Canvas";

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
	private text: TextContent; 
	private font: Font = new Font();
	public static defaultText = "Hello world";
	private context: CanvasRenderingContext2D;
	private Canvas: Canvas;

	constructor(canvas: HTMLCanvasElement, size: Size2D) {
		this.text = new TextContent();

		this.Canvas = new Canvas(canvas, size);
		this.context = this.Canvas.getContext();

		this.text.add(Editor.defaultText);
		this.attachEventListeners();
		this.setFont(this.font);

		this.setBackground();
	}

	public setBackground(fillColor = "black") {
		this.Canvas.setBackground(fillColor);
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

		if (isPrintableCharacter(key)) {
			this.Canvas.appendChar(key);
		} else if (key === "Enter") {
			this.Canvas.moveToNewLine();
		}	
	}

	private attachEventListeners() {
		const canvas = this.Canvas.getRawCanvas();
		if (canvas.tabIndex < 0) {
			console.error("Cannot attach event listeners to canvas as it does not have tabindex attribute set. Please set tabindex to >= 0 of the canvas element.");
			return;
		}

		canvas.addEventListener("keypress", (e) => {
			e.preventDefault()
			const event = new Event(EventType.KeyPress, e);
			this.handleEvent(event);
		});
	}

	public setFont(font: Font) {
		this.Canvas.setFont(font);
	}
}

export default Editor;
