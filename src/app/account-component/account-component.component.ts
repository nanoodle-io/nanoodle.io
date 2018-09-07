import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService }  from '../account.service';

@Component({
  selector: "app-account",
  templateUrl: "./account-component.component.html"
  
})

export class AccountComponentComponent implements OnInit {
  transactions: transaction[];
  account: string;
  sub: any;
  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(sub => {this.account = sub['id']});

    this.getAccount(this.account);
  }

  getAccount(account: string): void {
      this.accountService.getTransactions(account).subscribe(transactions => this.transactions = transactions);
      }

      ngOnDestroy() {
        this.sub.unsubscribe();
      }
}

interface transaction {
  type: string;
  account: string;
  amount: string;
  hash: string;
 }