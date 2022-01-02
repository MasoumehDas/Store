import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowUploadComponent } from './window-upload.component';

describe('WindowUploadComponent', () => {
  let component: WindowUploadComponent;
  let fixture: ComponentFixture<WindowUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
