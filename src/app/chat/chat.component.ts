import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Friend } from '../models/friend.model';
import { message } from '../models/message.model';
import {TXTPrinter} from '../services/printers/txtprinter.service';
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
    messages: message[] = [];
    names: string;
    fC: filesCreator;
    emisor: string;
    /*
     * Constuctor
     */
    constructor(private rdf: RdfService, private rutaActiva: ActivatedRoute) {
        this.rutaActiva.params.subscribe(data => {
            this.ruta_seleccionada = data['parametro'];
        });
        this.names = this.getUserByUrl(this.ruta_seleccionada);
        this.emisor = this.rdf.session.webId;
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
     * This method obtains the username based on his webID
     */
    private getUserByUrl(ruta: string): string {
        let sinhttp;
        sinhttp = ruta.replace('https://', '');
        const user = sinhttp.split('.')[0];
        return user;

    }
    /*
     * This method creates the different message to show in the chat pane.
     */
    private insertHTMLMessages(){
        let fC=new filesCreator(this.rdf.session.webId,this.ruta_seleccionada,this.fileClient,this.messages);
        this.messages.forEach(message => {
            '<p> ' + fC.getUserByUrl(message.sender.webid) + ': ' + message.content + '</p>';

        });


    }

    public callFilesCreatorMessage(){

        let fC=new filesCreator(this.rdf.session.webId,this.ruta_seleccionada,this.fileClient,this.messages);
        fC.createNewMessage();
    }
}
