import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { MessageService } from '../message.service';

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  transactions: Transaction[];
  account: Account;
  paramsub: any;

  constructor(private messageService: MessageService, private route: ActivatedRoute, private accountService: AccountService) { }

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
      this.getAccount(sub['id']);
    });
  }

  getAccount(accountParam: string): void {
    this.accountService.getAccount(accountParam)
    .subscribe(data => {
    this.account = data;
    //this.log(`found account matching "${JSON.stringify(this.account)}"`);
    this.transactions = this.account['history'];
    //this.log(`found account transactions matching "${JSON.stringify(this.transactions)}"`);
    });
  }

  formatAmount(mRai: number): string {
    const dec = 2;
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw ;
    return temp.toFixed(dec);
  }

  formatType(type: string): string {
    if (type == "receive") {
      return "+";
    }
    else {
      return "-";
    }
  }

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }
}

interface Transaction {
  type: string;
  account: string;
  amount: number;
  hash: string;
}

interface Account {
  account: string;
  history: Transaction[];
  previous: string;
}