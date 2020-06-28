import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class NodeService {
  private sub: any;
  temp: string;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getBlockCount(): Observable<BlockCountResults> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "block_count"
    });

    return this.http.post<BlockResults>(environment.api + "/node", body, options).pipe(
      catchError(this.handleError<BlockCountResults>('getBlockCount', null))
    );
  };

  getBlock(params: string): Observable<BlockResults> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "blocks_info",
      "hashes": [params]
    });

    return this.http.post<BlockResults>(environment.api + "/node", body, options).pipe(
      catchError(this.handleError<BlockResults>('getBlock', null))
    );
  };

  getBlocks(params: string[]): Observable<BlockResults> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "blocks_info",
      "hashes": params
    });


    return this.http.post<BlockResults>(environment.api + "/node", body, options).pipe(
      catchError(this.handleError<BlockResults>('getBlocks', null))
    );
  };

  getAccount(params: string, resultSize: number): Observable<Account> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "account_history",
      "account": "" + params + "",
      "count": "" + resultSize + ""
    });

    return this.http.post<Account>(environment.api + "/node", body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<Account>('getAccount', null))
    );
  };

  getUnprocessedBlocks(params: string, size: number): Observable<UnprocessedBlocks> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "pending",
      "account": "" + params + "",
      "count": "" + size + ""
    });

    return this.http.post<UnprocessedBlocks>(environment.api + "/node", body, options).pipe(
      catchError(this.handleError<UnprocessedBlocks>('getUnprocessedBlock', null))
    );
  };


  getBalance(params: string): Observable<Balance> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify(
      {
        "action": "account_balance",
        "account": "" + params + ""
      }
    );

    return this.http.post<Balance>(environment.api + "/node", body, options).pipe(
      catchError(this.handleError<Balance>('getBalance', null))
    );
  };

  getRepresentative(params: string): Observable<Representative> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.nanoodleNodeUser + ":" + environment.nanoodleNodePassword)
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({
      "action": "account_representative",
      "account": "" + params + ""
    });


    return this.http.post<Representative>(environment.api + "/node", body, options).pipe(
      catchError(this.handleError<Representative>('getRepresentative', null))
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
    this.messageService.add(`Node Service: ${message}`);
  }

  formatDecimals(input: number): string {
    const dec = 3;
    return input.toFixed(dec);
  }
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}

interface NodeVersion {
  rpc_version: string,
  store_version: string,
  node_vendor: string
}

interface Quorum {
  quorum_delta: number,
  online_weight_quorum_percent: number,
  online_weight_minimum: number,
  online_stake_total: number,
  peers_stake_total: number,
  peers_stake_required: number
}

interface Block {
  [detail: string]: Detail;
}

interface BlockResults {
  error?: string;
  blocks?: Block[];
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

interface Transaction {
  type: string;
  account: string;
  amount: number;
  hash: string;
}

interface Account {
  account: string;
  history: Transaction[];
  previous: string;
}

interface UnprocessedBlocks {
  blocks: string[];
}

interface Representative {
  representative: string;
}

interface Weight {
  weight: string;
}

interface Balance {
  balance: string;
  pending: string;
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}