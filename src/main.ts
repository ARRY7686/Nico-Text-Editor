import Editor from "./editor";

const editorDOM: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>("#editor");
console.assert(editorDOM instanceof HTMLCanvasElement, "editor must be an HTML Canvas Element");

const main = () => {
	if (!editorDOM) {
		console.error("editor could not be resolved from DOM");
		return;
	}

	let editor = new Editor(editorDOM);
}

main();
