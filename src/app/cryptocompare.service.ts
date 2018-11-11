import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class CryptoCompareService {
  cryptocompareUrl = '';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getPrice(currencyType: string ): Observable<FiatResults> {
    this.cryptocompareUrl = 'https://min-api.cryptocompare.com/data/price?fsym=NANO&tsyms=' + currencyType + '&extraParams=nanoodle.io';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    let options = {
      headers: httpHeaders
    };
    return this.http.get<FiatResults>(this.cryptocompareUrl, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<FiatResults>('getPrice', null))
    );
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`CryptoCompare Service: ${message}`);
  }

}

interface FiatResults {
  [currencyType: string]: number;
}