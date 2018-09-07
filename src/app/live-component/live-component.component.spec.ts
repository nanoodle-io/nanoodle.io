import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveComponentComponent } from './live-component.component';

describe('LiveComponentComponent', () => {
  let component: LiveComponentComponent;
  let fixture: ComponentFixture<LiveComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
