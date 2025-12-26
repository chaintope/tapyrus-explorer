import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BackendService } from '../backend.service';

@Component({
    selector: 'app-color',
    templateUrl: './colors.page.html',
    styleUrls: ['./colors.page.scss'],
    standalone: false
})
export class ColorsPage implements OnInit {
  lastSeenColorId?: string;
  colors = [];
  hasError: boolean;
  statusCode: string;
  statusMsg: string;
  detailMsg: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private backendService: BackendService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.lastSeenColorId =
      this.activatedRoute.snapshot.paramMap.get('lastSeenColorId') || '';
    this.getColorsInfo();
  }

  getColorsInfo() {
    this.resetError();
    this.backendService.getColors(this.lastSeenColorId).subscribe(
      data => {
        this.colors = this.colors.concat(data['colors']);
        this.lastSeenColorId =
          data['colors'][data['colors'].length - 1]['color_id'];
        this.cdr.detectChanges();
      },
      err => {
        console.log(err);
        this.hasError = true;
        this.statusCode = err.status;
        this.statusMsg = err.statusText;
        this.detailMsg = err.error;
        this.cdr.detectChanges();
      }
    );
  }

  goToColorPage(colorId) {
    this.navCtrl.navigateForward(`/color/${colorId}`);
  }

  goToBlock(block_height) {
    this.navCtrl.navigateForward(`/block/height/${block_height}`);
  }

  onNextPage() {
    this.getColorsInfo();
  }

  resetError() {
    this.hasError = false;
    this.statusCode = null;
    this.statusMsg = null;
    this.detailMsg = null;
  }
}
