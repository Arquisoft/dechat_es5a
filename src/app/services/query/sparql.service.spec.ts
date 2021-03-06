import { Friend } from './../../models/friend.model';
import { Message } from './../../models/message.model';
import { SparqlService } from './sparql.service';
import { from } from 'rxjs';
describe('SPARQL service testing', () => {
    let service: SparqlService = new SparqlService();
    let senderPerson: Friend = { webid: 'https://sender.solid.community/profile/card/#me' };
    let recipientPerson: Friend = { webid: 'https://recipient.solid.community/profile/card/#me' }  
    it('should return messages from a pod', () => {
        //arrange
        const messages: Message[] = [
            {
                content: 'Test',
                date: new Date(),
                sender: senderPerson,
                recipient: recipientPerson,
            },
            {
                content: 'Test2',
                date: new Date(),
                sender: recipientPerson,
                recipient: senderPerson,
            }
        ]

        const spy = spyOn(service, 'getMessages').and.callFake(() => {
            return messages;
        });

        //act
        let mess = service.getMessages('https://sender.solid.community/public/dechat5a/recipient.ttl');
        expect(mess).toEqual(service.getMessages('https://sender.solid.community/public/dechat5a/recipient.ttl'));
        expect(mess[0]['content']).toEqual(messages[0].content);
    
        //assert
        //TODO compare with message[] created
        expect(spy).toHaveBeenCalled();
    });
});