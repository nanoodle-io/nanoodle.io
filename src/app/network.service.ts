import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class NetworkService {
  greaterThan: number;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getDailyChartData(daysPrevious: number): Observable<Object[]>{
    let nowDate = new Date();
    this.greaterThan = nowDate.getTime() - (daysPrevious * 24 * (1000 * 60 * 60));

    const httpOptions = {
      params: new HttpParams({
        fromString: "filter={'log.epochTimeStamp':{$gte: new Date(" + this.greaterThan + ")}}&sort={'_id':1}&pagesize=1000&np"
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
      })
    };

    return this.http.get(environment.reportingDay, httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('getTrx', null))
    );
  };

  getHourlyChartData(hoursPrevious: number): Observable<Object[]>{
    let nowDate = new Date();
    this.greaterThan = nowDate.getTime() - (hoursPrevious * (1000 * 60 * 60));

    const httpOptions = {
      params: new HttpParams({
        fromString: "filter={'log.epochTimeStamp':{$gte: new Date(" + this.greaterThan + ")}}&sort={'_id':1}&pagesize=1000&np"
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
      })
    };

    return this.http.get(environment.reporting, httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('getTrx', null))
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