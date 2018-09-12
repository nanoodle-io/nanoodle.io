import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepsComponent } from './reps.component';

describe('RepsComponent', () => {
  let component: RepsComponent;
  let fixture: ComponentFixture<RepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
