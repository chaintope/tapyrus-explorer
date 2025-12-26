import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlockPage } from './block.page';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BlockPage', () => {
  let component: BlockPage;
  let fixture: ComponentFixture<BlockPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [BlockPage],
    imports: [IonicModule.forRoot(),
        RouterTestingModule,
        SharedPipeModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(BlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
