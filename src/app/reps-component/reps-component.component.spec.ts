import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepsComponentComponent } from './reps-component.component';

describe('RepsComponentComponent', () => {
  let component: RepsComponentComponent;
  let fixture: ComponentFixture<RepsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
