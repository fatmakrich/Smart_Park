export default class Events {
    constructor(context) {
        this.context = context;
        this.events = {};
    }

    on(event, handler) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(handler);
    }

    trigger(event, detail) {
        if (this.events[event]) {
            this.events[event].forEach(handler => handler({ detail }));
        }
    }
}
