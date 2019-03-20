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
        const name = this.getUserByUrl(this.ruta_seleccionada);
        new filesCreator().createNewFolder('dechat5a', '/public/',this.rdf.session.webId,this.fileClient);
        new filesCreator().createNewFolder(name, '/public/dechat5a/',this.rdf.session.webId,this.fileClient);
        this.synchronizeMessages();
        setInterval(() => {
            this.synchronizeMessages();
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
     * This method obtains different data and creates a new message. 
     * It also creates (or updates if its already created) the conversation file.
     */
    private async createNewMessage() {

        //getting message from DOM
        let myUser= this.getUserByUrl(this.rdf.session.webId);
        let user = this.getUserByUrl(this.ruta_seleccionada);
        var messageContent = myUser + ': ' + ((document.getElementById("usermsg") as HTMLInputElement).value);
        (document.getElementById("usermsg") as HTMLInputElement).value="";
        console.log(messageContent);
        //Sender WebID
        let senderId = this.rdf.session.webId;
        let senderPerson: Friend = { webid: senderId };

        //Receiver WebId
        let recipientPerson: Friend = { webid: this.ruta_seleccionada }

        let messageToSend: message = { content: messageContent, date: new Date(Date.now()), sender: senderPerson, recipient: recipientPerson }
        let stringToChange = '/profile/card#me';
        let path = '/public/dechat5a/' + user + '/Conversation.txt';

        senderId = senderId.replace(stringToChange, path);

        let message = await this.readMessage(senderId);

        console.log(message);

        //For TXTPrinter
        if (message != null) {
            this.updateTTL(senderId, message + "\n" + new TXTPrinter().getTXTDataFromMessage(messageToSend));
        }
        else {
            this.updateTTL(senderId, new TXTPrinter().getTXTDataFromMessage(messageToSend));
        }

        /*
        //For TTLPrinter
        if (message!= null) {
            this.updateTTL(senderId, message + "\n\n" + new TTLPrinter().getTTLDataFromMessage(messageToSend));
        }
        else {
            this.updateTTL(senderId, new TTLPrinter().getTTLHeader(messageToSend,senderId,this.ruta_seleccionada));
        }
        */
        this.synchronizeMessages();

    }

    /*
     * This methos searches for a message in an url
     */
    private async readMessage(url) {
        var message = await this.searchMessage(url)
        console.log(message);
        return message;
    }

    /*
     * Sorted methos that sorts the message array
     */
     private order( mess : message[] )
     {
        return mess.sort(function(a, b) {
             let date1 =a.date;
             let date2 = b.date;
             return date2>date1 ? -1 : date2<date1 ? 1 : 0;
         });
     }


    /*
     * This is a sorting method that obtains the minor message
     */
    private findMinor(aux:message[]){
          let idx=0
          let minor:message = aux[idx];
          for(let i=0; i<aux.length; i++){
            if(aux[i].date< minor.date){
              idx=i;
              minor= aux[idx];
            }
          }
          return idx;
        }

    /*
     * This method creates a file in a folder using the solid-file-client lib
     */
    private buildFile(solidIdFolderUrl, content) {
        this.fileClient.createFile(solidIdFolderUrl, content, "text/plain").then(fileCreated => {
            console.log(`Created file ${fileCreated}.`);
        }, err => console.log(err));
    }


    /*
     * This method search for a message in a pod
     */
    private async searchMessage(url) {
        return await this.fileClient.readFile(url).then(body => {
            console.log(`File	content is : ${body}.`);
            return body;
        }, err => console.log(err));

    }

    /*
     * This methos updates the TTL file with the new content
     */
    private updateTTL(url, newContent, contentType?) {
        if (contentType) {
            this.fileClient.updateFile(url, newContent, contentType).then(success => {
                console.log(`Updated ${url}.`)
            }, err => console.log(err));
        }
        else {
            this.fileClient.updateFile(url, newContent).then(success => {
                console.log(`Updated ${url}.`)
            }, err => console.log(err));
        }
    }

    /*
     * This method gets the url of the connection to synchronize the different messages
     */
    private async synchronizeMessages(){


        var urlArray = this.ruta_seleccionada.split("/");
        let url= "https://" + urlArray[2] + "/public/dechat5a/" +this.getUserByUrl(this.rdf.session.webId) + "/Conversation.txt";

        var urlArrayPropio = this.rdf.session.webId.split("/");
        let urlPropia = "https://" + urlArrayPropio[2] + "/public/dechat5a/" +this.getUserByUrl(this.ruta_seleccionada) + "/Conversation.txt";
        console.log("URL PROPIA: "+ urlPropia);
        console.log(url);
        let messageContent = await this.searchMessage(url);
        console.log("MessageContent " + messageContent);
        let messageArray = [] ;
        if(messageContent != undefined)
        {
            messageArray = messageContent.split("\n");
        }
        let messageContentPropia = await  this.searchMessage(urlPropia);
        let messageArrayPropio = [] ;
        if(messageContentPropia != undefined)
        {
            messageArrayPropio = messageContentPropia.split("\n");
        }

        this.messages = [];
        messageArray.forEach(element => {
            console.log(element.content)
            if(element[0]){
             let messageArrayContent = element.split("###");
             let messageToAdd:message = { content: messageArrayContent[2], date: messageArrayContent[3],sender: messageArrayContent[0], recipient: messageArrayContent[1]};
                console.log(messageToAdd);
             this.messages.push(messageToAdd);
            }

        });
        messageArrayPropio.forEach(element => {
            console.log(element.content)
            if(element[0]){
                let messageArrayContent = element.split("###");
                let messageToAdd:message = { content: messageArrayContent[2], date: messageArrayContent[3],sender: messageArrayContent[0], recipient: messageArrayContent[1]};
                console.log(messageToAdd);
                this.messages.push(messageToAdd);
            }

        });

        let ordered = this.order(this.messages);
        this.messages=ordered;
    }


    /*
     * This method creates the different message to show in the chat pane.
     */
    private createChatMessages(){
        this.messages.forEach(message => {
            "<p> " + this.getUserByUrl(message.sender.webid) + ": " + message.content + "</p>";
        });
    }
}
