import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';

import { BackendService } from '../backend.service';
import { AppConst } from '../app.const';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.page.html',
  styleUrls: ['./blocks.page.scss'],
  standalone: false
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
    private navCtrl: NavController,
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      err => {
        console.log(err);
        this.hasError = true;
        this.statusCode = err.status;
        this.statusMsg = err.statusText;
        this.detailMsg = err.error;
        this.cdr.detectChanges();
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
    this.navCtrl.navigateForward('/blocks', {
      queryParams: { page: this.page }
    });
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
