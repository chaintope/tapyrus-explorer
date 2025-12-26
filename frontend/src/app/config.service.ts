import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, retry, shareReplay, tap } from 'rxjs/operators';

/***
 * Config service to supply configuration items from assets/config.json file.
 * This module based the tutorial https://angular.jp/guide/http .
 */

export interface Config {
  backendUrl: string;
  project: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  configUrl = 'assets/config.json';
  config: Config;
  private configObservable$: Observable<Config>;

  constructor(private http: HttpClient) {}

  load(): Promise<Config> {
    return firstValueFrom(this.getConfig());
  }

  getConfig(): Observable<Config> {
    if (this.config) {
      return new Observable(observer => {
        observer.next(this.config);
        observer.complete();
      });
    }

    if (!this.configObservable$) {
      this.configObservable$ = this.http.get<Config>(this.configUrl).pipe(
        retry(3),
        tap(config => {
          this.config = config;
        }),
        shareReplay(1),
        catchError(this.handleError)
      );
    }

    return this.configObservable$;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
