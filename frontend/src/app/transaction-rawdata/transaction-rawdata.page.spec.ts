import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';

import { TransactionRawdataPage } from './transaction-rawdata.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TransactionRawdataPage', () => {
  let component: TransactionRawdataPage;
  let fixture: ComponentFixture<TransactionRawdataPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TransactionRawdataPage],
    imports: [IonicModule.forRoot()],
    providers: [NavParams, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(TransactionRawdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
