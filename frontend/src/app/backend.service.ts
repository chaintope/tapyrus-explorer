import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';

@Injectable()
export class BackendService {
  backendUrl = 'http://localhost:3001';
  constructor(private http: HttpClient, private configService: ConfigService) {
    if (configService.config && configService.config.backendUrl) {
      this.backendUrl = configService.config.backendUrl;
    }
  }

  getBlocks(page: number, perPage: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/blocks`, {
      params: new HttpParams({
        fromObject: { page: page.toString(), perPage: perPage.toString() }
      })
    });
  }

  searchBlock(query: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${query}`);
  }

  getBlock(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${blockHash}`);
  }

  getRawBlock(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${blockHash}/raw`);
  }

  getBlockTransactions(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${blockHash}/txns`);
  }

  getTransactions(page: number, perPage: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/transactions`, {
      params: new HttpParams({
        fromObject: { page: page.toString(), perPage: perPage.toString() }
      })
    });
  }

  getTransaction(txId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/tx/${txId}`);
  }

  getRawTransaction(txId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/tx/${txId}/rawData`);
  }

  getAddressInfo(address: string, lastSeenTxid?: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/address/${address}`, {
      params: new HttpParams({
        fromObject: {
          lastSeenTxid: (lastSeenTxid || '').toString()
        }
      })
    });
  }

  searchTransaction(query: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/tx/${query}/get`);
  }
}
