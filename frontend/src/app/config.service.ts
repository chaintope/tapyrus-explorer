import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, retry } from 'rxjs/operators';

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
  observable: Observable<Config>;

  constructor(private http: HttpClient) {}

  load() {
    return this.getConfig().subscribe(
      (config: Config) => {
        this.config = config;
      },
      error => console.error(error)
    );
  }

  getConfig(): Observable<Config> {
    if (this.config && this.observable) {
      return new Observable(observer => {
        observer.next(this.config);
        observer.complete();
      });
    } else {
      return (this.observable = this.loadConfig());
    }
  }

  private loadConfig(): Observable<Config> {
    return this.http.get<Config>(this.configUrl).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
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
