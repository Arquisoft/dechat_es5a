import { Friend } from "./friend.model";


export interface message{

    content: string;
    date: Date;
    sender: Friend;
    recipient: Friend;
}