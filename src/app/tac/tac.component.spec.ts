import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TACComponent } from './tac.component';

describe('TACComponent', () => {
  let component: TACComponent;
  let fixture: ComponentFixture<TACComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TACComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TACComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
