/*
	Some Important Considerations:-
		=> Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

function ASSERT_ONLY_ASCII_ALLOWED(value: number) {
	console.assert(value >= 0 && value<= 127, `Character ${String.fromCharCode(value)} with code ${value} is not an ASCII character. Only ASCII characters are supported`);
}

/** 
	* Stores fixed size continuous buffer of 8 byte uint
	* 
	* Expands the buffer 
*/
class DynamicArray {
	private m_buffer: Uint8Array;
	private m_length: number;
	private m_capacity: number;
	private growthFactor: number = 5;

	constructor() {
		this.m_length= 0;
		this.m_buffer = new Uint8Array(this.growthFactor);
		this.m_capacity = this.growthFactor;
	}

	static isUint8(value: number) : boolean {
		return value >= 0 && value <= 255;
	}

	public push(str: string) {
		// Check if current buffer is large enough to hold str
		// If not then grow buffer by (str.length - (m_capacity - m_length)) + k
		
		const remainingBufferSize = this.m_capacity - this.m_length;
		const growthMark = this.m_length; // Grow from here
		if (str.length > remainingBufferSize) {
			this.grow((str.length - remainingBufferSize) + this.growthFactor);
		}

		for (let i = 0; i < str.length; i++) {
			const char = str[i];
			const charCode = char.charCodeAt(0);
			ASSERT_ONLY_ASCII_ALLOWED(charCode);

			this.m_buffer[growthMark + i] = charCode;
			this.m_length++;
		}
	}

	private grow(size: number) {
		// Create a new buffer
		const newArray = new Uint8Array(this.m_capacity + size);
		
		// Copy all data from old buffer into new buffer
		for (let i = 0; i < this.m_length; i++) {
			newArray[i] = this.m_buffer[i];
		}

		this.m_buffer = newArray;
		this.m_capacity += size;
	}

	public get(index: number) : string | undefined {
		if (index >= 0 && index < this.m_length) {
			return String.fromCharCode(this.m_buffer[index]);
		} else {
			console.error("Index out of bounds");
			return undefined;
		}
	}

	/**
	 @todo Find a way to actually free memory
	*/
	public pop() : string | undefined {
		if (this.m_length === 0) {
			console.error("Cannot pop on an empty array");
			return undefined;
		}

		const returnVal = String.fromCharCode(this.m_buffer[this.m_length - 1]);
		this.m_length--;	// Notice how this doesn't really free the memory pointing to last element in buffer. We have to find a way to fix this.
		return returnVal;
	}

	public getLength() {
		return this.m_length;
	}
}

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
	private text: TextContent; // Uint8Array used here because currently we only support ASCII characters in the editor, 2^8 = 256 so range is 0-256, ASCII goes from 0-127
	private context: CanvasRenderingContext2D | null;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.text = new TextContent();
		this.context = canvas.getContext("2d");
		if (!this.context) {
			console.error("Failed to get 2d context from canvas");
		}

		this.text.add("Hello world");
		console.log(this.text.getString());
	}
}

export default Editor;
