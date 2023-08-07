import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  providers: [BackendService]
})
export class TransactionsPage implements OnInit {
  perPage = AppConst.PER_PAGE_COUNT;
  page = 1; // default start with page 1
  pages = 1; // number of pages
  transactions: any = [];
  searchValue: string;
  txCount = 0;
  hasError: boolean;
  statusCode: string;
  statusMsg: string;
  detailMsg: string;

  constructor(
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.getTransactionLists();
  }

  getTransactionLists() {
    this.resetError();
    this.backendService.getTransactions(this.page, this.perPage).subscribe(
      data => {
        const resultData: any = data || {};
        this.transactions = resultData.results || [];
        this.txCount = resultData.txCount;
        this.calculatePagination();
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

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.getTransactionLists();
  }

  calculatePagination() {
    this.pages = Math.ceil(this.txCount / this.perPage);
  }

  goToTransaction(txid: string) {
    this.navCtrl.navigateForward(`/tx/${txid}`);
  }

  onSearch() {
    this.resetError();
    if (this.searchValue == null || this.searchValue.length === 0) {
      this.getTransactionLists();
    } else {
      this.backendService.searchTransaction(this.searchValue).subscribe(
        data => {
          this.goToTransaction(data.txid);
        },
        err => {
          this.hasError = true;
          this.statusCode = err.status;
          this.statusMsg = err.statusText;
          this.detailMsg = err.error;
        }
      );
    }
  }

  resetError() {
    this.hasError = false;
    this.statusCode = null;
    this.statusMsg = null;
    this.detailMsg = null;
  }
}
