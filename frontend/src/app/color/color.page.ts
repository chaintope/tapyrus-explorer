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
  txids = new Set();
  txs: any = [];
  lastSeenTxid?: string;

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
    this.backendService.getColor(this.colorId, this.lastSeenTxid).subscribe(
      data => {
        this.stats = data['stats']['chain_stats'] || {};
        data['tx']['txs']
          .filter(tx => !this.txids.has(tx.txid))
          .forEach(tx => {
            this.txids.add(tx.txid);
            this.txs.push(tx);
          });
        this.lastSeenTxid = data['tx']['last_seen_txid'];
      },
      err => {
        console.log(err);
      }
    );
  }

  goToCoin(colorId) {
    this.navCtrl.navigateForward(`/color/${colorId}`);
  }

  goToAddress(add = '') {
    this.navCtrl.navigateForward(`/addresses/${add}`);
  }

  goToTransaction(txid = '') {
    this.navCtrl.navigateForward(`/tx/${txid}`);
  }

  onNextPage() {
    this.getColorInfo();
  }
}
