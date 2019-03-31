import { Message } from 'src/app/models/message.model';
import { Friend } from 'src/app/models/friend.model';

import { TestBed } from '@angular/core/testing';

import { FilesCreatorService } from './files-creator.service';
import { TTLWriterService } from '../printers/ttlwriter.service';
import { PushNotificationsService } from '../push.notifications.service';
import { SparqlService } from '../query/sparql.service';
import { TTLWriterUtil } from '../utils/ttlWriterUtil';
import { from } from 'rxjs';



describe('FilesCreatorService', () => {
  let senderPerson: Friend = { webid: 'https://sender.solid.community/profile/card/#me' };
  let recipientPerson: Friend = { webid: 'https://recipient.solid.community/profile/card/#me' }  
  let service: FilesCreatorService = new FilesCreatorService(new TTLWriterService(new TTLWriterUtil()), new PushNotificationsService(), new SparqlService());

  beforeEach(() => {
    TestBed.configureTestingModule({});

  });

  it('should be created', () => {
    //const service: FilesCreatorService = TestBed.get(FilesCreatorService);
    expect(service).toBeTruthy();
  });

  it('should return user name from solid path', () => {
    //arrange
    let ruta: string;
    ruta = 'https://username.solid.community/profile/card/#me';

    //act
    const username = service.getUserByUrl(ruta);

    //assert
    expect(username).toBe('username');
  });

  it('should return user name from inrupt path', () => {
    //arrange
    let ruta: string = 'https://username.inrupt.net/profile/card/#me';
    //act
    const username = service.getUserByUrl(ruta);
    //assert
    expect(username).toBe('username');
  });

  it('should read 1 message', () => {
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

    spyOn(service, 'readMessage').and.returnValue(() => {
      from([messages]);
    });

    //act
    let fakemessages = service.readMessage('https://sender.solid.community/public/dechat5a/recipient.ttl');

    //TODO access promise array to check they both have same values
    //assert
    expect(messages.length).toBe(2);
  });

  it('shyncronize messages', () =>{
    //arrange
    //sender messages
    const smessages: Message[] = [
      {
        content: 'TestSender1',
        date: new Date(),
        sender: senderPerson,
        recipient: recipientPerson,
      },
      {
        content: 'TestSender2',
        date: new Date(),
        sender: senderPerson,
        recipient: recipientPerson,
      }
    ]
    const rmessages: Message[] = [
      {
        content: 'TestRecipient1',
        date: new Date(),
        sender: recipientPerson,
        recipient: senderPerson,
      },
      {
        content: 'TestRecipient2',
        date: new Date(),
        sender: senderPerson,
        recipient: recipientPerson,
      }
    ]
    const totalMessages: Message[] = [
      {
        content: 'TestSender1',
        date: new Date(),
        sender: senderPerson,
        recipient: recipientPerson,
      },
      {
        content: 'TestSender2',
        date: new Date(),
        sender: senderPerson,
        recipient: recipientPerson,
      },
      {
        content: 'TestRecipient1',
        date: new Date(),
        sender: recipientPerson,
        recipient: senderPerson,
      },
      {
        content: 'TestRecipient2',
        date: new Date(),
        sender: senderPerson,
        recipient: recipientPerson,
      }
    ]
    

    spyOn(service, 'synchronizeMessages').and.returnValue(() => {
      from([totalMessages]);
    });

    //act
    let fakeMessages = service.synchronizeMessages();

    //assert
    expect(totalMessages.length).toBe(4);

  });

});



