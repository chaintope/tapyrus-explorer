import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { Config, ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Blocks',
      url: '/blocks'
    },
    {
      title: 'Txns',
      url: '/tx/recent'
    },
    {
      title: 'Colors',
      url: '/colors'
    },
    {
      title: 'Tracking Validation',
      url: '/material_tracking_validation'
    }
  ];
  public menuToggle = false;
  public project;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private configService: ConfigService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.configService.getConfig().subscribe((config: Config) => {
        this.project = config.project;
      });
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('blocks/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        page => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }

  openFirst() {
    if (this.menuToggle) {
      // this.menu.enable(false, 'side-menu');
      this.menu.close('side-menu');
      this.menuToggle = false;
    } else {
      this.menu.enable(true, 'side-menu');
      this.menu.open('side-menu');
      this.menuToggle = true;
    }
  }

  goTo(url: string) {
    const win = window.open(url, '_blank');
    win.focus();
  }
}
