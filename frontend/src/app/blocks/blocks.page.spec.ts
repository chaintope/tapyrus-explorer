import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlocksPage } from './blocks.page';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BlocksPage', () => {
  let component: BlocksPage;
  let fixture: ComponentFixture<BlocksPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [BlocksPage],
    imports: [IonicModule.forRoot(),
        NgxPaginationModule,
        RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(BlocksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
