import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AccountService {
  private sub: any;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getAccount(params: string): Observable<Account> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify({
      "action": "account_history",
      "account": "" + params + "",
      "count": "100"
    });

    return this.http.post<Account>('http://localhost:7076', body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<Account>('getAccount', null))
    );
  };

  getUnprocessedBlocks(params: string): Observable<Blocks> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify({
      "action": "pending",
      "account": "" + params + "",
      "count": "100"
    });

    return this.http.post<Blocks>('http://localhost:7076', body, options).pipe(
      //tap(_ => this.log(`found blocks matching "${params}"`)),
      catchError(this.handleError<Blocks>('getUnprocessedBlock', null))
    );
  };

  getBalance(params: string): Observable<Balance> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify(
    {  
      "action": "account_balance",  
      "account": "" +params + ""  
    }
    );

    return this.http.post<Balance>('http://localhost:7076', body, options).pipe(
      //tap(_ => this.log(`found balance matching "${params}"`)),
      catchError(this.handleError<Balance>('getBalance', null))
    );
  };

  getRepresentative(params: string): Observable<Representative> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify({
      "action": "account_representative",
      "account": "" + params + ""
    });


    return this.http.post<Representative>('http://localhost:7076', body, options).pipe(
      //tap(_ => this.log(`found representative matching "${params}"`)),
      catchError(this.handleError<Representative>('getRepresentative', null))
    );
  };

  getWeight(params: string): Observable<Weight> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify({
      "action": "account_weight",
      "account": "" + params + ""
    });

    return this.http.post<Weight>('http://localhost:7076', body, options).pipe(
      //tap(_ => this.log(`found weight matching "${params}"`)),
      catchError(this.handleError<Weight>('getWeight', null))
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
    this.messageService.add(`Account Service: ${message}`);
  }
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

interface Blocks {
  hash: string[];
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

