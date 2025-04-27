/*
  Some Important Considerations:-
    => Beware of accidently creating sparse arrays, they aren't stored as actual arrays sometimes. Sometimes they are stored as a hash table. If this happens then gap buffers are essentially useless. See https://medium.com/@kevinzifancheng/how-are-arrays-implemented-in-javascript-be925a7c8021
*/

import DynamicArray from "./data-structures/DynamicArray";
import Event, { EventType } from "./core/event";
import Font from "./ui/font";
import { Size2D, CanvasType, isPrintableCharacter } from "./utility/utility";
import { TextCanvas } from "./core/TextCanvas";

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
  //   private textCanvasContext: CanvasRenderingContext2D;
  private textCanvas: TextCanvas;
  private mainCanvas: HTMLCanvasElement;
  private mainCanvasContext: CanvasRenderingContext2D;
  private scale: number = window.devicePixelRatio;
  private containerDiv: HTMLDivElement;

  private createCanvas(type: CanvasType) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.zIndex = String(type);
    this.containerDiv.appendChild(canvas);
    return canvas;
  }

  constructor(containerDiv: HTMLDivElement, size: Size2D) {
    this.containerDiv = containerDiv;
    this.containerDiv.tabIndex = 1;
    this.containerDiv.style.width = `${size.width}px`;
    this.containerDiv.style.height = `${size.height}px`;
    this.containerDiv.focus();
    this.text = new TextContent();

    this.mainCanvas = this.createCanvas(CanvasType.MainCanvas);
    this.mainCanvasContext = this.mainCanvas.getContext("2d")!;

    this.mainCanvas.width = Math.floor(size.width * this.scale);
    this.mainCanvas.height = Math.floor(size.height * this.scale);
    // this.mainCanvas.width = size.width;
    // this.mainCanvas.height = size.height;

    const _canvas = this.createCanvas(CanvasType.TextCanvas);
    this.textCanvas = new TextCanvas(_canvas, size);
    this.textCanvas.setBackground();
    // this.textCanvasContext = this.textCanvas.getContext();

    this.text.add(Editor.defaultText);
    this.attachEventListeners();
    this.setFont(this.font);

    this.setBackground();
  }

  public setBackground(fillColor = "black") {
    this.mainCanvasContext.fillStyle = fillColor;
    this.mainCanvasContext.fillRect(
      0,
      0,
      this.mainCanvas.width,
      this.mainCanvas.height
    );
  }

  private attachEventListeners() {
    this.containerDiv.addEventListener("keypress", (e) => {
      e.preventDefault();
      const event = new Event(EventType.KeyPress, e);
      this.textCanvas.handleEvent(event);
    });
    this.containerDiv.addEventListener("keydown", (e) => {
      e.preventDefault();
      const event = new Event(EventType.KeyPress, e);
      this.textCanvas.handleEvent(event);
    });
    this.containerDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const event = new Event(EventType.MouseClick, e);
      this.textCanvas.handleEvent(event);
    });
  }

  public setFont(font: Font) {
    this.textCanvas.setFont(font);
  }
}

export default Editor;
