import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class BlockService {
  private sub: any;
  temp: string;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getBlock(params: string): Observable<BlockResults> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "blocks_info",
      "hashes": [params]
    });

    return this.http.post<BlockResults>(environment.serverUrl, body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<BlockResults>('getBlock', null))
    );
  };
  
  getBlockTime(hash: string): Observable<BlockTime[]> {

    const httpOptions = {
      params: new HttpParams({
        fromString: "keys={'log.dateTime':1}&keys={'log.epochTimeStamp':1}&filter={'hash':'" + hash + "'}&sort={'log.dateTime':1}&pagesize=1&np"
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
        })
        };

    return this.http.get<BlockTime[]>(environment.api, httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<BlockTime[]>('getBlockTime', null))
    );
  };

  getBlocks(params: string[]): Observable<BlockResults> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "blocks_info",
      "hashes": params
    });


    return this.http.post<BlockResults>(environment.serverUrl, body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<BlockResults>('getBlock', null))
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
    this.messageService.add(`Block Service: ${message}`);
  }


  formatDecimals(input: number): string {
    const dec = 3;
    return input.toFixed(dec);
  }

}

interface BlockResults {
  error?: string;
  blocks?: Block[];
}

interface BlockTime {
  _id: string;
  log: Time;
}

interface Time {
  dateTime: string;
  epochTimeStamp: DateTime;
}

interface DateTime {
  $date: DateTime;
}

interface Block {
  [detail: string]: Detail;
}

interface UnprocessedBlocks {
  blocks: string[];
}

interface Detail {
  block_account: string;
  amount: string;
  contents: Content;
}
interface Content {
  type: string;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account: string;
  signature: string;
  work: string;
}


interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}