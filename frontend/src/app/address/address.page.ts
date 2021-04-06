import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  providers: [BackendService]
})
export class AddressPage implements OnInit {
  block = {};
  qrcode = 'tapyrus:';
  address = '';
  balanced: number;
  received: number;
  sent: number;
  transactions = [];
  txids = new Set();
  copied = false;
  perPage = AppConst.PER_PAGE_COUNT;
  page = 1; // default start with page 1
  pages = 1; // number of pages
  txCount = 0;
  lastSeenTxid?: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.address = this.activatedRoute.snapshot.paramMap.get('address');
    this.qrcode = 'tapyrus:' + this.address;
    this.getAddressInfo();
  }

  goToTransaction(txid: string) {
    this.navCtrl.navigateForward(`/tx/${txid}`);
  }

  goToAddressPage(address: string) {
    this.navCtrl.navigateForward(`/addresses/${address}`);
  }

  goToCoin(colorId) {
    this.navCtrl.navigateForward(`/color/${colorId}`);
  }

  copyAddress() {
    const textArea = document.createElement('textarea');
    textArea.value = this.address;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 800);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  onNextPage() {
    this.getAddressInfo();
  }

  getAddressInfo() {
    this.backendService
      .getAddressInfo(this.address, this.lastSeenTxid)
      .subscribe(
        data => {
          this.received = data['balances'][0]['received'] || 0;
          this.sent = data['balances'][0]['sent'] || 0;
          this.balanced = data['balances'][0]['balanced'] || 0;
          this.txCount = data['balances'][0]['count'] || 0;
          data['tx']['txs']
            .filter(tx => !this.txids.has(tx.txid))
            .forEach(tx => {
              this.txids.add(tx.txid);
              this.transactions.push(tx);
            });
          this.lastSeenTxid = data['tx']['last_seen_txid'];
        },
        err => {
          console.log(err);
        }
      );
  }
}
