import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Config, ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
@NgModule()
export class BackendService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getBlocks(page: number, perPage: number): Observable<any> {
    return this.request('/api/blocks');
  }

  searchBlock(query: string): Observable<any> {
    return this.request(`/api/block/${query}`);
  }

  getBlock(blockHash: string): Observable<any> {
    return this.request(`/api/block/${blockHash}`);
  }

  getBlockByHeight(height: number): Observable<any> {
    return this.request(`/api/block/height/${height}`);
  }

  getRawBlock(blockHash: string): Observable<any> {
    return this.request(`/api/block/${blockHash}/raw`);
  }

  getBlockTransactions(
    blockHash: string,
    page: number,
    perPage: number
  ): Observable<any> {
    return this.request(`/api/block/${blockHash}/txns`, new HttpParams({
      fromObject: { page: page.toString(), perPage: perPage.toString() }
    }));
  }

  getTransactions(page: number, perPage: number): Observable<any> {
    return this.request('/api/transactions', new HttpParams({
      fromObject: { page: page.toString(), perPage: perPage.toString() }
    }));
  }

  getTransaction(txId: string): Observable<any> {
    return this.request(`/api/tx/${txId}`);
  }

  getRawTransaction(txId: string): Observable<any> {
    return this.request(`/api/tx/${txId}/rawData`);
  }

  getAddressInfo(address: string, lastSeenTxid?: string): Observable<any> {
    return this.request(`/api/address/${address}`, new HttpParams({
      fromObject: {
        lastSeenTxid: (lastSeenTxid || '').toString()
      }
    }));
  }

  searchTransaction(query: string): Observable<any> {
    return this.request(`/api/tx/${query}/get`);
  }

  getColors(lastSeenColorId?: string): Observable<any> {
    return this.request('/api/colors', new HttpParams({
      fromObject: {
        lastSeenColorId: (lastSeenColorId || '').toString()
      }
    }));
  }

  getColor(colorId: string, lastSeenTxid?: string): Observable<any> {
    return this.request(`/api/color/${colorId}`, new HttpParams({
      fromObject: {
        lastSeenTxid: (lastSeenTxid || '').toString()
      }
    }));
  }

  validateOpenedValue(opened_value: string): Observable<any> {
    return this.request(`/api/validate/${opened_value}`);
  }

  checkMaterialTrackingTransaction(txId: string): Observable<any> {
    return this.request(`/api/check_material_tracking_balance/${txId}`);
  }

  private request(url: string, params?: HttpParams): Observable<any> {
    return this.getConfig().pipe(
      mergeMap((config: Config) => {
        return this.http.get(`${config.backendUrl}/${url}`, { params });
      })
    );
  }

  private getConfig(): Observable<Config> {
    return this.configService.getConfig();
  }
}
