import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddressPage } from './address.page';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddressPage', () => {
  let component: AddressPage;
  let fixture: ComponentFixture<AddressPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AddressPage],
    imports: [IonicModule.forRoot(),
        RouterTestingModule,
        SharedPipeModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(AddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
