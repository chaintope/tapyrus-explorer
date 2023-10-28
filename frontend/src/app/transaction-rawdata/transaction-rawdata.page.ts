import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { BackendService } from '../backend.service';
import Helper from '../app.helper';

@Component({
  selector: 'app-transaction-rawdata',
  templateUrl: './transaction-rawdata.page.html',
  styleUrls: ['./transaction-rawdata.page.scss'],
  providers: [BackendService]
})
export class TransactionRawdataPage implements OnInit {
  @Input() txid: string;
  txRawData = '';

  constructor(
    private navParams: NavParams,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.txid = this.navParams.get('txid');
    this.getTxRawData();
  }

  getTxRawData() {
    this.backendService.getRawTransaction(this.txid).subscribe(
      data => {
        const result: any = data || { hex: '' };
        this.txRawData = result['hex'];
      },
      err => {
        console.log(err);
      }
    );
  }

  async copyTxRawData() {
    Helper.copy(this.toastController, this.txRawData);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
