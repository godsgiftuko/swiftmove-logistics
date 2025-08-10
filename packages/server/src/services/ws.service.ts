/* eslint-disable @typescript-eslint/no-explicit-any */
import { EWSEvents } from "../../../shared/enums/ws";
import { io } from "../server";

export default class WebsocketService{
    // Emit an event
    static emitEvent(event: keyof typeof EWSEvents, data: any) {
        io.emit(event, data);
    }
}