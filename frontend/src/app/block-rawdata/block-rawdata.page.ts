import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { BackendService } from '../backend.service';
import Helper from '../app.helper';

@Component({
  selector: 'app-block-rawdata',
  templateUrl: './block-rawdata.page.html',
  styleUrls: ['./block-rawdata.page.scss'],
  providers: [BackendService]
})
export class BlockRawdataPage implements OnInit {
  @Input() blockHash: string;
  blockRawData = '';

  constructor(
    private navParams: NavParams,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.blockHash = this.navParams.get('blockHash');
    this.getBlockRawData();
  }

  getBlockRawData() {
    this.backendService.getRawBlock(this.blockHash).subscribe(
      data => {
        const result: any = data || '';
        this.blockRawData = result['hex'];
      },
      err => {
        console.log(err);
      }
    );
  }

  copyBlockRawData() {
    Helper.copy(this.toastController, this.blockRawData);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
