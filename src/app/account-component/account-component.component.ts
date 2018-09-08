import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService }  from '../account.service';
import { Observable } from 'rxjs';

@Component({
  selector: "app-account",
  templateUrl: "./account-component.component.html"
  
})

export class AccountComponentComponent implements OnInit {
  transactions$: Observable<transaction[]>;
  account: string;
  paramsub: any;
  responsesub: any;

  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {this.account = sub['id']});

    this.getAccount(this.account);
  }

  getAccount(account: string): void {
      this.responsesub = this.accountService.getTransactions(account).subscribe(transactions$ => this.transactions$ = transactions$);
      }

      ngOnDestroy() {
        this.paramsub.unsubscribe();
        this.responsesub.unsubscribe();
      }
}

interface transaction {
  type: string;
  account: string;
  amount: string;
  hash: string;
 }