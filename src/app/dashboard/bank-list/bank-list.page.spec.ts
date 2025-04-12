import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankListPage } from './bank-list.page';

describe('BankListPage', () => {
  let component: BankListPage;
  let fixture: ComponentFixture<BankListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
