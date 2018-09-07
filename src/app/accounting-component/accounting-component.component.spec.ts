import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingComponentComponent } from './accounting-component.component';

describe('AccountingComponentComponent', () => {
  let component: AccountingComponentComponent;
  let fixture: ComponentFixture<AccountingComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
