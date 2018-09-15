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

  //display/extracted values
  transactions: Transaction[];
  hashes: string[];
  representative: string;
  weight: string;
  balance: string;
  pending: string;
  //raw results
  account: Account;
  blocks: Blocks;
  representativeResults: Representative;
  weightResults: Weight;
  BalanceResults: Balance;
  //param
  paramsub: any;

  constructor(private messageService: MessageService, private route: ActivatedRoute, private accountService: AccountService) { }

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
      this.account = null;
      this.blocks = null;
      this.representative = null;
      this.weight = null;
      this.balance = null;
      this.pending = null;
      this.getAccount(sub['id']);
      this.getUnprocessedBlocks(sub['id']);
      this.getRepresentative(sub['id']);
      this.getWeight(sub['id']);
      this.getBalance(sub['id']);
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

  getUnprocessedBlocks(accountParam: string): void {
    this.accountService.getUnprocessedBlocks(accountParam)
      .subscribe(data => {
        this.blocks = data;
        //this.log(`found account matching "${JSON.stringify(this.account)}"`);
        this.hashes = this.blocks['blocks'];
        //this.log(`found account transactions matching "${JSON.stringify(this.transactions)}"`);
      });
  }

  getWeight(accountParam: string): void {
    this.accountService.getWeight(accountParam)
      .subscribe(data => {
        this.weightResults = data;
        //this.log(`found account matching "${JSON.stringify(this.representative)}"`);
        this.weight = this.weightResults['weight'];
        //this.log(`found account transactions matching "${JSON.stringify(this.transactions)}"`);
      });
  }

  getBalance(accountParam: string): void {
    this.accountService.getBalance(accountParam)
      .subscribe(data => {
        this.BalanceResults = data;
        //this.log(JSON.stringify(this.BalanceResults);
        this.balance = this.BalanceResults['balance'];
        this.pending = this.BalanceResults['pending'];
        //this.log(`found account transactions matching "${JSON.stringify(this.transactions)}"`);
      });
  }

  getRepresentative(accountParam: string): void {
    this.accountService.getRepresentative(accountParam)
      .subscribe(data => {
        this.representativeResults = data;
        //this.log(`found account matching "${JSON.stringify(this.representative)}"`);
        this.representative = this.representativeResults['representative'];
        //this.log(`found account transactions matching "${JSON.stringify(this.transactions)}"`);
      });
  }

  formatAmount(mRai: number): string {
    const dec = 2;
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
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

interface Blocks {
  hash: string[];
}

interface Representative {
  representative: string;
}

interface Weight {
  weight: string;
}

interface Balance {
  balance: string;
  pending: string;
}
