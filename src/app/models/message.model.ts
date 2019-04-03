import { Friend } from "./friend.model";

export class Message{

    content: string;
    date: Date;
    sender: Friend;
    recipient: Friend;
}
