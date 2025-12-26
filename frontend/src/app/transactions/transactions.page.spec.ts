import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransactionsPage } from './transactions.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TransactionsPage', () => {
  let component: TransactionsPage;
  let fixture: ComponentFixture<TransactionsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TransactionsPage],
    imports: [IonicModule.forRoot(),
        NgxPaginationModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(TransactionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
