import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDownloadComponent } from './accountDownload.component';

describe('AccountDownloadComponent', () => {
  let component: AccountDownloadComponent;
  let fixture: ComponentFixture<AccountDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDownloadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
