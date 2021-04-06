import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';

@Component({
  selector: 'app-color',
  templateUrl: './color.page.html',
  styleUrls: ['./color.page.scss'],
  providers: [BackendService]
})
export class ColorPage implements OnInit {
  colorId: string;
  tokenType: string;
  stats: any = {};
  txs: any = [];
  openTxns = false;
  perPage = AppConst.PER_PAGE_COUNT;
  page = 1; // default start with page 1
  pages = 1; // number of pages

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.colorId = this.activatedRoute.snapshot.paramMap.get('colorId');
    if (this.colorId.startsWith('c1')) {
      this.tokenType = 'Reissuable';
    } else if (this.colorId.startsWith('c2')) {
      this.tokenType = 'Non Reissuable';
    } else if (this.colorId.startsWith('c2')) {
      this.tokenType = 'NFT';
    } else {
      this.tokenType = 'Unknown';
    }

    this.getColorInfo();
  }

  getColorInfo() {
    this.backendService.getColor(this.colorId).subscribe(
      data => {
        this.stats = data['chain_stats'] || {};
      },
      err => {
        console.log(err);
      }
    );
  }

  goToCoin(colorId) {
    this.navCtrl.navigateForward(`/color/${colorId}`);
  }
}
