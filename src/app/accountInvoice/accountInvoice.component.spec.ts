import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInvoiceComponent } from './accountInvoice.component';

describe('AccountWatchComponent', () => {
  let component: AccountInvoiceComponent;
  let fixture: ComponentFixture<AccountInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountInvoiceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
