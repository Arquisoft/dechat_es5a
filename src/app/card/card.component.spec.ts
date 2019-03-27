import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule, TOAST_CONFIG } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule, ToastrModule.forRoot()],
            declarations: [CardComponent],
            providers: [ToastrService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have as h1 tag: Profile', async(() => {
        const fixture = TestBed.createComponent(CardComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Profile');
    }))

});


describe('Form testing', () => {
    let comp: CardComponent;
    let fixture: ComponentFixture<CardComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardComponent],
            imports: [BrowserModule,
                FormsModule,
                ReactiveFormsModule, RouterTestingModule, ToastrModule.forRoot()],
            providers: [ToastrService],
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CardComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement.query(By.css('form'));
            if (de != null) {
                el = de.nativeElement;
            }
        });
    }));

    it('should has name save', async(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('button').textContent).toContain('Save');
    }));

    it('should call the submit method', async(() => {
        fixture.detectChanges();
        spyOn(comp, 'onSubmit');
        el = fixture.debugElement.query(By.css('button')).nativeElement;
        el.click();
        expect(comp.onSubmit).toHaveBeenCalledTimes(0);
    }));
});