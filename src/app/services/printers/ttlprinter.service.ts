

export class TTLPrinter {
    public getTTLHeader(messageToSend, sender, recipient) {
        return "@prefix schem: <http://schema.org/>." + "\n" +
            "@prefix mess: <http://schema.org/Message>.\n" +
            "@prefix mess: <http://schema.org/Person>.\n\n" +
            this.getTTLDataFromUser(sender, recipient) + "\n\n" + this.getTTLDataFromMessage(messageToSend)
    }

    public getTTLDataFromMessage(message) {
        return "<#message-" + message.date + ">\n" +
            "\trel: sender <#sender>;\n" +
            "\trel: recipient <#recipient>;\n" +
            "\tdate:" + message.date + ";\n" +
            "\tcontent:" + message.content + ".\n";
    }

    public getTTLDataFromUser(sender, recipient) {
        return "<#sender>\n\twebid: " + sender.webId + ".\n\n" +
            "<#recipient>\n\twebid: " + recipient.webId + "."
    }
}