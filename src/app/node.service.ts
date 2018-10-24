import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class NodeService {
  private sub: any;
  temp: string;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getBlockCount(): Observable<BlockCountResults> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({  
      "action": "block_count"  
    });


    return this.http.post<BlockCountResults>(environment.serverUrl, body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<BlockCountResults>('getBlockCount', null))
    );
  };

  getVersion(): Observable<NodeVersion> {

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: httpHeaders
    };

    let body = JSON.stringify({  
      "action": "version" 
        });


    return this.http.post<NodeVersion>(environment.serverUrl, body, options).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError<NodeVersion>('getBlockCount', null))
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
    this.messageService.add(`Representative Service: ${message}`);
  }
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;  
}

interface NodeVersion {
  rpc_version : string,
  store_version : string,
  node_vendor : string
}

interface FrontierResults {
  error?: string;
  count?: number;
}