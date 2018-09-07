import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService }  from '../account.service';

@Component({
  selector: "app-account",
  templateUrl: "./account-component.component.html"
  
})

export class AccountComponentComponent implements OnInit {
  transactions: transaction[];
  private id: string;

  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
        // get account address
        this.id = this.route.snapshot.paramMap.get('id');
        this.getAccount(this.id);
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