/*
	Some Important Considerations:-
		=> Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

import DynamicArray from "./DynamicArray";
import Event, {EventType} from "./event";

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
	public static defaultText = "Hello world";

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.text = new TextContent();
		this.context = canvas.getContext("2d");
		if (!this.context) {
			console.error("Failed to get 2d context from canvas");
		}

		this.text.add(Editor.defaultText);
		this.attachEventListeners();
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
		
		if (this.context) {
			this.context.font = "16px serif";
			this.context.fillStyle = "white";
			this.context.fillText(key, 10, 50);
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
}

export default Editor;
