import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})

export class WatchService {
  private sub: any;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  putWatch(account: string, email: string): void {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
    });

    let options = {
      headers: httpHeaders
    };

    //console.log("Account Service Parameters: "+params);
    let body = JSON.stringify({
      "account": "" + account + "",
      "email": "" + email + ""
    });

    this.http.post(environment.watch, body, options).subscribe(
      data => {
        console.log("POST Request is successful ", data);
      },
      error => {
        console.log("Error", error);
      }
    );
  };

  getWatchers() {
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