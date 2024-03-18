import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';

@Component({
  selector: 'app-color',
  templateUrl: './colors.page.html',
  styleUrls: ['./colors.page.scss'],
  providers: [BackendService]
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
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private backendService: BackendService
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
        this.lastSeenColorId = data['colors'][data['colors'].length - 1][0];
      },
      err => {
        console.log(err);
        this.hasError = true;
        this.statusCode = err.status;
        this.statusMsg = err.statusText;
        this.detailMsg = err.error;
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
