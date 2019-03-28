import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
declare let $rdf;

@Injectable({
  providedIn: 'root'
})
export class SparqlService {
  private sparkqlData = null;
  //private store:any;
  //private fetch:any;
  constructor() {
    //this.store = $rdf.graph();
    }

  printQuery(){


    // let uri = 'https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl';
    // let body = '<a> <b> <c>';
    // let mimeType ='text/turtle';
    let text =`@prefix : <#> .
@prefix ont: <https://schema.org/> .
@prefix c0: <https://mavic96.inrupt.net/profile/card#> .
@prefix c1: <https://adanvetusta.solid.community/profile/card#> .

:msg1553700243657
	 a ont:Message ;
	ont:dateSent "Wed Mar 27 2019 16:24:03 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96: hola adan" ;
	ont:sender "c0:me" ;
	ont:recipient "c1:me" .

:msg1553700252065
	 a ont:Message ;
	ont:dateSent "Wed Mar 27 2019 16:24:12 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96: que tal estas" ;
	ont:sender "c0:me" ;
	ont:recipient "c1:me" .

:msg1553700257828
	 a ont:Message ;
	ont:dateSent "Wed Mar 27 2019 16:24:17 GMT+0100 (hora estándar de Europa central)" ;
	ont:messageAttachment "mavic96:  esta verga funciona" ;
	ont:sender "c0:me" ;
	ont:recipient "c1:me" .
`;
  let query='SELECT ?x WHERE { x? } .';
    let doc = $rdf.sym("https://mavic96.inrupt.net/profile/card");
    let store = $rdf.graph();
    let par = $rdf.parse(text, store, doc.uri, 'text/turtle');
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(store.toNT());
    let prueba= $rdf.serialize(doc, store, doc.uri, 'text/turtle');
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(prueba);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //  console.log($rdf.parse ('<a> <b> <c>', store,'https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl','text/turtle'));
    let quads = store.match(null, null, null, prueba.doc);
    console.log(quads);
    // try {
    // $rdf.parse(body, store, uri, mimeType);
    // } catch(err){
    //   console.log(err);
    // }


    // let store = $rdf.graph();
    // console.log(store);
    // let fetch = new $rdf.fetcher(store);
    // console.log(fetch);
    // fetch.nowOrWhenFetched('https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl'
    // , function(ok, body, xhr){
    //   if(!ok){
    //     console.log("esto casca");
    //     return;
    //   }
    // const QUERY=`PREFIX ont: <https://schema.org/>
    // PREFIX :      <#>
    // PREFIX c:     <https://mavic96.inrupt.net/profile/card#>
    // PREFIX c0:    <https://adanvetusta.solid.community/profile/card#>
    //
    // SELECT ?dateSent ?messageAttachment ?sender ?recipient where {
    // 	?x ont:dateSent ?dateSent;
    //        ont:messageAttachment ?messageAttachment;
    //        ont:sender ?sender;
    //        ont:recipient ?recipient
    // } .`;
    //   let query = $rdf.SPARQLToQuery(QUERY, true, store);
    //
    //   store.fetcher =null;
    //
    //   store.query(query, function(result) {
    //     console.log(result);
    //   });

    // var uri = 'https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl';
    // let q = $rdf.SPARQLToQuery(query, false, this.store);
    //
    // this.store.query(q, function(result){
    //   console.log(result);
    // });

//     let headers: Headers = new Headers({
//       'Content-type' : 'application/x-www-form-urlencoded',
//       'Accept': 'application/json'
//     });
// console.log("LOS HEADERS-->"+ headers)
//     let params = new URLSearchParams();
//     params.append( 'query', this.QUERY );
//     params.append('format', 'json' );
// console.log("LOS PARAMS-->" + params);
//     let options : RequestOptionsArgs ={
//       headers: headers,
//       params: URLSearchParams
//     };
// console.log("LOS OPTIONS-->" + options.toString());
//     this.http.get('https://mavic96.inrupt.net/public/dechat5a/adanvetusta/Conversation.ttl',
//   options).pipe( map(response=> response))
//   .subscribe(data=>{
//     console.log(data);
//     this.sparkqlData=data;
//   });
//   console.log(this.sparkqlData);
   }
}
