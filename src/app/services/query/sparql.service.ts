import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Message } from '../../models/message.model';
declare let $rdf;
@Injectable({
  providedIn: 'root'
})
export class SparqlService {

  private fileClient;

  constructor() {
    this.fileClient = require('solid-file-client');
    }

  async getMessages( url :string ){
    let messages:Message[] = [];
    try{
      let doc = $rdf.sym(url);
      let store = $rdf.graph();
      let e=  await this.searchMessage(doc.value);
      let par = $rdf.parse(e, store, doc.uri, 'text/turtle');
      let quads = store.match(null, null, null, doc);
      let i;
      for (i=0; i<quads.length; i+=5){
        messages.push(this.getMessage(quads, i));
      }
    }catch (err){
      console.log("No debe haber nada en la uri-->" + url);
      console.log("ERROR TYPE: "+err)
    }
    return messages;
   }


  private  getMessage(quads:any[], idx:number):Message{
     return {
       date: this.getValue(quads[idx+1]),
       content: this.getValue(quads[idx+2]),
       sender: this.getValue(quads[idx+3]),
       recipient: this.getValue(quads[idx+4])
     }
   }

   private getValue(elem:any) :any{
     return elem.object.value;
   }

   private async searchMessage(url) {
       return await this.fileClient.readFile(url).then(body => body
         , err => {
           console.log("ERROR: " + err)
         return []
       });

   }
}
