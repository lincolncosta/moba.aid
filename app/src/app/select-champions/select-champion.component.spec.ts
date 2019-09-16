import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChampionsComponent } from './select-champion.component';

describe('SelectChampionsComponent', () => {
  let component: SelectChampionsComponent;
  let fixture: ComponentFixture<SelectChampionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectChampionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChampionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
