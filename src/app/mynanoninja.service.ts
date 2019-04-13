import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class MyNanoNinjaService {
  private sub: any;
  ninjaUrl = 'https://mynano.ninja/api/accounts'

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getAliases() {
    return this.http.get(this.ninjaUrl+"/aliases").pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('getAliases', null))
    );
  };

  getAccountDetails(accountInput: string) {
    return this.http.get(this.ninjaUrl+"/"+accountInput).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('getAliases', null))
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
    this.messageService.add(`My Nano Ninja Service: ${message}`);
  }

}