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
    , urlOntology:string ='https://schema.org/') :string{
    this.sender = urlSender.replace('me',"");
    this.recipient = urlRecipient.replace('me',"");
    this.ontology = urlOntology;

    return this.writeTTLPrefixes();
  }

  private writeTTLPrefixes() :string{
    let prefixes :string =``;
    //Adding empty prefix
    prefixes+= `@prefix : <#>.\n`;
    //Adding default prefix to Schema.org ontologies.
    prefixes+= `@prefix ont: <${this.ontology}>.\n`;
    //Adding Pod profiles prefixes from SENDER and RECIPIENT
    prefixes+=`@prefix c0: <${this.sender}>.\n`;
    prefixes+=`@prefix c1: <${this.recipient}>.\n\n`;
    return prefixes;
  }

  public writteData(message:Message) {
      return `:msg${message.date.getDate()}
      \ta ont:Message;
      \tont:dateSent "${message.date}";
      \tont:messageAttachment "${message.content}";
      \tont:sender c0:emisor;
      \tont:recipient c1:receptor.`;
  }
}
