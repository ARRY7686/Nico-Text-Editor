export enum EventType {
	MouseClick,
	KeyPress,
	MouseSelection,
	None,
}

type AllowedEvent = KeyboardEvent | MouseEvent;

class Event {
	public type: EventType = EventType.None;
    public data: AllowedEvent;
    constructor(type: EventType, data: AllowedEvent) {
        this.type = type;
        this.data = data;
    }
}

export default Event;