/*
	Some Important Considerations:-
		=> Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

class Editor {
	private canvas: HTMLCanvasElement;
	private text: Array<Uint8Array>; // Uint8Array used here because currently we only support ASCII characters in the editor, 2^8 = 256 so range is 0-256, ASCII goes from 0-127

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.text = new Array<Uint8Array>();
	}

}

export default Editor;
