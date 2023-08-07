import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';

import { TransactionRawdataPage } from './transaction-rawdata.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TransactionRawdataPage', () => {
  let component: TransactionRawdataPage;
  let fixture: ComponentFixture<TransactionRawdataPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionRawdataPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [NavParams]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionRawdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
