import { Injectable } from '@angular/core';
import {Message} from '../../models/message.model';
import {TTLWriterUtil} from '../utils/ttlWriterUtil'

@Injectable({
  providedIn: 'root'
})
export class TTLWriterService {

  private sender:string;
  private recipient:string;
  private ontology:string;

  constructor(private writer:TTLWriterUtil) { }

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
    prefixes+= this.writer.writePrefix(':', '#');
    //Adding default prefix to Schema.org ontologies.
    prefixes+=  this.writer.writePrefix('ont:', this.ontology);
    //Adding Pod profiles prefixes from SENDER and RECIPIENT
    prefixes+= this.writer.writePrefix('c0:',this.sender);
    prefixes+= this.writer.writePrefix('c1:', this.recipient);
    return prefixes;
  }

  public writteData(message:Message) {
      return this.writer.writeName("msg"+ message.date.getTime())
       + this.writer.writeType('ont','Message')
       + this.writer.writeProperty('ont','dateSent', String(message.date))+";\n"
       + this.writer.writeProperty('ont', 'messageAttachment', message.content)+";\n"
       + this.writer.writeProperty ('ont','sender', 'c0:emisor') +";\n"
 + this.writer.writeProperty ('ont','sender', 'c1:receptor') +".\n"
      // return `:msg${message.date.getTime()}
      // \ta ont:Message;
      // \tont:dateSent "${message.date}";
      // \tont:messageAttachment "${message.content}";
      // \tont:sender c0:emisor;
      // \tont:recipient c1:receptor.`;
  }
}
