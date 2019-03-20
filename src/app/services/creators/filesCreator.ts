export class filesCreator {
    /*
     * Method that creates the folder using the solid-file-client lib
     */
    public buildFolder(solidId,fileClient) {
        fileClient.readFolder(solidId).then(folder => {
            console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        }, err => {
            //Le paso la URL de la carpeta y se crea en el pod. SI ya esta creada no se si la sustituye o no hace nada
            fileClient.createFolder(solidId).then(success => {
                console.log(`Created folder ${solidId}.`);
            }, err1 => console.log(err1));

        });
    }

        /*
     * Create a new folder. The specific route would be /public/dechat5a/ + the name of the partner
     */
    public createNewFolder(name: string, ruta: string, solidId,fileClient) {
        //Para crear la carpeta necesito una ruta que incluya el nombre de la misma.
        //Obtengo el ID del usuario y sustituyo  lo irrelevante por la ruta de public/NombreCarpeta
        let stringToChange = '/profile/card#me';
        let path = ruta + name;
        solidId = solidId.replace(stringToChange, path);
        //Necesito logearme en el cliente para que me de permiso, sino me dara un error al intentar
        //crear la carpeta. Como ya estoy en sesion no abre nada pero si se abre la consola se ve
        // que se ejecuta correctamente.
        this.buildFolder(solidId,fileClient);
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
}