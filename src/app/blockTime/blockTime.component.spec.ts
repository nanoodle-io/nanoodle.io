import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTimeComponent } from './blockTime.component';

describe('BlockComponent', () => {
  let component: BlockTimeComponent;
  let fixture: ComponentFixture<BlockTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
