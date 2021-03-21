import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { BlockRawdataPage } from '../block-rawdata/block-rawdata.page';
import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';

@Component({
  selector: 'app-block',
  templateUrl: './block.page.html',
  styleUrls: ['./block.page.scss'],
  providers: [BackendService]
})
export class BlockPage implements OnInit {
  blockHash: string;
  block: any = {};
  blockTxns: any = {};
  openTxns = false;
  perPage = AppConst.PER_PAGE_COUNT;
  page = 1; // default start with page 1
  pages = 1; // number of pages

  txConfirmation: number;
  txTime: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.blockHash = this.activatedRoute.snapshot.paramMap.get('hash');
    this.getBlockInfo();
  }

  getBlockInfo() {
    this.backendService.getBlock(this.blockHash).subscribe(
      data => {
        this.block = data || {};
        this.calculatePagination();
      },
      err => {
        console.log(err);
      }
    );
  }

  goToBlocks() {
    this.navCtrl.navigateBack('/blocks');
  }

  goToBlock(hash: string) {
    this.navCtrl.navigateForward(`/block/${hash}`);
  }

  async goToBlockRawData() {
    const modal = await this.modalCtrl.create({
      component: BlockRawdataPage,
      componentProps: {
        blockHash: this.blockHash
      },
      cssClass: 'raw-data-modal'
    });
    return await modal.present();
  }

  getBlockTxnsInfo() {
    this.backendService
      .getBlockTransactions(this.blockHash, this.page, this.perPage)
      .subscribe(
        data => {
          this.blockTxns = data || {};
          this.txTime = this.blockTxns.time;
          this.openTxns = true;
          this.calculateTotal();
        },
        err => {
          console.log(err);
        }
      );
  }

  closeTxns() {
    this.openTxns = false;
  }

  calculatePagination() {
    this.pages = Math.ceil(this.block.ntx / this.perPage);
  }

  calculateTotal() {
    this.blockTxns.forEach(tx => {
      tx.totalVout = tx.vout.reduce((sum, output) => {
        return sum + output.value;
      }, 0);
    });
  }

  goToAddress(add = '') {
    this.navCtrl.navigateForward(`/addresses/${add}`);
  }

  goToTransaction(txid = '') {
    this.navCtrl.navigateForward(`/tx/${txid}`);
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.getBlockTxnsInfo();
  }
}
