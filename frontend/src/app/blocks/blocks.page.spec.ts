import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlocksPage } from './blocks.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';

describe('BlocksPage', () => {
  let component: BlocksPage;
  let fixture: ComponentFixture<BlocksPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlocksPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        NgxPaginationModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
