import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(waitForAsync(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {
      ready: platformReadySpy
    });

    TestBed.configureTestingModule({
    declarations: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
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
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].textContent).toContain('Blocks');
    expect(menuItems[1].textContent).toContain('Txns');
    expect(menuItems[2].textContent).toContain('Colors');
    expect(menuItems[3].textContent).toContain('Tracking Validation');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual(
      '/blocks'
    );
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual(
      '/tx/recent'
    );
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual(
      '/colors'
    );
    expect(menuItems[3].getAttribute('ng-reflect-router-link')).toEqual(
      '/material_tracking_validation'
    );
  });
});
