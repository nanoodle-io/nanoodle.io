import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecentralisationComponent } from './decentralisation.component';

describe('DecentralisationComponent', () => {
  let component: DecentralisationComponent;
  let fixture: ComponentFixture<DecentralisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DecentralisationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecentralisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
