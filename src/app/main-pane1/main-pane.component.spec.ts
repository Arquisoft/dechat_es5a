import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPaneComponent } from './main-pane.component';

describe('MainPaneComponent', () => {
  let component: MainPaneComponent;
  let fixture: ComponentFixture<MainPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
