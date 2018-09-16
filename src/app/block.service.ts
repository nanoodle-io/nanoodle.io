import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class BlockService {
  private sub: any;
  temp: string;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getBlock(params: string): Observable<Block> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify({
        "action": "block",  
        "hash": "" + params + ""
    });

    return this.http.post<Block>('http://localhost:7076', body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<Block>('getBlock', null))
    );
  };

  private handleError<T> (operation = 'operation', result?: T) {
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

interface Block
{
    contents: Content;
}

interface Content
{
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

interface Block {
  error: string;
}