import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Friend } from "src/app/models/friend.model";
import { Message } from "src/app/models/message.model";
import { TXTPrinter } from "../printers/txtprinter.service";
import { TTLWriterService } from '../printers/ttlwriter.service';
import { SparqlService } from '../query/sparql.service';
import { messagesSorter } from "../sorters/messagesSorter";
import { PushNotificationsService } from '../push.notifications.service';
import * as $ from 'jquery';
import { Observable, of } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { read } from 'fs';

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
                this.groupACL(solidId);

                console.log("Se acaba de crear")
            }, err1 => console.log(err1));
        });
    }

    /*
     * Creates a .acl for the file in the path.
     * This file is only for the owner
     * path must have the / at the end of the folder
     * @param path:string the file for the .acl
     * @param user:string the /profile/card#me of the user owner of the folder
     */
    private createOwnerACL(path: string, user: string) {
        let file = path + '.acl';
        let contenido = '@prefix  acl:  <http://www.w3.org/ns/auth/acl#>  .\n' +
            '<#owner>\n' +
            'a             acl:Authorization;\n' +
            'acl:agent     <' + this.sessionWebId + '>;\n' +
            'acl:accessTo  <' + path + '>;\n' +
            'acl:defaultForNew <./>;' +
            'acl:mode\n      acl:Read,\n' +
            'acl:Write,\n' +
            'acl:Control.'

        this.fileClient.updateFile(file, contenido).then(success => {
            console.log(`Created acl owner ${file}.`)
        }, err => console.log(err));
    }

    /*
     * Creates a .acl for the file in the path.
     * This file made for the owner and one reader
     * Used in p2p chats
     * path must have the / at the end of the folder
     * @param path:string the file for the .acl
     * @param owner:string the /profile/card#me of the user owner of the folder
     * @param reader:string the /profile/card#me of the reader of the folder
     */
    public createReadForOneACL(path: string, owner: string, reader: string) {
        let file = path + '.acl';
        let contenido = '@prefix  acl:  <http://www.w3.org/ns/auth/acl#>  .' +
            '<#owner>\n' +
            'a             acl:Authorization;\n' +
            'acl:agent     <' + owner + '>;\n' +
            'acl:accessTo  <' + path + '>;\n' +
            'acl:defaultForNew <./>;' +
            'acl:mode\n      acl:Read,\n' +
            'acl:Write,\n' +
            'acl:Control.\n' +

            '<#reader>\n' +
            'a             acl:Authorization;\n' +
            'acl:agent     <' + reader + '>;\n' +
            'acl:accessTo  <' + path + '>;\n' +
            'acl:defaultForNew <./>;\n' +
            'acl:mode\n      acl:Read.'

        this.fileClient.updateFile(file, contenido).then(success => {
            console.log(`Created acl one reader ${file}.`)
        }, err => console.log(err));
    }



    /*
     * Creates a .acl for the file in the path.
     * This file made for the owner and many readers
     * Used in p2p chats
     * path must have the / at the end of the folder
     * @param path:string the file for the .acl
     * @param owner:string the /profile/card#me of the user owner of the folder
     * @param readers:string[] the /profile/card#me of the readers of the folder
     */
    public createReadForManyACL(path: string, owner: string, readers: string[]) {
        let file = path + '.acl';
        let contenido = '@prefix  acl:  <http://www.w3.org/ns/auth/acl#>  .\n' +
            '<#owner>\n' +
            'a             acl:Authorization;\n' +
            'acl:agent     <' + owner + '>\n' +
            'acl:accessTo  <' + path + '>\n' +
            'acl:defaultForNew <./>;\n' +
            'acl:mode      acl:Read,\n' +
            'acl:Write,\n' +
            'acl:Control.\n' +

            '<#readers>\n' +
            'a               acl:Authorization;\n' +
            'acl:accessTo    <' + path + '>\n' +
            'acl:defaultForNew <./>;\n' +
            'acl:mode        acl:Read;\n'

        readers.forEach(function (e, idx, array) {
            if (idx === array.length - 1) {
                contenido = contenido + 'acl:agent  <' + e + '>.'
            } else {
                contenido = contenido + 'acl:agent  <' + e + '>;\n'
            }
        })
        this.fileClient.updateFile(file, contenido).then(success => {
            console.log(`Created acl many readers ${file}.`)
        }, err => console.log(err));
    }
    /*
     * Returns a string with all the readers of a acl, divided by '|'
     * @param path:string the file or folder to look the readers
     * In TODO
     */
    public getReaders(path: string): string {
        let file;
        let list;
        this.fileClient.readFile(path + '.acl').then(body => {
            file = body;
            console.log(`File content is : ${body}.`);
        }, err => console.log(err));


        return list;
    }


    public groupACL(path:string,  ){
        let file = path;
        let contenido =
            `@prefix  : <#>.
             @prefix  n0: <http://www.w3.org/ns/auth/acl#>.
             @prefix Prueb: <./>.
             @prefix c: </profile/card#>.
             @prefix n1: <http://xmlns.com/foaf/0.1/>.

             :ControlReadWrite
             \t a n0:Authorization;
             \t n0:accessTo Prueb:;
             \t n0:agent c:me;
             \t n0:agentClass n1:Agent;
             \t n0:defaultForNew Prueb:;
             \t n0:mode n0:Control, n0:Read, n0:Write.
             :ReadWrite
             \t a n0:Authorization;
             \t n0:accessTo Prueb:;
             \t n0:defaultForNew Prueb:;
             \t n0:mode n0:Read, n0:Write.`

            console.log("Ruta acl" + file + "/.acl");
        this.fileClient.createFile(file + "/.acl", contenido).then(success => {
           console.log(` ESTA MIERDA FUNCIONA ()Created acl one reader ${file}.`)
        }, err => console.log("JODER, ALGO CASCO"+err));
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
        let array = sinhttp.split('@@@');
        if (array[1]) {
            return sinhttp;
        }
        const user = sinhttp.split('.')[0];
        return user;

    }


    /*
     * This method obtains different data and creates a new message.
     * It also creates (or updates if its already created) the conversation file.
     */
    public async createNewMessage() {

        var chatName = this.recipientWebId;
        if (!chatName.includes("@@@")) {
            //getting message from DOM
            let myUser = this.getUserByUrl(this.sessionWebId);
            let user = this.getUserByUrl(this.recipientWebId);
            var messageContent = (document.getElementById("usermsg") as HTMLInputElement).value;
            (document.getElementById("usermsg") as HTMLInputElement).value = "";

            var messageString = messageContent.replace(/\s/g, '');
            if (messageString != "") {
                //Sender WebID
                let senderId = this.sessionWebId;
                let senderPerson: Friend = { webid: senderId };

                //Receiver WebId
                let recipientPerson: Friend = { webid: this.recipientWebId }

                let messageToSend: Message = { content: messageContent, date: new Date(Date.now()), sender: senderPerson, recipient: recipientPerson }
                this.messages.push(messageToSend);
                let stringToChange = '/profile/card#me';
                let path = '/public/dechat5a/' + user + '/Conversation.ttl';
                console.log('PATH AQUIII: ' + path)
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

                this.synchronizeMessages();
            }
        }
        else {
            //this is URL from group creator file in his pod
            var readURL = chatName.split("@@@")[2].replace("profile/card#me","") + "/public/dechat5a/" + chatName + "/Conversation.ttl";
            if(!readURL.includes("https://")){ 
                readURL = "https://" +  readURL;
            }

            var messageContent = (document.getElementById("usermsg") as HTMLInputElement).value;
            messageContent = this.getUserByUrl(this.sessionWebId) + ': ' + messageContent;
            (document.getElementById("usermsg") as HTMLInputElement).value = "";

            var messageString = messageContent.replace(/\s/g, '');
            if (messageString != "") {
                //Sender WebID
                let senderId = this.sessionWebId;
                let senderPerson: Friend = { webid: senderId };

                //Receiver WebId
                let recipientPerson: Group = { webid: chatName }

                let messageToSend: Message = { content: messageContent, date: new Date(Date.now()), sender: senderPerson, recipient: recipientPerson }
                this.messages.push(messageToSend);

                let message = await this.readMessage(readURL);

                if (message != null) {
                    let content = message + this.ttlwriter.writteData(messageToSend);
                    this.updateTTL(readURL, content);
                } else {
                    let content = this.ttlwriter.initService(this.sessionWebId, this.recipientWebId);
                    content = content + this.ttlwriter.writteData(messageToSend);
                    this.updateTTL(readURL, content);
                }
                console.log("ESTO ES FILESCREATOR-- CREATENEW MESSAGEL!");
                this.syncGroupMessages(chatName);

            }
        }
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
            }, err => {
                console.log(err);
                return false;
            });
        }
    }

    /*
    * This methos searches for a message in an url
    */
    public async readMessage(url): Promise<Message> {
        return await this.fileClient.readFile(url).then(body => {
            console.log(`File	content is : ${body}.`);
            return body;
        }, err => {
            console.log(err);
        });
    }

    /*
 * This method creates a file in a folder using the solid-file-client lib
 */
    private buildFile(solidIdFolderUrl, content) {
        this.fileClient.createFile(solidIdFolderUrl, content, "text/plain").then(fileCreated => {

        }, err => console.log(err));
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

        console.log("URLREMOTA: " + url)
        console.log("MIURL: " + urlPropia)
        let messageContent = await this.sparqlService.getMessages(url);
        // if(messageContent != undefined)
        // {
        //     messageArray = messageContent.split("\n");
        // }
        let messageContentPropia = await this.sparqlService.getMessages(urlPropia);
        // if(messageContentPropia != undefined)
        // {
        //     messageArrayPropio = messageContentPropia.split("\n");
        // }
        let mess = [];
        messageContent.forEach(msg => mess.push(msg));
        messageContentPropia.forEach(msg => mess.push(msg));

        mess = new messagesSorter().order(mess);

        if (mess.length > this.messages.length) {
            for (var i = this.messages.length; i < mess.length; i++) {

                console.log("Entra al bucle");
                console.log("Emisor: " + mess[i].sender);
                console.log("Receptor: " + this.recipientWebId);

                /*
                if ((mess[i].sender === this.recipientWebId && mess[i].recipient === this.sessionWebId) ||
                    (mess[i].sender === this.sessionWebId && mess[i].recipient === this.recipientWebId)) {
                    console.log("entra al if");
                    */
                    this.messages.push(mess[i]);

                    if (!this.primera) {
                        let data: Array<any> = [];
                        data.push({
                            'title': 'Nuevo Mensaje de: ' + mess[i].sender,
                            'alertContent': mess[i].content
                        });
                        this.notificationService.generateNotification(data);
                    }
                    /*
                }*/
            }

        }
        this.primera = false;
    }

    /*
    * This method gets the url of the connection to synchronize the different messages
    */
    public async syncGroupMessages(ruta: string) {

        var urlArray = this.sessionWebId.split("/");
        console.log("FILESCREATOR-->"+ ruta);
        let url = "https://" + ruta.split('@@@')[2] + '/public/dechat5a/' + ruta + "/Conversation.ttl";
        console.log("-----FILESCREATORSERVICE!!!------" + url);
        let messageContent = await this.sparqlService.getMessages(url);

        let mess = [];
        messageContent.forEach(msg => mess.push(msg));

        mess = new messagesSorter().order(mess);


        if (mess.length > this.messages.length) {
            for (var i = this.messages.length; i < mess.length; i++) {
                console.log("entra al if");
                this.messages.push(mess[i]);
                if (!this.primera) {
                    let data: Array<any> = [];
                    data.push({
                        'title': 'Nuevo Mensaje de: ' + ruta,
                        'alertContent': mess[i].content
                    });
                    this.notificationService.generateNotification(data);
                }
            }
        }
        this.primera = false;
    }
}
