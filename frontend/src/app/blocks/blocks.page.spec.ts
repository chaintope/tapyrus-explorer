import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlocksPage } from './blocks.page';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('BlocksPage', () => {
  let component: BlocksPage;
  let fixture: ComponentFixture<BlocksPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlocksPage],
      imports: [
        IonicModule.forRoot(),
        NgxPaginationModule,
        RouterTestingModule
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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

describe('BlocksPage page query parameter', () => {
  const createWith = async (queryParams: { [key: string]: string }) => {
    TestBed.configureTestingModule({
      declarations: [BlocksPage],
      imports: [
        IonicModule.forRoot(),
        NgxPaginationModule,
        RouterTestingModule
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap(queryParams)) }
        }
      ]
    });
    await TestBed.compileComponents();
    const fixture: ComponentFixture<BlocksPage> =
      TestBed.createComponent(BlocksPage);
    fixture.detectChanges();
    return fixture.componentInstance;
  };

  it('should take the page number from the query', async () => {
    const component = await createWith({ page: '3' });
    expect(component.page).toBe(3);
  });

  it('should fall back to the first page when the query is not a number', async () => {
    const component = await createWith({ page: 'abc' });
    expect(component.page).toBe(1);
  });

  it('should fall back to the first page when the query is out of range', async () => {
    const component = await createWith({ page: '0' });
    expect(component.page).toBe(1);
  });

  it('should fall back to the first page when the query is absent', async () => {
    const component = await createWith({});
    expect(component.page).toBe(1);
  });
});
