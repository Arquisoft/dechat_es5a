import { Message } from 'src/app/models/message.model';
import { Friend } from 'src/app/models/friend.model';

import { TestBed } from '@angular/core/testing';

import { FilesCreatorService } from './files-creator.service';
import { TTLWriterService } from '../printers/ttlwriter.service';
import { PushNotificationsService } from '../push.notifications.service';
import { SparqlService } from '../query/sparql.service';
import { TTLWriterUtil } from '../utils/ttlWriterUtil';


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
    const spy = spyOn(service, 'readMessage').and.callFake(() => {
     return messages;
    });

    //act
    let mess = service.readMessage('https://sender.solid.community/public/dechat5a/recipient.ttl');
    expect(mess).toEqual(service.readMessage('https://sender.solid.community/public/dechat5a/recipient.ttl'));
    expect(mess[0]['content']).toEqual('Test');
    //assert
    expect(spy).toHaveBeenCalled();

  });

  it('shyncronize messages', () =>{
    //arrange
    //sender messages
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
    

    const spy = spyOn(service, 'synchronizeMessages').and.callFake(() => {
      return totalMessages;
    });

    //act
    let totalMess = service.synchronizeMessages();
    expect(totalMess).toEqual(service.synchronizeMessages());
    expect(totalMess[0]['sender']['webid']).toEqual(totalMessages[0].sender.webid);

    //assert
    expect(spy).toHaveBeenCalled();
  });

  it('should return true after success update ttl', () => {
    //arrange
    const spy = spyOn(service, 'updateTTL').and.callFake(() => {
      return true;
    });

    //act 
    let result = service.updateTTL('anyUrl','thisisthenewmessage','text');
    let verdad = true;


    //assert
    expect(result).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should return false after failed update ttl', () => {
    //arrange
    const spy = spyOn(service, 'updateTTL').and.callFake(() => {
      return false;
    });

    //act 
    let result = service.updateTTL('anyUrl','thisisthenewmessage','text');
    let falso = false;


    //assert
    expect(result).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

});



