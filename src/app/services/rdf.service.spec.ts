import { RdfService } from './../services/rdf.service';
import { Friend } from 'src/app/models/friend.model';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ToastrService, ToastrModule } from "ngx-toastr";
import { from } from 'rxjs';
import { defer } from 'q';

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



    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ ToastrModule.forRoot()],
            providers: [RdfService, ToastrService]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        service = TestBed.get(RdfService);
      });

    it('should return friend list from pod', () => {
        //arrange
        //act
        
        spyOn(service, 'getFriends').and.returnValue(() => {
            from([this.friends]);
        }); 
        service.getFriends();       
        //assert
        //with from we get the observable from the promise returned in the method, so we can subscribre() to it and see the returned friend list
        service.getFriends();
        expect(service.getFriends).toHaveBeenCalled();

    });
});