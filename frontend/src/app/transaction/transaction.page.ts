import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';

import { TransactionRawdataPage } from '../transaction-rawdata/transaction-rawdata.page';
import { BackendService } from '../backend.service';
import { NotFoundComponent } from '../components/errors/not_found.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  providers: [BackendService]
})
export class TransactionPage implements OnInit {
  txid: string;
  transaction: any = {};
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
    this.txid = this.activatedRoute.snapshot.paramMap.get('txid');
    this.getTransactionInfo();
  }

  getTransactionInfo() {
    this.resetError();
    this.backendService.getTransaction(this.txid).subscribe(
      data => {
        this.transaction = data || {};
        this.calculateTotal();
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

  goToCoin(colorId) {
    this.navCtrl.navigateForward(`/color/${colorId}`);
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
