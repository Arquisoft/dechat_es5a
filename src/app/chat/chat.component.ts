import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute, Params } from '@angular/router';
import { getBodyNode } from '@angular/animations/browser/src/render/shared';
import { FriendsComponent } from '../friends/friends.component';
import { Friend } from '../models/friend.model';
import { message } from '../models/message.model';
import { TTLPrinter } from '../services/printers/ttlprinter.service';
import {TXTPrinter} from '../services/printers/txtprinter.service'
import { filesCreator } from '../services/creators/filesCreator';



@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {



    fileClient: any;
    ruta_seleccionada: string;
    htmlToAdd: string;
    messages: message[]=[];
    fC:filesCreator;

    /*
     * Constuctor
     */
    constructor(private rdf: RdfService, private rutaActiva: ActivatedRoute) {
        this.rutaActiva.params.subscribe(data => {
            console.log(data['parametro']);
            this.ruta_seleccionada = data['parametro'];
            console.log(this.ruta_seleccionada);
            console.log(typeof this.ruta_seleccionada);
        });
    }

    /*
     * This method synchronize the conversation once the application is launched
     */
    ngOnInit() {

        this.fileClient = require('solid-file-client');
        
        this.fC=new filesCreator(this.rdf.session.webId,this.ruta_seleccionada,this.fileClient,this.messages);
        const name = this.fC.getUserByUrl(this.ruta_seleccionada);
        this.fC.createNewFolder('dechat5a', '/public/');
        this.fC.createNewFolder(name, '/public/dechat5a/');
        this.fC.synchronizeMessages();
        this.messages= this.fC.messages;
        setInterval(() => {
            this.fC.synchronizeMessages();
            this.messages= this.fC.messages;
        }, 3000);
        }


    /*
     * This method creates the different message to show in the chat pane.
     */
    private insertHTMLMessages(){
        let fC=new filesCreator(this.rdf.session.webId,this.ruta_seleccionada,this.fileClient,this.messages);
        this.messages.forEach(message => {
            "<p> " + fC.getUserByUrl(message.sender.webid) + ": " + message.content + "</p>";
        });
    }

    private callFilesCreatorMessage(){
        let fC=new filesCreator(this.rdf.session.webId,this.ruta_seleccionada,this.fileClient,this.messages);
        fC.createNewMessage();
    }
}
