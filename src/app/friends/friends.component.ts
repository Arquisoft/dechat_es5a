import {Component, OnInit} from '@angular/core';
import {RdfService} from '../services/rdf.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Friend} from '../models/friend.model';
import {forEach} from '@angular/router/src/utils/collection';import { FilesCreatorService } from '../services/creators/files-creator.service';
import {Message} from '../models/message.model';
// Declaramos las variables para jQuery
import * as $ from 'jquery';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    fileClient: any;
    ruta_seleccionada: string;
    messages: Message[] = [];
    names: string;
    emisor: string;
    friends: Friend[];
    value: Friend[];
    myUser: string;

    /*
     * Constuctor
     */
    constructor(private rdf: RdfService, private fC:FilesCreatorService, private rutaActiva: ActivatedRoute) {
    }

    /*
     * This method synchronize the conversation once the application is launched
     */
    ngOnInit() {
        this.loadFriends();
        this.fileClient = require('solid-file-client');
        this.fC.init(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        this.myUser = this.getUserByUrl(this.fC.sessionWebId);



    }

    addChat(ruta: string): string {

        this.messages = [];
        this.ruta_seleccionada = ruta;
        this.fileClient = require('solid-file-client');
        this.fC.init(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        this.emisor = this.rdf.session.webId;
        this.fC.createNewFolder('dechat5a', '/public/');
        let name = this.getUserByUrl(ruta);
        this.fC.createNewFolder(name, '/public/dechat5a/');
        this.fC.synchronizeMessages();
        this.messages = this.fC.messages;
        setInterval(() => {
            this.fC.synchronizeMessages();
            this.messages = this.fC.messages;
        }, 3000);

        this.names = this.getUserByUrl(ruta);
        return ruta;
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


    private callFilesCreatorMessage() {
        this.fC.createNewMessage();
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
