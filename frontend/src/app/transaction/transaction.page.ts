import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';

import { TransactionRawdataPage } from '../transaction-rawdata/transaction-rawdata.page';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  providers: [BackendService]
})
export class TransactionPage implements OnInit {
  txid: string;
  transaction: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.txid = this.activatedRoute.snapshot.paramMap.get('txid');
    this.getTransactionInfo();
  }

  getTransactionInfo() {
    this.backendService.getTransaction(this.txid).subscribe(
      data => {
        this.transaction = data || {};
        this.calculateTotal();
      },
      err => {
        console.log(err);
      }
    );
  }

  calculateTotal() {
    this.transaction.totalVout = this.transaction.vout.reduce(
      (sum, output) => sum + output.value,
      0
    );
  }

  goToTransactions() {
    this.navCtrl.navigateBack('/tx/recent');
  }

  goToAddress(add = '') {
    this.navCtrl.navigateForward(`/addresses/${add}`);
  }

  async goToTransactionRawData() {
    const modal = await this.modalCtrl.create({
      component: TransactionRawdataPage,
      componentProps: {
        txid: this.txid
      },
      cssClass: 'raw-data-modal'
    });
    return await modal.present();
  }
}
