import {Component, OnInit} from '@angular/core';
import {RdfService} from '../services/rdf.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Friend} from '../models/friend.model';
import {forEach} from '@angular/router/src/utils/collection';
// Declaramos las variables para jQuery
import * as $ from 'jquery';
import {filesCreator} from '../services/creators/filesCreator';
import {message} from '../models/message.model';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    fileClient: any;
    ruta_seleccionada: string;
    messages: message[] = [];
    names: string;
    fC: filesCreator;
    emisor: string;
    friends: Friend[];
    value: Friend[];
    myUser: string;

    /*
     * Constuctor
     */
    constructor(private rdf: RdfService, private rutaActiva: ActivatedRoute) {
    }

    /*
     * This method synchronize the conversation once the application is launched
     */
    ngOnInit() {
        this.loadFriends();
        this.fileClient = require('solid-file-client');
        this.fC = new filesCreator(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        this.myUser = this.getUserByUrl(this.fC.sessionWebId);


    }

    addChat(ruta: string): string {
        $('.messages').animate({'scrollTop': $('#scroll')[0].scrollHeight}, 'fast');
        this.messages = [];
        this.ruta_seleccionada = ruta;
        this.fileClient = require('solid-file-client');
        this.fC = new filesCreator(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        // const name = this.fC.getUserByUrl(this.ruta_seleccionada);
        this.fC.createNewFolder('dechat5a', '/public/');
        this.fC.createNewFolder(name, '/public/dechat5a/');
        this.fC.synchronizeMessages();
        this.messages = this.fC.messages;
        setInterval(() => {
            this.fC.synchronizeMessages();
            this.messages = this.fC.messages;
        }, 3000);
       // this.addMessage(ruta,this.messages);
        this.names = this.getUserByUrl(ruta);
        return ruta;
    }

    addMessage(ruta:string, messages:message[]) {
        if (ruta === (this.ruta_seleccionada)) {
            for (const message of messages) {
                $('#scroll').append('  <ul id="lista" <li>'
                    + '<p class="mscontent">' + message.content + ' <br/> '
                    + this.getDate(message.date) + '</p></li></ul>');
            }
        }
    }
    /*
     * This method obtains the username based on his webID
     */
    private getUserByUrl(ruta: string): string {
        return this.fC.getUserByUrl(ruta);

    }

    /*
   * This method obtains the username based on his webID
   */
    private getDate(ruta: Date): string {
        let cadena = String(ruta).split(' ')[0];
        /*  let cadena1 = String (ruta).split(' ')[1];
          let cadena2 = String (ruta).split(' ')[2];
          let cadena3 = String (ruta).split(' ')[3]; */
        let cadena4 = String(ruta).split(' ')[4];
        return cadena + ' ' + cadena4;
    }

    /*
     * This method creates the different message to show in the chat pane.
     */
    private insertHTMLMessages() {
        const fC = new filesCreator(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        this.messages.forEach(message => {
            '<p> ' + fC.getUserByUrl(message.sender.webid) + ': ' + message.content + '</p>';
        });
    }

    private callFilesCreatorMessage() {
        const fC = new filesCreator(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        fC.createNewMessage();
        const $t = $('#scroll');
        $t.animate({'scrollTop': $('#scroll')[0].scrollHeight}, 'swing');
    }

    async loadFriends() {
        try {
            const list_friends = await this.rdf.getFriends();
            if (list_friends) {
                this.friends = list_friends;
                this.value = list_friends;
            }


        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

}
