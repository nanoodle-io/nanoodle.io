import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsComponentComponent } from './stats-component.component';

describe('StatsComponentComponent', () => {
  let component: StatsComponentComponent;
  let fixture: ComponentFixture<StatsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
