import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TTLWriterUtil {

    writePrefix:Function =(name:string, url:string) :string=>
       `@prefix ${name} <${url}> .\n`;

    writeProperty=(ontology:string, property:string, value:string)=>
    `\t${ontology}:${property} "${value}"`;

    writeType=(ontology:string, type:string)=>
    `\t a ${ontology}:${type} ;\n`

    writeName=(name:string)=>
    `\n:${name}\n`
}
