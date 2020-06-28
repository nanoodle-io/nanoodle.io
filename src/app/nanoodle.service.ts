import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class NanoodleService {
  greaterThan: number;

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getDailyChartData(): Observable<Object[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "X-Api-Key": environment.nanoodleKeyAWS
      })
    };

    return this.http.get(environment.api + "/statsdaily", httpOptions).pipe(
      catchError(this.handleError('getDailyChartData', null))
    );
  };

  getHourlyChartData(): Observable<Object[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "X-Api-Key": environment.nanoodleKeyAWS
      })
    };

    return this.http.get(environment.api + "/statshourly", httpOptions).pipe(
      catchError(this.handleError('getHourlyChartData', null))
    );
  };

  getPrice(timestamp: Date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "X-Api-Key": environment.nanoodleKeyAWS
      })
    };

    return this.http.get(environment.api + "/price?isoDateString=" + encodeURIComponent(timestamp.toISOString()), httpOptions).pipe(
      catchError(this.handleError('getPrice', null))
    );
  };

  formatAmount(type: string, amount: number, returnSymbol: boolean): string {
    //Mnano
    if (type == 'XRB') {
      let raw = 1000000000000000000000000000000;

      let temp = amount / raw;
      if (returnSymbol) {
        return temp.toFixed(2);
      }
      else {
        return temp.toFixed(2);

      }
    }
    //nano
    else if (type == 'XNO') {
      let raw = 1000000000000000000000000000;
      let temp = amount / raw;
      if (returnSymbol) {
        return '₦' + temp.toFixed(0);
      }
      else {
        return temp.toFixed(0);
      }
    }
    else if (type == 'ETH') {
      if (returnSymbol) {
        return 'Ξ' + amount.toFixed(6);
      }
      else {
        return amount.toFixed(6);
      }
    }
    else if (type == 'BTC') {
      if (returnSymbol) {
        return '₿' + amount.toFixed(6);
      }
      else {
        return amount.toFixed(6);
      }
    }
    else if (type == 'JPY') {
      if (returnSymbol) {

        return '¥' + amount.toFixed(0);
      }
      else {
        return amount.toFixed(0);
      }
    }
    else if (type == 'CNY') {
      if (returnSymbol) {

        return '¥' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'GHS') {
      if (returnSymbol) {

        return 'Gh₵' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'NGN') {
      if (returnSymbol) {

        return '₦' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'USD') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }

      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'SEK') {
      if (returnSymbol) {

        return amount.toFixed(2) + 'kr';
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'CHF') {
      if (returnSymbol) {

        return '₣' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'ZAR') {
      if (returnSymbol) {

        return 'R' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'EUR') {
      if (returnSymbol) {

        return '€' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'GBP') {
      if (returnSymbol) {

        return '£' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'CAD') {
      if (returnSymbol) {

        return 'C$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'MXN') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'AUD') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'BRL') {
      if (returnSymbol) {

        return 'R$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'VES') {
      if (returnSymbol) {

        return 'Bs.' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'PEN') {
      if (returnSymbol) {

        return 'S/.' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'VND') {
      if (returnSymbol) {

        return amount.toFixed(2) + '₫';
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'TRY') {
      if (returnSymbol) {

        return '₺' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'INR') {
      if (returnSymbol) {

        return '₹' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'COP') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'ARS') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else {
      return amount.toFixed(2);
    }
  }
  
  getNetworkStats(timestamp: Date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "X-Api-Key": environment.nanoodleKeyAWS
      })
    };

    return this.http.get(environment.api + "/network?isoDateString=" + encodeURIComponent(timestamp.toISOString()), httpOptions).pipe(
      catchError(this.handleError('getNetworkStats', null))
    );
  };

  getBlockCount(previousSeconds: number): Observable<any> {
    let paramDate = new Date(new Date().getTime() - (previousSeconds * 1000));
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "X-Api-Key": environment.nanoodleKeyAWS
      })
    };

    return this.http.get(environment.api + "/recentblocks?isoDateString=" + encodeURIComponent(paramDate.toISOString()), httpOptions).pipe(
      catchError(this.handleError('getBlockCount', null))
    );
  }

  getBlockTime(hash: string): Observable<BlockTime> {
    let paramHash = hash;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "X-Api-Key": environment.nanoodleKeyAWS
      })
    };

    return this.http.get(environment.api + "/blocktime?blockHash=" + encodeURIComponent(paramHash), httpOptions).pipe(
      catchError(this.handleError('getBlockCount', null))
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
    this.messageService.add(`Nanoodle Service: ${message}`);
  }

  putWatch(account: string, email: string) {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Basic " + btoa(environment.dbUser + ":" + environment.dbPassword)
    });

    let options = {
      headers: httpHeaders
    };

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

}


interface BlockTime {
  Items: Time[];
}

interface Time {
  blockTimeStamp: string;
}

function makeKey() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}