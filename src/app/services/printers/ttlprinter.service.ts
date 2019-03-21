

export class TTLWritterService {

    public writeTTLPrefixes( urlSender :string, urlRecipient :string
      , urlOntology:string ='http://schema.org/') :string{
      let message :string =``;
      //Adding empty prefix
      message+= '@prefix : <#>.\n';
      //Adding default prefix to Schema.org ontologies.
      message+= `@prefix: ont: <${urlOntology}>.\n`;
      //Adding Pod profiles prefixes from SENDER and RECIPIENT
      message+=`@prefix: c0: <${urlSender}>.\n`;
      message+=`@prefix: c1:<${urlRecipient}>.\n\n`;
      return message;
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
