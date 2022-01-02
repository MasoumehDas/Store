import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTransportationComponent } from './company-transportation.component';

describe('CompanyTransportationComponent', () => {
  let component: CompanyTransportationComponent;
  let fixture: ComponentFixture<CompanyTransportationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTransportationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTransportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
