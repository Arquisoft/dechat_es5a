import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
fdescribe('ChatComponent', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule, ToastrModule.forRoot()],
            declarations: [ChatComponent],
            providers: [ToastrService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return name from url', () => {
        const ruta: string = 'https://username.solid.community/profile/card#me';
        const username = component.getUserByUrl(ruta);
        expect(username).toContain('username');
    });
});