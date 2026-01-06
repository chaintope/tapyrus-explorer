import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

describe('AppComponent', () => {
  let platformReadySpy, platformSpy;

  beforeEach(waitForAsync(() => {
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {
      ready: platformReadySpy
    });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: Platform, useValue: platformSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.appPages.length).toEqual(4);
    expect(app.appPages[0].title).toEqual('Blocks');
    expect(app.appPages[1].title).toEqual('Txns');
    expect(app.appPages[2].title).toEqual('Colors');
    expect(app.appPages[3].title).toEqual('Tracking Validation');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.appPages.length).toEqual(4);
    expect(app.appPages[0].url).toEqual('/blocks');
    expect(app.appPages[1].url).toEqual('/tx/recent');
    expect(app.appPages[2].url).toEqual('/colors');
    expect(app.appPages[3].url).toEqual('/material_tracking_validation');
  });
});
