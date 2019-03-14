import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute, Params } from '@angular/router';
import { getBodyNode } from '@angular/animations/browser/src/render/shared';
import { FriendsComponent } from '../friends/friends.component';
import { Friend } from '../models/friend.model';
import { message } from '../models/message.model';



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

    constructor(private rdf: RdfService, private rutaActiva: ActivatedRoute) {
        this.rutaActiva.params.subscribe(data => {
            console.log(data['parametro']);
            this.ruta_seleccionada = data['parametro'];
            console.log(this.ruta_seleccionada);
            console.log(typeof this.ruta_seleccionada);
        });

    }

    ngOnInit() {
        this.fileClient = require('solid-file-client');
        const name = this.getUserByUrl(this.ruta_seleccionada);
        this.createNewFolder('dechat5a', '/public/');
        this.createNewFolder(name, '/public/dechat5a/');
        this.hackingFriendFolder();
        setInterval(() => {
            this.hackingFriendFolder();
        }, 3000);
    }

    private getUserByUrl(ruta: string): string {
        let sinhttp;
        sinhttp = ruta.replace('https://', '');
        const user = sinhttp.split('.')[0];
        return user;

    }

    private createNewFolder(name: string, ruta: string) {
        //Para crear la carpeta necesito una ruta que incluya el nombre de la misma.
        //Obtengo el ID del usuario y sustituyo  lo irrelevante por la ruta de public/NombreCarpeta
        let solidId = this.rdf.session.webId;
        let stringToChange = '/profile/card#me';
        let path = ruta + name;
        solidId = solidId.replace(stringToChange, path);

        //Necesito logearme en el cliente para que me de permiso, sino me dara un error al intentar
        //crear la carpeta. Como ya estoy en sesion no abre nada pero si se abre la consola se ve
        // que se ejecuta correctamente.

        this.buildFolder(solidId);

    }
    //method that creates the folder using the solid-file-client lib
    private buildFolder(solidId) {
        this.fileClient.readFolder(solidId).then(folder => {
            console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        }, err => {
            //Le paso la URL de la carpeta y se crea en el pod. SI ya esta creada no se si la sustituye o no hace nada
            this.fileClient.createFolder(solidId).then(success => {
                console.log(`Created folder ${solidId}.`);
            }, err1 => console.log(err1));

        });
    }

    /**
     * Method to create a file for a message
     * @param solidId url of the folder
     */
    private async createNewFile() {
        let solidId = this.rdf.session.webId;
        let stringToChange = '/profile/card#me';
        let user = this.getUserByUrl(this.ruta_seleccionada);

        let path = '/public/' + user + '/Prueba.ttl';
        solidId = solidId.replace(stringToChange, path);

        let message = await this.readMessage(solidId);

        console.log(message);

        if (message != null) {
            this.updateTTL(solidId, message + "Beep, beep");
        }
        else {
            this.updateTTL(solidId, "@prefix schem: <http://schema.org/>.");

        }

    }

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
        this.hackingFriendFolder();

    }

    private async readMessage(url) {
        var message = await this.searchMessage(url)
        console.log(message);
        return message;
    }

    private order(mess:message[]){
          let ordered:message[]=[];
          let aux= mess;
          while(aux.length>0){
              let idx = this.findMinor(aux);
              ordered.push(aux[idx]);
              aux.splice(idx,1);
          }
          return ordered;
        }

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

    //method that creates a file in a folder using the solid-file-client lib
    private buildFile(solidIdFolderUrl, content) {
        this.fileClient.createFile(solidIdFolderUrl, content, "text/plain").then(fileCreated => {
            console.log(`Created file ${fileCreated}.`);
        }, err => console.log(err));
    }


    //method that search for a message in a pod
    private async searchMessage(url) {
        return await this.fileClient.readFile(url).then(body => {
            console.log(`File	content is : ${body}.`);
            return body;
        }, err => console.log(err));

    }


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


    private async hackingFriendFolder(){


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


    private createChatMessages(){
        this.messages.forEach(message => {
            "<p> " + this.getUserByUrl(message.sender.webid) + ": " + message.content + "</p>";
        });
    }
}


class TTLPrinter {
    public getTTLHeader(messageToSend, sender, recipient) {
        return "@prefix schem: <http://schema.org/>." + "\n" +
            "@prefix mess: <http://schema.org/Message>.\n" +
            "@prefix mess: <http://schema.org/Person>.\n\n" +
            this.getTTLDataFromUser(sender, recipient) + "\n\n" + this.getTTLDataFromMessage(messageToSend)
    }

    public getTTLDataFromMessage(message) {
        return "<#message-" + message.date + ">\n" +
            "\trel: sender <#sender>;\n" +
            "\trel: recipient <#recipient>;\n" +
            "\tdate:" + message.date + ";\n" +
            "\tcontent:" + message.content + ".\n";
    }

    public getTTLDataFromUser(sender, recipient) {
        return "<#sender>\n\twebid: " + sender.webId + ".\n\n" +
            "<#recipient>\n\twebid: " + recipient.webId + "."
    }
}

class TXTPrinter {
    public getTXTDataFromMessage(message) {
        return message.sender.webid + "###" +
            message.recipient.webid + "###" +
            message.content + "###" +
            message.date + "\n";
    }
}
