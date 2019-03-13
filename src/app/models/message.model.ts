import { Friend } from "./friend.model";
import { Content } from "@angular/compiler/src/render3/r3_ast";


class message{

    content: string;
    date: Date;
    sender: Friend;
    recipient: Friend;

    /**
     * To String
     */
    public getTTLData() {
       return "<#message-" + Date.toString + ">\n\t" + 
        "rel: sender <#sender>;\n" +
        "rel: recipient <#recipient>;\n" + 
        "date:" + Date.toString  + ";\n" + 
        "content:" + Content + ".\n";
    }
    
}