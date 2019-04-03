import { Friend } from './../../models/friend.model';
import { Message } from 'src/app/models/message.model';
import { messagesSorter } from './messagesSorter';
describe('Messages Sorter', () => {
    const senderPerson: Friend = { webid: 'https://sender.solid.community/profile/card/#me' };
    const recipientPerson: Friend = { webid: 'https://recipient.solid.community/profile/card/#me' }  
    const messageSorter: messagesSorter = new messagesSorter();
    
    const messages: Message[] = [
        {
            content: 'Test',
            date: new Date(Date.parse('2019/03/25')),
            sender: senderPerson,
            recipient: recipientPerson,
        },
        {
            content: 'Test2',
            date: new Date(Date.parse('2019/03/22')),
            sender: recipientPerson,
            recipient: senderPerson,
        },
        {
            content: 'Test3',
            date: new Date(Date.now()),
            sender: senderPerson,
            recipient: recipientPerson,
        }
    ]
    it('should return message[] sorted', () => {
        //arrange
        //nothing to do here
        //act
        const orderedMessages = messageSorter.order(messages);

        //assert
        expect(orderedMessages[0].content).toBe('Test2');
    });
});