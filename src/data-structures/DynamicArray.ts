import { ASSERT_ONLY_ASCII_ALLOWED } from "../utility/asserts";

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

	public static isUint8(value: number) : boolean {
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

export default DynamicArray;