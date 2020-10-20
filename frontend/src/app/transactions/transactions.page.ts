import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { TransactionsModalPage } from '../transactions-modal/transactions-modal.page';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  perPage = 25; // default with 20 per page
  page = 1; // default start with page 1
  pages = 1; // number of pages
  transactions: any = [];
  searchValue: string;
  txCount = 0;
  coins = [{id : 'c396dfd97de19a09479dfceabee57c3f83c99c167683468443c2327da86432efdc' , amount : 11},
  { id : 'c2c99c167683468443c2327da86432efdc96dfd97de19a09479dfceabee57c3f83' , amount : 13.22},
  { id : 'c1e19a09479dfceabee57c3f83c99c167683468443c2327da86432efdc96dfd97d' , amount : 41.73},
  { id : 'TPC' , amount : 50}];


  constructor(private httpClient: HttpClient, private navCtrl: NavController,  private modalCtrl: ModalController ) {}

  ngOnInit() {
    this.getTransactionLists();
  }

  getTransactionLists() {
    this.httpClient
      .get('http://localhost:3001/transactions', {
        params: new HttpParams({
          fromObject: {
            page: this.page.toString(),
            perPage: this.perPage.toString(),
          },
        }),
      })
      .subscribe(
        (data) => {
          const resultData: any = data || {};
          this.transactions = resultData.results || [];
          this.txCount = resultData.txCount;
          this.calculatePagination();
          console.log('trans', this.transactions);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.getTransactionLists();
  }

  onPerPageChange() {
    this.page = 1;
    this.getTransactionLists();
  }

  calculatePagination() {
    this.pages = Math.ceil(this.txCount / this.perPage);
  }

  goToTransaction(txid: string) {
    this.navCtrl.navigateForward(`/transactions/${txid}`);
  }

  onSearch() {
    this.httpClient
      .get(`http://localhost:3001/transaction/${this.searchValue}/get`)
      .subscribe(
        (data) => {
          this.transactions = [data];
          this.pages = 1;
          this.page = 1;
          this.txCount = 1;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async goToTransactionModal() {
    const modal = await this.modalCtrl.create({
      component: TransactionsModalPage,
      componentProps: {
        coins: this.coins
      },
      cssClass: 'raw-data-modal'
    });
    return await modal.present();
  }
}
