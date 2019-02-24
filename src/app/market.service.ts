import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})

export class MarketService {
  //x minutes either side
  minutes: number = 3;
  private sub: any;
  greaterThan: number;
  lessThan: number;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getMarketPrice(timestamp: number, currencyType: string) {
    this.greaterThan = timestamp - (1000 * 60 * this.minutes);
    this.lessThan = timestamp + (1000 * 60 * this.minutes);

    const httpOptions = {
      params: new HttpParams({
        fromString: "filter={'log.epochTimeStamp':{$gte: new Date(" + this.greaterThan + ")}}&filter={'log.epochTimeStamp':{$lte: new Date(" + this.lessThan + ")}}&filter={'" + currencyType + "': {'$exists': true }}&np"
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
      })
    };

    return this.http.get(environment.price, httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('getMarketPrice', null))
    );
  };

  getLastMarketPrice() {
    const httpOptions = {
      params: new HttpParams({
        fromString: "keys={'log.epochTimeStamp':1}&sort={'_id':-1}&pagesize=1&np"
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
      })
    };

    return this.http.get(environment.price, httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('getLastMarketPrice', null))
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
    this.messageService.add(`Market Service: ${message}`);
  }

}