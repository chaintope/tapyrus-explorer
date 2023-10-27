import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
@NgModule()
export class BackendService {
  backendUrl = 'http://localhost:3001';
  constructor(private http: HttpClient, private configService: ConfigService) {
    if (configService.config && configService.config.backendUrl) {
      this.backendUrl = configService.config.backendUrl;
    }
  }

  getBlocks(page: number, perPage: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/blocks`, {
      params: new HttpParams({
        fromObject: { page: page.toString(), perPage: perPage.toString() }
      })
    });
  }

  searchBlock(query: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/block/${query}`);
  }

  getBlock(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/block/${blockHash}`);
  }

  getBlockByHeight(height: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/block/height/${height}`);
  }

  getRawBlock(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/block/${blockHash}/raw`);
  }

  getBlockTransactions(
    blockHash: string,
    page: number,
    perPage: number
  ): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/block/${blockHash}/txns`, {
      params: new HttpParams({
        fromObject: { page: page.toString(), perPage: perPage.toString() }
      })
    });
  }

  getTransactions(page: number, perPage: number): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/transactions`, {
      params: new HttpParams({
        fromObject: { page: page.toString(), perPage: perPage.toString() }
      })
    });
  }

  getTransaction(txId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/tx/${txId}`);
  }

  getRawTransaction(txId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/tx/${txId}/rawData`);
  }

  getAddressInfo(address: string, lastSeenTxid?: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/address/${address}`, {
      params: new HttpParams({
        fromObject: {
          lastSeenTxid: (lastSeenTxid || '').toString()
        }
      })
    });
  }

  searchTransaction(query: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/tx/${query}/get`);
  }

  getColor(colorId: string, lastSeenTxid?: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/color/${colorId}`, {
      params: new HttpParams({
        fromObject: {
          lastSeenTxid: (lastSeenTxid || '').toString()
        }
      })
    });
  }

  validateOpenedValue(opened_value: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/validate/${opened_value}`);
  }

  checkMaterialTrackingTransaction(txId: string): Observable<any> {
    return this.http.get(
      `${this.backendUrl}/api/check_material_tracking_balance/${txId}`
    );
  }
}
