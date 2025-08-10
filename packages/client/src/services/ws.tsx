/* eslint-disable @typescript-eslint/no-explicit-any */
import { io } from "socket.io-client";
import { IUser } from "../../../shared/interfaces";
import { API } from "../../../shared/constants";
import { EWSEvents } from "../../../shared/enums/ws";

export const socket = io(API.BASE_URL, {

});

export default class Websocket{

    // Connect user
    static connect(user: IUser) {
        if (!socket.connected) {
            socket.connect();
            socket.emit('', user);
        }
    }

    // Disconnect socket
    static disconnect() {
        if (socket.connected) {
            socket.disconnect();
        }
    }

    // Listen to specific event
    static onEvent(event: keyof typeof EWSEvents, callback: (...args: any[]) => void) {
        if (socket.connected) {
            socket.on(event, callback);
        }
    }

    // Stop listening to specific event
    static offEvent(event: EWSEvents, callback: (...args: any[]) => void) {
        if (socket.connected) {
            socket.off(event, callback);
        }
    }

    // Emit an event
    static emitEvent(event: EWSEvents, data: any) {
        if (socket.connected) {
            socket.emit(event, data);
        }
    }
}