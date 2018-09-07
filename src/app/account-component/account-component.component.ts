import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService }  from '../account.service';

@Component({
  selector: "app-account",
  templateUrl: "./account-component.component.html"
  
})

export class AccountComponentComponent implements OnInit {
  transactions: transaction[];
  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
        // get account address
        const url = this.route.snapshot.url;
        console.log(url);
       // this.getAccount(this.id);
  }

  getAccount(account: string): void {
      this.accountService.getTransactions(account).subscribe(transactions => this.transactions = transactions);
      }
}

interface transaction {
  type: string;
  account: string;
  amount: string;
  hash: string;
 }