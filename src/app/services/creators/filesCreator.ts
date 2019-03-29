import { Friend } from "src/app/models/friend.model";
import { message } from "src/app/models/message.model";
import { TXTPrinter } from "../printers/txtprinter.service";
import {messagesSorter} from "../sorters/messagesSorter";
import {
    PushNotificationsService
} from '../push.notifications.service';

export class filesCreator {

    sessionWebId: string;
    recipientWebId: string;
    fileClient: any;
    messages:message[];

    _notificationService: PushNotificationsService;
    primera: boolean;

     /*
     * Constuctor
     */
    constructor(userWebId:string, recipientWebId:string,fileClientP:any, messages: message[]) {
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
            console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        }, err => {
            //Le paso la URL de la carpeta y se crea en el pod. SI ya esta creada no se si la sustituye o no hace nada
            this.fileClient.createFolder(solidId).then(success => {
                console.log(`Created folder ${solidId}.`);
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
    private createOwnerACL(path:string, user:string) {
        let file = path+'.acl';
        let contenido = '@prefix  acl:  <http://www.w3.org/ns/auth/acl#>  .\n'+
            '<#owner>\n'+
            'a             acl:Authorization;\n'+
            'acl:agent     <'+this.sessionWebId+'>;\n'+
            'acl:accessTo  <'+path+'>;\n'+
            'acl:defaultForNew <./>;'+
            'acl:mode\n      acl:Read,\n'+
            'acl:Write,\n'+
            'acl:Control.'

        this.fileClient.updateFile(file,contenido).then(success => {
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
    public createReadForOneACL(path: string, owner: string, reader:string) {
        let file = path + '.acl';
        let contenido ='@prefix  acl:  <http://www.w3.org/ns/auth/acl#>  .'+
            '<#owner>\n'+
            'a             acl:Authorization;\n'+
            'acl:agent     <'+owner+'>;\n'+
            'acl:accessTo  <'+path+'>;\n'+
            'acl:defaultForNew <./>;'+
            'acl:mode\n      acl:Read,\n'+
            'acl:Write,\n'+
            'acl:Control.\n'+

            '<#reader>\n'+
            'a             acl:Authorization;\n'+
            'acl:agent     <'+reader+'>;\n'+
            'acl:accessTo  <'+path+'>;\n'+
            'acl:defaultForNew <./>;\n'+
            'acl:mode\n      acl:Read.'

        this.fileClient.updateFile(file,contenido).then(success => {
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
    public createReadForManyACL(path: string, owner:string, readers: string[]) {
        let file = path + '.acl';
        let contenido ='@prefix  acl:  <http://www.w3.org/ns/auth/acl#>  .\n'+
            '<#owner>\n'+
            'a             acl:Authorization;\n'+
            'acl:agent     <'+owner+'>\n'+
            'acl:accessTo  <'+path+'>\n'+
            'acl:defaultForNew <./>;\n'+
            'acl:mode      acl:Read,\n'+
            'acl:Write,\n'+
            'acl:Control.\n'+

            '<#readers>\n'+
            'a               acl:Authorization;\n'+
            'acl:accessTo    <'+path+'>\n'+
            'acl:defaultForNew <./>;\n'+
            'acl:mode        acl:Read;\n'

        readers.forEach(function (e, idx, array) {
            if (idx === array.length - 1){
                contenido = contenido + 'acl:agent  <'+e+'>.'
            } else {
                contenido = contenido + 'acl:agent  <'+e+'>;\n'
            }
        })
        this.fileClient.updateFile(file,contenido).then(success => {
            console.log(`Created acl many readers ${file}.`)
        }, err => console.log(err));
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
            console.log(`File content is : ${body}.`);
        }, err => console.log(err) );


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
        console.log(messageContent);
        //Sender WebID
        let senderId = this.sessionWebId;
        let senderPerson: Friend = { webid: senderId };

        //Receiver WebId
        let recipientPerson: Friend = { webid: this.recipientWebId }

        let messageToSend: message = { content: messageContent, date: new Date(Date.now()), sender: senderPerson, recipient: recipientPerson }
        this.messages.push(messageToSend);
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
     * This methos searches for a message in an url
     */
    public async readMessage(url) {
        var message = await this.searchMessage(url)
        console.log(message);
        return message;
    }

     /*
     * This method search for a message in a pod
     */
    public async searchMessage(url) {
        return await this.fileClient.readFile(url).then(body => {
            console.log(`File	content is : ${body}.`);
            return body;
        }, err => console.log(err));

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
     * This method gets the url of the connection to synchronize the different messages
     */
    public async synchronizeMessages(){

        var urlArray = this.recipientWebId.split("/");
        let url= "https://" + urlArray[2] + "/public/dechat5a/" + this.getUserByUrl(this.sessionWebId) + "/Conversation.txt";

        var urlArrayPropio = this.sessionWebId.split("/");
        let urlPropia = "https://" + urlArrayPropio[2] + "/public/dechat5a/" + this.getUserByUrl(this.recipientWebId) + "/Conversation.txt";
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

        let mess = [];
        messageArray.forEach(element => {
            if(element[0]){
             let messageArrayContent = element.split("###");
             let messageToAdd:message = { content: messageArrayContent[2], date: messageArrayContent[3],sender: messageArrayContent[0], recipient: messageArrayContent[1]};
                console.log(messageToAdd);
             mess.push(messageToAdd);
            }

        });
        messageArrayPropio.forEach(element => {
            if(element[0]){
                let messageArrayContent = element.split("###");
                let messageToAdd:message = { content: messageArrayContent[2], date: messageArrayContent[3],sender: messageArrayContent[0], recipient: messageArrayContent[1]};
                console.log(messageToAdd);
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
