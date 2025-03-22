import Editor from "./editor";
import Font from "./ui/font";

const editorDOM: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>("#editor");
console.assert(editorDOM instanceof HTMLCanvasElement, "editor must be an HTML Canvas Element");

const main = () => {
	if (!editorDOM) {
		console.error("editor could not be resolved from DOM");
		return;
	}

	const font: Font = new Font();
	let editor = new Editor(editorDOM, {width: 600, height: 400});
	editor.setFont(font);
}

main();
