import { Injectable } from '@angular/core';
import {Message} from '../../models/message.model';
@Injectable({
  providedIn: 'root'
})
export class TTLWriterService {

  private sender:string;
  private recipient:string;
  private ontology:string;

  constructor() { }

  public initService(urlSender :string, urlRecipient :string
    , urlOntology:string ='http://schema.org/') :string{
    this.sender = urlSender;
    this.recipient = urlRecipient;
    this.ontology = urlOntology;

    return this.writeTTLPrefixes();
  }

  private writeTTLPrefixes() :string{
    let prefixes :string =``;
    //Adding empty prefix
    prefixes+= `@prefix : <#>.\n`;
    //Adding default prefix to Schema.org ontologies.
    prefixes+= `@prefix: ont: <${this.ontology}>.\n`;
    //Adding Pod profiles prefixes from SENDER and RECIPIENT
    prefixes+=`@prefix: c0: <${this.sender}>.\n`;
    prefixes+=`@prefix: c1:<${this.recipient}>.\n\n`;
    return prefixes;
  }

  public getTTLDataFromMessage(message:Message) {
      message.content
      return `:msg${message.date.getDate()}\n
      \ta ont:Message;\n
      \tont:dateSent "${message.date}";\n
      \tont:messageAttachment "${message.content}";\n
      \tont:sender c:${message.sender};\n
      \tont:recipient c0:${message.recipient}.\n\n`;
  }
}
