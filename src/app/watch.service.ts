import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})

export class WatchService {
  private sub: any;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  putWatch(account: string, email: string) {
    let response = "";
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
      "email": "" + email + "",
      //0 - 1 - Verification email not sent, 1 - Verification email sent, 2 - Verified
      "verified": "0",
      "key": "" + makeKey() + ""
    });

    return this.http.post(environment.watch, body, options);
  }

  removeWatcher(unsubscribe: string) {
    const httpOptions = {
      params: new HttpParams({
        fromString: "filter={'key':'" + unsubscribe + "'}"
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
      })
    };

    return this.http.delete(environment.watch+"/*", httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('removeWatcher', null))
    );
  };

  verifyWatcher(verifyKey: string) {
    
    let body = JSON.stringify({
      "verified": "" + 2 + "" 
    });

    const httpOptions = {
      params: new HttpParams({
        //change to verified state
        fromString: 'filter={"key":"' + verifyKey + '"}'
      }),
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
      })
    };

    return this.http.patch(environment.watch+"/*", body,httpOptions).pipe(
      //tap(_ => this.log(`found account matching "${params}"`)),
      catchError(this.handleError('verifyWatcher', null))
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

function makeKey() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}