import { Component, OnInit } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute } from '@angular/router';
import { message } from '../models/message.model';
import * as $ from 'jquery';
import { filesCreator } from '../services/creators/filesCreator';
import {Friend} from '../models/friend.model';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    fileClient: any;
    ruta_seleccionada: string;
    messages: message[] = [];
    names: string;
    fC: filesCreator;
    emisor: string;
    friends: Friend[];
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
        }, 3000)

        //JQUERY
        $(function() {
            $('.target').sticky({
                speed: 0 // The scroll animation speed
            });
        });
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

    private callFilesCreatorMessage(){
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
