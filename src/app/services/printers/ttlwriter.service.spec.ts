import { Friend } from 'src/app/models/friend.model';
import { Message } from './../../models/message.model';
import { TTLWriterUtil } from './../utils/ttlWriterUtil';
import { TTLWriterService } from "./ttlwriter.service";

fdescribe('TTL Writer service ', () => {

    let service: TTLWriterService = new TTLWriterService(new TTLWriterUtil());
    let senderURL: string = 'https://sender.solid.community/profile/card/#me';
    let recipientURL: string = 'https://recipient.solid.community/profile/card/#me';
    //urls are defined in service
    beforeAll(() =>
        service.initService(senderURL, recipientURL))

    fit('should write ontology header information', () => {
        //arrange
        //nothing is needed for this test

        //act
        let header: string = service.writeTTLPrefixes();

        //assert
        expect(header).toContain('ont');
        expect(header).toContain('c0');
        expect(header).toContain('c1');
    });

    fit('should write message', () => {
        //arrange
        let sender: Friend = {webid: senderURL};
        let recipient: Friend = {webid: recipientURL};
        let content: string = 'Test';
        let message: Message = { content, date: new Date(Date.now()), sender, recipient};

        //act
        let contentWritten = service.writteData(message);

        //assert
        expect(contentWritten).toContain(content);
        expect(contentWritten).toContain('Message');
        expect(contentWritten).toContain('ont');
        expect(contentWritten).toContain('c0:me');
        expect(contentWritten).toContain('c1:me');

    });

});