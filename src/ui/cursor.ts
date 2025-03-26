import { Pos2D } from "../utility/utility";

export class Cursor {
    private position: Pos2D;

    constructor(position: Pos2D) {
        this.position = position;
    }

    public setPosition(position: Pos2D) {
        this.position = position;
    }

    public getPosition() {
        return this.position;
    }
}