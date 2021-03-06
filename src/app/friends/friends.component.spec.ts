import { Friend } from 'src/app/models/friend.model';
import { FriendsComponent } from './friends.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { IconsModule } from '../icons/icons.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

describe('Friends Component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastrModule.forRoot(), IconsModule, PickerModule],
      declarations: [
        FriendsComponent
      ],
      providers: [ToastrService, IconsModule, PickerModule]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(FriendsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should return name from url', () => {
    //arrange
    const fixture = TestBed.createComponent(FriendsComponent);

    //act
    const username = fixture.componentInstance.getUserByUrl('https://username.solid.community/profile/card#me');

    //assert
    expect(username).toContain('username');
  });

  it('should return friend list', () => {
    //arrange
    const fixture = TestBed.createComponent(FriendsComponent);
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

    const spy = spyOn(fixture.componentInstance, 'searchFriend').and.callFake(() => {
        return friends;
      });


    //act
    const ffriends = fixture.componentInstance.searchFriend();

    //assert
    expect(ffriends).toEqual(fixture.componentInstance.searchFriend());
    expect(ffriends[0]['webid']).toEqual(friends[0].webid);
    expect(spy).toHaveBeenCalled();
  });

});
