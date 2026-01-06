import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import Helper from '../app.helper';

@Component({
  selector: 'app-block-rawdata',
  templateUrl: './block-rawdata.page.html',
  styleUrls: ['./block-rawdata.page.scss'],
  standalone: false
})
export class BlockRawdataPage implements OnInit {
  @Input() blockHash: string;
  blockRawData = '';

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private backendService: BackendService,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      err => {
        console.log(err);
        this.cdr.detectChanges();
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
