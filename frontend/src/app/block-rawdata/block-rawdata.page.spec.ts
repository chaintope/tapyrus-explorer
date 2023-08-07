import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlockRawdataPage } from './block-rawdata.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BlockRawdataPage', () => {
  let component: BlockRawdataPage;
  let fixture: ComponentFixture<BlockRawdataPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlockRawdataPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BlockRawdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
