import { Component, OnInit } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Friend } from '../models/friend.model';
import { forEach } from '@angular/router/src/utils/collection';
import { FilesCreatorService } from '../services/creators/files-creator.service';
import { Message } from '../models/message.model';
// Declaramos las variables para jQuery
import * as $ from 'jquery';
import { async } from 'q';
import { Observable, from } from 'rxjs';
import { IComunicator } from '../models/IComunicator.model';
import { Group } from '../models/group.model';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

    timer: NodeJS.Timer;
    fileClient: any;
    ruta_seleccionada: string;
    messages: Message[] = [];
    names: string;
    emisor: string;
    friends: IComunicator[];
    groupNames: string[] = [];
    value: Friend[];
    myUser: string;

    /*
     * Constuctor
     */
    constructor(private rdf: RdfService, private fC: FilesCreatorService, private rutaActiva: ActivatedRoute) {
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

    async addChat(ruta: string){
        clearInterval(this.timer);

        this.fC.primera = true;
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
        this.timer = setInterval(() => {
            this.fC.synchronizeMessages();
            this.messages = this.fC.messages;
        }, 1000);

        this.names = this.getUserByUrl(ruta);
    }

    async addGroup(){
        clearInterval(this.timer);

        this.fileClient = require('solid-file-client');
        this.fC.init(this.rdf.session.webId, this.ruta_seleccionada, this.fileClient, this.messages);
        this.emisor = this.rdf.session.webId;
        this.fC.createNewFolder('dechat5a', '/public/');
        let groupName = (document.getElementById("groupName") as HTMLInputElement).value;

        let rand= Math.floor(Math.random() * (100000 - 0 + 1)) + 0;
        groupName= groupName + '@@@' + rand;
        this.fC.createNewFolder(groupName, '/public/dechat5a/');
        this.groupNames.push(groupName);
        this.loadFriends();

        this.fC.syncGroupMessages();
    }



    /*
     * This method obtains the username based on his webID
     */
    public getUserByUrl(ruta: string): string {
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


    public callFilesCreatorMessage() {
        this.fC.createNewMessage();
        const $t = $('#scroll');
        $t.animate({ 'scrollTop': $('#scroll')[0].scrollHeight }, 'swing');
    }


    public async searchFriend() {
        var searchText = (document.getElementById("searchText") as HTMLInputElement).value;
        if (searchText != "") {
            let output: Friend[] = new Array();
            await this.loadFriends();
            let friendsList = this.friends;
            for (var f in friendsList) {
                let friend = friendsList[f];
                let logWeb = friend.webid;
                if (logWeb.includes(searchText)) {
                    output.push(friend);
                }
            }
            this.friends = output;
            this.value = output;
        }
        else {
            this.loadFriends();
        }
    }

    async loadFriends() {
        try {
            const list_friends:IComunicator[] = await this.rdf.getFriends();
            if (list_friends) {
                this.friends = list_friends;
                this.value = list_friends;
                for(var grupo in this.groupNames){
                    this.friends.push({webid: this.groupNames[grupo]});
                }
                return list_friends;
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    ngOnDestroy() {
        clearInterval(this.timer);
    }

}
