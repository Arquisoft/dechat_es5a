import { RdfService } from './../services/rdf.service';
import { Friend } from 'src/app/models/friend.model';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ToastrService, ToastrModule } from "ngx-toastr";
import { SolidProfile } from '../models/solid-profile.model';

describe('RDF Service', () => {
    let service: RdfService;

    const friends: Friend[] = [{
        webid: 'https://friend1.solid.community/profile/card/#me'
    },
    {
        webid: 'https://friend2.solid.community/profile/card/#me'
    },
    {
        webid: 'https://friend3.solid.community/profile/card/#me'
    },
    ]

    const profile: SolidProfile =
    {
        address: {
            street: 'valdessalas'
        },
        company: 'uniovi',
        email: 'uo123456@uniovi.es',
        fn: 'fn',
        image: 'image',
        phone: '123456789',
        role: 'student',
        organization: 'uniovi',
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ToastrModule.forRoot()],
            providers: [RdfService, ToastrService]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        service = TestBed.get(RdfService);
    });

    it('should return friend list from pod', () => {
        //arrange
        let spy = spyOn(service, 'getFriends').and.callFake(() => {
            return friends;
        });

        //act
        let ffriends = service.getFriends();

        //assert
        expect(ffriends).toEqual(service.getFriends());
        expect(ffriends[0]['webid']).toEqual(friends[0].webid);
        expect(spy).toHaveBeenCalled();
    });

    it('should return adress', () => {
        //arrange
        let addr = profile.address.street;
        let spy = spyOn(service, 'getAddress').and.callFake(() => {
            return addr;
        });         //act
        let address = service.getAddress();

        //assert
        //expect(address).toEqual(addr);
        expect(address.street).toEqual(addr['street']);
        expect(spy).toHaveBeenCalled();
    });

    it('should return email', () => {
        //arrange
        let em = profile.email;
        let spy = spyOn(service, 'getEmail').and.callFake(() => {
            return em;
        });         //act
        let email = service.getEmail();

        //assert
        expect(email).toEqual(em);
        expect(spy).toHaveBeenCalled();
    });

    it('should return phone', () => {
        //arrange
        let ph = profile.phone;
        let spy = spyOn(service, 'getPhone').and.callFake(() => {
            return ph;
        });         //act
        let phone = service.getPhone();

        //assert
        expect(phone).toEqual(ph);
        expect(spy).toHaveBeenCalled();
    });

    it('should return uri for phone', () => {
        //arrange
        let uriReturned = 'phone';
        let spy = spyOn(service, 'getUriForField').and.callFake(() => {
            return uriReturned;
        });
        //act
        service.getUriForField('phone', 'https://phone.solid.community/profile/card#me');

        //assert
        expect(uriReturned).toEqual(service.getUriForField('phone', 'https://phone.solid.community/profile/card#me'));
        expect(uriReturned).toEqual('phone');
        expect(spy).toHaveBeenCalled();
    });

    it('should return uri for email', () => {
        //arrange
        let uriReturned = 'email';
        let spy = spyOn(service, 'getUriForField').and.callFake(() => {
            return uriReturned;
        });
        //act
        service.getUriForField('email', 'https://email.solid.community/profile/card#me');

        //assert
        expect(uriReturned).toEqual(service.getUriForField('email', 'https://phone.solid.community/profile/card#me'));
        expect(uriReturned).toEqual('email');
        expect(spy).toHaveBeenCalled();
    });


});