import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionGraphComponent } from './transactionGraph.component';

describe('SocialComponent', () => {
  let component: TransactionGraphComponent;
  let fixture: ComponentFixture<TransactionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
