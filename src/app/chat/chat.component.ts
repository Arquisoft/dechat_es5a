import { Component, OnInit } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute, Params } from '@angular/router';
import { getBodyNode } from '@angular/animations/browser/src/render/shared';
import { FriendsComponent } from '../friends/friends.component';
import { Friend } from '../models/friend.model';
import { Message } from '../models/message.model';
import { TTLWriterService } from '../services/printers/ttlwriter.service';
import { SparqlService } from '../services/query/sparql.service';
import {TXTPrinter} from '../services/printers/txtprinter.service'
import * as $ from 'jquery';
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
    messages: Message[]=[];
    names: string;
    fC: filesCreator;
    emisor: string;
    friends: Friend[];
    /*
     * Constuctor
     */
    constructor(private rdf: RdfService, private rutaActiva: ActivatedRoute,
    private ttlwriter:TTLWriterService, private queryService:SparqlService) {
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
        this.loadFriends();
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
        }, 1500)
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

    public callFilesCreatorMessage() {

        let fC=new filesCreator(this.rdf.session.webId,this.ruta_seleccionada,this.fileClient,this.messages);
        fC.createNewMessage();
        var $t = $('#scroll');
        $t.animate({"scrollTop": $('#scroll')[0].scrollHeight}, "swing");
    }

    async loadFriends() {
        try {
            const list_friends = await this.rdf.getFriends();
            if (list_friends) {
                this.friends = list_friends;
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

}
