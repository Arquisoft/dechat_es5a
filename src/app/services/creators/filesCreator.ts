import { Friend } from "src/app/models/friend.model";
import { Message } from "src/app/models/message.model";
import { TXTPrinter } from "../printers/txtprinter.service";
import {messagesSorter} from "../sorters/messagesSorter";
import {PushNotificationsService} from '../push.notifications.service';
import * as $ from 'jquery';


export class filesCreator {

    sessionWebId: string;
    recipientWebId: string;
    fileClient: any;
    messages:Message[];

    _notificationService: PushNotificationsService;
    primera: boolean;

     /*
     * Constuctor
     */
    constructor(userWebId:string, recipientWebId:string,fileClientP:any, messages: Message[]) {
        this.sessionWebId=userWebId;
        this.recipientWebId=recipientWebId;
        this.fileClient=fileClientP;
        this.messages=messages;
        this._notificationService = new PushNotificationsService();
        this._notificationService.requestPermission();
        this.primera = true;
    }


    //method that creates the folder using the solid-file-client lib
    private buildFolder(solidId) {
        this.fileClient.readFolder(solidId).then(folder => {
        }, err => {
            this.fileClient.createFolder(solidId).then(success => {
            }, err1 => console.log('Error creating folder'));

        });
    }
    /*
     * Returns a string with all the readers of a acl, divided by '|'
     * @param path:string the file or folder to look the readers
     * In TODO
     */
    public getReaders(path:string): string{
        let file;
        let list;
        this.fileClient.readFile(path+'.acl').then(  body => {
            file= body;
        }, err => console.log('Error getting readers'));


        return  list;
    }

        /*
     * Create a new folder. The specific route would be /public/dechat5a/ + the name of the partner
     */
    public createNewFolder(name: string, ruta: string) {
        //Para crear la carpeta necesito una ruta que incluya el nombre de la misma.
        //Obtengo el ID del usuario y sustituyo  lo irrelevante por la ruta de public/NombreCarpeta
        let stringToChange = '/profile/card#me';
        let path = ruta + name;
        let solidId=this.sessionWebId;
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
        let myUser= this.getUserByUrl(this.sessionWebId);
        let user = this.getUserByUrl(this.recipientWebId);
        var messageContent = (document.getElementById("usermsg") as HTMLInputElement).value;
        (document.getElementById("usermsg") as HTMLInputElement).value="";

        //Sender WebID
        let senderId = this.sessionWebId;
        let senderPerson: Friend = { webid: senderId };

        //Receiver WebId
        let recipientPerson: Friend = { webid: this.recipientWebId }

        let messageToSend: Message = { content: messageContent, date: new Date(Date.now()), sender: senderPerson, recipient: recipientPerson }
        this.messages.push(messageToSend);
        let stringToChange = '/profile/card#me';
        let path = '/public/dechat5a/' + user + '/Conversation.txt';

        senderId = senderId.replace(stringToChange, path);

        let message = await this.readMessage(senderId);


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
     * This methos updates the TTL file with the new content
     */
    private updateTTL(url, newContent, contentType?) {
        if (contentType) {
            this.fileClient.updateFile(url, newContent, contentType).then(success => {
            }, err => console.log('Error updating ttl file'));
        }
        else {
            this.fileClient.updateFile(url, newContent).then(success => {
            }, err => console.log('Error updating ttl file'));
        }
    }

     /*
     * This methos searches for a message in an url
     */
    public async readMessage(url) {
        var message = await this.searchMessage(url)

        return message;
    }

     /*
     * This method search for a message in a pod
     */
    public async searchMessage(url) {
        return await this.fileClient.readFile(url).then(body => {

            return body;
        }, err => console.log('Error searching messages'));

    }

        /*
     * This method creates a file in a folder using the solid-file-client lib
     */
    private buildFile(solidIdFolderUrl, content) {
        this.fileClient.createFile(solidIdFolderUrl, content, "text/plain").then(fileCreated => {

        }, err => console.log('Error building file'));
    }

     /*
     * This method gets the url of the connection to synchronize the different messages
     */
    public async synchronizeMessages(){
         $("#scroll").animate({ scrollTop: $('#scroll')[0].scrollHeight}, 200);
        var urlArray = this.recipientWebId.split("/");
        let url= "https://" + urlArray[2] + "/public/dechat5a/" + this.getUserByUrl(this.sessionWebId) + "/Conversation.ttl";

        var urlArrayPropio = this.sessionWebId.split("/");
        let urlPropia = "https://" + urlArrayPropio[2] + "/public/dechat5a/" + this.getUserByUrl(this.recipientWebId) + "/Conversation.ttl";

        let messageContent = await this.searchMessage(url);

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

        let mess = [];
        messageArray.forEach(element => {
            if(element[0]){
             let messageArrayContent = element.split("###");
             let messageToAdd:Message = { content: messageArrayContent[2], date: messageArrayContent[3],sender: messageArrayContent[0], recipient: messageArrayContent[1]};

             mess.push(messageToAdd);
            }

        });
        messageArrayPropio.forEach(element => {
            if(element[0]){
                let messageArrayContent = element.split("###");
                let messageToAdd:Message = { content: messageArrayContent[2], date: messageArrayContent[3],sender: messageArrayContent[0], recipient: messageArrayContent[1]};

                mess.push(messageToAdd);
            }

        });



        mess = new messagesSorter().order(mess);

        if(mess.length > this.messages.length){
            for (var i = this.messages.length; i < mess.length; i++) {
                this.messages.push( mess[i]);

                if(!this.primera)
                {
                  let data: Array < any >= [];
                  data.push({
                    'title': 'Nuevo Mensaje de: '+ mess[i].sender,
                    'alertContent': mess[i].content
                  });
                  this._notificationService.generateNotification(data);
                }
            }
            this.primera = false;
        }


    }


}
