import { Injectable, OnDestroy } from '@angular/core'; 
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root',
})

export class AccountService implements OnDestroy {
  private sub: any;
  private transactions$: Observable<transaction[]>;
 
  constructor(private messageService: MessageService, private http: HttpClient) { }
 
  getTransactions(params: string)  {    
      let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'});    
    
      let options = {
      headers: httpHeaders
         };

      //console.log("Account Service Parameters: "+params);
      let body = JSON.stringify({
      "action": "account_history",  
      "account": ""+params+"",  
      "count": "-1"});

      this.http.post('http://localhost:7076', body, options).subscribe(data => {
      //console.log("Account Service Transaction JSON: "+data['history']);
      this.transactions$ = data['history'];
      //console.log("Account Service Transaction Objects: "+this.transactions);
      }, error => console.log('There was an error: '));
        
      return of(this.transactions$); 
    };

   ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

interface transaction {
  type: string;
  account: string;
  amount: number ;
  hash: string;
 }
 


