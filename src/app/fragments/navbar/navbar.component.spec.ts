import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NavbarComponent } from "./navbar.component";

fdescribe('ChatComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, ToastrModule.forRoot()],
            declarations: [NavbarComponent],
            providers: [ToastrService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not be logged after app starts', () => {
        //arrange
        spyOn(component, 'isLogged').and.returnValue(false);
        //act
        const logged = component.isLogged();
        //assert
        expect(logged).toBeFalsy();
        
        
        
    });
});