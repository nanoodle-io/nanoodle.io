import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWatchComponent } from './accountWatch.component';

describe('AccountWatchComponent', () => {
  let component: AccountWatchComponent;
  let fixture: ComponentFixture<AccountWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountWatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
