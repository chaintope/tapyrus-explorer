import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.page.html',
  providers: [BackendService],
  styleUrls: ['./blocks.page.scss']
})
export class BlocksPage implements OnInit {
  perPage = AppConst.PER_PAGE_COUNT;
  page = 1; // default start with page 1
  pages = 1; // number of pages
  blocks: any = [];
  searchValue: string;
  bestHeight = 0;
  hasError: boolean;
  statusCode: string;
  statusMsg: string;
  detailMsg: string;

  constructor(
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.page = Math.max(Number(params.get('page')), 1);
    });
    this.getBlockLists();
  }

  getBlockLists() {
    this.resetError();
    this.backendService.getBlocks(this.page, this.perPage).subscribe(
      data => {
        const resultData: any = data || {};
        const txnsData: any = resultData.results || [];
        this.blocks = txnsData.sort(this.compareHeight);
        this.bestHeight = resultData.bestHeight;
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

  compareHeight(a: any, b: any) {
    if (a.height < b.height) {
      return 1;
    } else {
      return -1;
    }
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.getBlockLists();
  }

  calculatePagination() {
    this.pages = Math.ceil((this.bestHeight + 1) / this.perPage);
  }

  goToBlock(hash: string) {
    this.navCtrl.navigateForward(`/block/${hash}`);
  }

  onSearch() {
    this.resetError();
    if (this.searchValue == null || this.searchValue.length === 0) {
      this.getBlockLists();
    } else {
      this.backendService.searchBlock(this.searchValue).subscribe(
        data => {
          this.goToBlock(data.blockHash);
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
