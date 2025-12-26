import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import Helper from '../app.helper';

@Component({
  selector: 'app-transaction-rawdata',
  templateUrl: './transaction-rawdata.page.html',
  styleUrls: ['./transaction-rawdata.page.scss'],
  standalone: false
})
export class TransactionRawdataPage implements OnInit {
  @Input() txid: string;
  txRawData = '';

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private backendService: BackendService,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      err => {
        console.log(err);
        this.cdr.detectChanges();
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
