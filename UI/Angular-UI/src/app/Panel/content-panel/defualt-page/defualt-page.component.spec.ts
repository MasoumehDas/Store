import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefualtPageComponent } from './defualt-page.component';

describe('DefualtPageComponent', () => {
  let component: DefualtPageComponent;
  let fixture: ComponentFixture<DefualtPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefualtPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefualtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
