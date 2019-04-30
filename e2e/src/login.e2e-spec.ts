const fileClient = require('solid-file-client');

describe('workspace-project App', () => {
    
    it('should log in and then show profile header message', () => {
        const credentials = {
            idp      : "https://solid.community",
            username : "uo257742",
            password : "Caquita05.", 
            base     : "https://uo257742.solid.community",
        }
        console.log("----------------------------------------------------------");

        fileClient.login(credentials).then( webId => {
            console.log( `Logged in as ${webId}.`)
        }, err => console.log(err) );        fileClient.checkSession().then( session => {
            console.log("Logged in as "+session.webId)
        }, err => console.log(err) );    });
});
