import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.page.html',
  styleUrls: ['./color.page.scss'],
  standalone: false
})
export class ColorPage implements OnInit {
  colorId: string;
  tokenType: string;
  stats: any = {};
  txids = new Set();
  txs: any = [];
  lastSeenTxid?: string;
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
    this.colorId = this.activatedRoute.snapshot.paramMap.get('colorId') || '';
    if (this.colorId.startsWith('c1')) {
      this.tokenType = 'Reissuable';
    } else if (this.colorId.startsWith('c2')) {
      this.tokenType = 'Non Reissuable';
    } else if (this.colorId.startsWith('c3')) {
      this.tokenType = 'NFT';
    } else {
      this.tokenType = 'Unknown';
    }

    this.getColorInfo();
  }

  getColorInfo() {
    this.resetError();
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

  resetError() {
    this.hasError = false;
    this.statusCode = null;
    this.statusMsg = null;
    this.detailMsg = null;
  }
}
