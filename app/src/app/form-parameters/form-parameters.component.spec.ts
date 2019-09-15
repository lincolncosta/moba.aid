import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormParametersComponent } from './form-parameters.component';

describe('FormParametersComponent', () => {
  let component: FormParametersComponent;
  let fixture: ComponentFixture<FormParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
