import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';
import Helper from '../app.helper';

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
  colors = [];
  transactions = [];
  txids = new Set();
  copied = false;
  perPage = AppConst.PER_PAGE_COUNT;
  page = 1; // default start with page 1
  pages = 1; // number of pages
  txCount = 0;
  lastSeenTxid?: string;
  hasError: boolean;
  statusCode: string;
  statusMsg: string;
  detailMsg: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
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
    Helper.copy(this.toastController, this.address);
  }

  onNextPage() {
    this.getAddressInfo();
  }

  getAddressInfo() {
    this.resetError();
    this.backendService
      .getAddressInfo(this.address, this.lastSeenTxid)
      .subscribe(
        data => {
          this.colors = data['balances'];
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
          this.hasError = true;
          this.statusCode = err.status;
          this.statusMsg = err.statusText;
          this.detailMsg = err.error;
        }
      );
  }

  resetError() {
    this.hasError = false;
    this.statusCode = null;
    this.statusMsg = null;
    this.detailMsg = null;
  }

  isColored(colorId) {
    return colorId !== '000000000000000000000000000000000000000000000000000000000000000000';
  }
}
