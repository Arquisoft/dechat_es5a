import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import { ActivatedRoute, Params } from '@angular/router';



@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {



    fileClient: any;
    ruta_seleccionada: string;
    htmlToAdd: string;

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
        const name =  this.getUserByUrl(this.ruta_seleccionada);
        this.createNewFolder( 'dechat5a' , '/public/');
        this.createNewFolder( name , '/public/dechat5a/');
    }

    private getUserByUrl(ruta: string): string {
        let sinhttp;
        sinhttp = ruta.replace('https://', '');
        const user = sinhttp.split('.')[0];
        return user;

    }

    private createNewFolder( name : string , ruta : string) {
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
            this.htmlToAdd = '<div>Carpeta ya existe! Ve a tu pod para verla</div>';
        }, err => {
            //Le paso la URL de la carpeta y se crea en el pod. SI ya esta creada no se si la sustituye o no hace nada
            this.fileClient.createFolder(solidId).then(success => {
                console.log(`Created folder ${solidId}.`);
                this.htmlToAdd = '<div>Carpeta Creada! Ve a tu pod para comprobarlo</div>';
            }, err1 => console.log(err1));

        } );
    }

    /**
     * Method to create a file for a message
     * @param solidId url of the folder
     */
    private createNewFile() {
        let solidId = this.rdf.session.webId;
        let stringToChange = '/profile/card#me';
        let user = this.getUserByUrl(this.ruta_seleccionada);
        let path = '/public/' + user + '/Kike.ttl';
        solidId = solidId.replace(stringToChange, path);

        let message = this.readMessage(solidId);
        if (message!= null) {
            this.updateTTL(solidId, message + "@prefix schem: <http://schema.org/>.");
        }
        else {
            this.updateTTL(solidId, "@prefix schem: <http://schema.org/>.");

        }

    }


    private readMessage(url) {
        var message = this.searchMessage(url)
        console.log(message);
        return message;
    }







    //method that creates a file in a folder using the solid-file-client lib
    private buildFile(solidIdFolderUrl, content) {
        this.fileClient.createFile(solidIdFolderUrl, content, "text/plain").then(fileCreated => {
            console.log(`Created file ${fileCreated}.`);
        }, err => console.log(err));
    }


    //method that search for a message in a pod
    private searchMessage(url) {
        this.fileClient.readFile(url).then(body => {
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
        else{
            this.fileClient.updateFile(url, newContent).then(success => {
                console.log(`Updated ${url}.`)
            }, err => console.log(err));
        }

    }
}
