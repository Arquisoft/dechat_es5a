export class TXTPrinter {
    public getTXTDataFromMessage(message) {
      console.log(message);
        return message.sender.webid + "###" +
            message.recipient.webid + "###" +
            message.content + "###" +
            message.date + "\n";
    }
}
