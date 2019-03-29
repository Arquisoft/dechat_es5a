import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Message } from '../../models/message.model';
declare let $rdf;
@Injectable({
  providedIn: 'root'
})
export class SparqlService {
  private sparkqlData = null;
  private fileClient;
  //private store:any;
  //private fetch:any;
  constructor() {
    //this.store = $rdf.graph();
    this.fileClient = require('solid-file-client');
    }

  async printQuery(){


    // let uri = 'https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl';
    // let body = '<a> <b> <c>';
    // let mimeType ='text/turtle';
    let text =`@prefix : <#> .
@prefix ont: <https://schema.org/> .
@prefix c0: <https://mavic96.inrupt.net/profile/card#> .
@prefix c1: <https://adanvetusta.solid.community/profile/card#> .

:msg1553874710330
	 a ont:Message ;
	ont:dateSent "Fri Mar 29 2019 16:51:50 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96: hola adan" ;
	ont:sender c0:me ;
	ont:recipient c1:me .

:msg1553874712955
	 a ont:Message ;
	ont:dateSent "Fri Mar 29 2019 16:51:52 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96: que tal andas" ;
	ont:sender c0:me ;
	ont:recipient c1:me .

:msg1553874716520
	 a ont:Message ;
	ont:dateSent "Fri Mar 29 2019 16:51:56 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96: esta verga tira o que" ;
	ont:sender c0:me ;
	ont:recipient c1:me .

:msg1553874718493
	 a ont:Message ;
	ont:dateSent "Fri Mar 29 2019 16:51:58 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96: soy la hostia" ;
	ont:sender c0:me ;
	ont:recipient c1:me .
`;

  let query='SELECT ?x WHERE { x? } .';
    let doc = $rdf.sym("https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl");
    let store = $rdf.graph();
    let e = await this.searchMessage(doc.uri);
    let par = $rdf.parse(e, store, doc.uri, 'text/turtle');
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(store.toNT());
    let prueba= $rdf.serialize(doc, store, doc.uri, 'text/turtle');
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(prueba);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //  console.log($rdf.parse ('<a> <b> <c>', store,'https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl','text/turtle'));
    let quads = store.match(null, null, null, doc);
    let messages:Message[] = [];
    let i;
    for (i=0; i<quads.length; i+=5){
      console.log(quads[i]);
      messages.push(this.getMessage(quads, i));

      console.log(i+'/'+quads.length);
    }
    console.log(messages);
   }


   getMessage(quads:any[], idx:number):Message{
     return {
       date: this.getValue(quads[idx+1]),
       content: this.getValue(quads[idx+2]),
       sender: this.getValue(quads[idx+3]),
       recipient: this.getValue(quads[idx+4])
     }
   }

   getValue(elem:any) :any{
     return elem.object.value;
   }

   private async searchMessage(url) {
       return await this.fileClient.readFile(url).then(body => {
           console.log(`File	content is : ${body}.`);
           return body;
       }, err => console.log(err));

   }
}
