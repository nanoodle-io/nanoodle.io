import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HashComponent } from './hash.component';

describe('HashComponent', () => {
  let component: HashComponent;
  let fixture: ComponentFixture<HashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
