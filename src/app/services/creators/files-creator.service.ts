import { Injectable } from '@angular/core';
import { Friend } from "src/app/models/friend.model";
import { Message } from "src/app/models/message.model";
import { TTLWriterService } from '../printers/ttlwriter.service';
import { SparqlService } from '../query/sparql.service';
import { messagesSorter } from "../sorters/messagesSorter";
import { PushNotificationsService } from '../push.notifications.service';
import * as $ from 'jquery';

@Injectable({
    providedIn: 'root'
})

export class FilesCreatorService {
    sessionWebId: string;
    recipientWebId: string;
    fileClient: any;
    messages: Message[];
    primera: boolean;

    /*
    * Constuctor
    */
    constructor(private ttlwriter: TTLWriterService,
        private notificationService: PushNotificationsService,
        private sparqlService: SparqlService) {
        this.notificationService = new PushNotificationsService();
        this.notificationService.requestPermission();
        this.primera = true;
    }

    ngOnInit() {
        this.synchronizeMessages();
    }
    init(userWebId: string, recipientWebId: string, fileClientP: any, messages: Message[]) {
        this.sessionWebId = userWebId;
        this.recipientWebId = recipientWebId;
        this.fileClient = fileClientP;
        this.messages = messages;
    }


    //method that creates the folder using the solid-file-client lib
    private buildFolder(solidId) {
        console.log(solidId);
        this.fileClient.readFolder(solidId).then(folder => {
            console.log(" ya  creada")
        }, err => {
            //Le paso la URL de la carpeta y se crea en el pod. SI ya esta creada no se si la sustituye o no hace nada
            this.fileClient.createFolder(solidId).then(success => {
                console.log("Se acaba de crear")
            }, err1 => console.log(err1));
        });
    }

/*
 * Create a new folder. The specific route would be /public/dechat5a/ + the name of the partner
 */
    public createNewFolder(name: string, ruta: string) {
        //Para crear la carpeta necesito una ruta que incluya el nombre de la misma.
        //Obtengo el ID del usuario y sustituyo  lo irrelevante por la ruta de public/NombreCarpeta
        let stringToChange = '/profile/card#me';
        let path = ruta + name;
        let solidId = this.sessionWebId;
        console.log("SOLID ID" + solidId);
        console.log(stringToChange);
        console.log(path);
        solidId = solidId.replace(stringToChange, path);
        //Necesito logearme en el cliente para que me de permiso, sino me dara un error al intentar
        //crear la carpeta. Como ya estoy en sesion no abre nada pero si se abre la consola se ve
        // que se ejecuta correctamente.
        this.buildFolder(solidId);
    }

    /*
 * This method obtains the username based on his webID
 */
    public getUserByUrl(ruta: string): string {
        let sinhttp;
        sinhttp = ruta.replace('https://', '');
        const user = sinhttp.split('.')[0];
        return user;

    }


    /*
     * This method obtains different data and creates a new message.
     * It also creates (or updates if its already created) the conversation file.
     */
    public async createNewMessage() {

        //getting message from DOM
        let myUser = this.getUserByUrl(this.sessionWebId);
        let user = this.getUserByUrl(this.recipientWebId);
        var messageContent = (document.getElementById("usermsg") as HTMLInputElement).value;
        (document.getElementById("usermsg") as HTMLInputElement).value = "";

        var messageString= messageContent.replace(/\s/g,'');
        if(messageString!=""){
            //Sender WebID
            let senderId = this.sessionWebId;
            let senderPerson: Friend = { webid: senderId };

            //Receiver WebId
            let recipientPerson: Friend = { webid: this.recipientWebId }

            let messageToSend: Message = { content: messageContent, date: new Date(Date.now()), sender: senderPerson, recipient: recipientPerson }
            this.messages.push(messageToSend);
            let stringToChange = '/profile/card#me';
            let path = '/public/dechat5a/' + user + '/Conversation.ttl';

            senderId = senderId.replace(stringToChange, path);

            let message = await this.readMessage(senderId);

            if (message != null) {
                let content = message + this.ttlwriter.writteData(messageToSend);
                this.updateTTL(senderId, content);
            } else {
                let content = this.ttlwriter.initService(this.sessionWebId, this.recipientWebId);
                content = content + this.ttlwriter.writteData(messageToSend);
                this.updateTTL(senderId, content);
            }

            this.synchronizeMessages();}
    }

    /*
    * This methos updates the TTL file with the new content
    */
    public updateTTL(url, newContent, contentType?) {
        console.log("NEW CONTENT-->" + newContent);
        console.log("ContentTYpe-->" + contentType);
        if (contentType) {
            let newTtl = this.ttlwriter;
            this.fileClient.updateFile(url, newContent, contentType).then(success => {
                console.log(`Updated ${url}.`)
                return true;
            }, (err) => {
                console.log(err);
                return false;
            });
        }
        else {
            this.fileClient.updateFile(url, newContent).then(success => {
                console.log(`Updated ${url}.`)
                return true;
            }, err => {console.log(err);
                return false;
            });
        }
    }

    /*
    * This methos searches for a message in an url
    */
    public async readMessage(url) :Promise<Message> {
        return await this.fileClient.readFile(url).then(body => {
            console.log(`File	content is : ${body}.`);
            return body;
        }, err => {
            console.log(err);
        });
    }

    /*
    * This method gets the url of the connection to synchronize the different messages
    */
    public async synchronizeMessages() {
        this.ttlwriter.initService(this.sessionWebId, this.recipientWebId);
        $("#scroll").animate({ scrollTop: $('#scroll')[0].scrollHeight }, 200);
        var urlArray = this.recipientWebId.split("/");
        let url = "https://" + urlArray[2] + "/public/dechat5a/" + this.getUserByUrl(this.sessionWebId) + "/Conversation.ttl";

        var urlArrayPropio = this.sessionWebId.split("/");
        let urlPropia = "https://" + urlArrayPropio[2] + "/public/dechat5a/" + this.getUserByUrl(this.recipientWebId) + "/Conversation.ttl";

        let messageContent = await this.sparqlService.getMessages(url);

        let messageContentPropia = await this.sparqlService.getMessages(urlPropia);

        let mess = [];
        messageContent.forEach(msg => mess.push(msg));
        messageContentPropia.forEach(msg => mess.push(msg));

        mess = new messagesSorter().order(mess);

        if (mess.length > this.messages.length) {
            for (var i = this.messages.length; i < mess.length; i++) {

                console.log("Entra al bucle");
                console.log("Emisor: "+ mess[i].sender);
                console.log("Receptor: "+ this.recipientWebId);

                if((mess[i].sender === this.recipientWebId && mess[i].recipient === this.sessionWebId) ||
                (mess[i].sender === this.sessionWebId && mess[i].recipient === this.recipientWebId))
                {
                  console.log("entra al if");
                  this.messages.push(mess[i]);

                  if (!this.primera) {
                      let data: Array<any> = [];
                      data.push({
                          'title': 'Nuevo Mensaje de: ' + mess[i].sender,
                          'alertContent': mess[i].content
                      });
                      this.notificationService.generateNotification(data);
                  }
                }

            }

        }
        this.primera = false;
    }
}
