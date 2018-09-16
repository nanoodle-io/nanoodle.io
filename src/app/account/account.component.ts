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

  //raw results
  accountResults: Account;
  unprocessedBlocksResults: Blocks;
  representativeResults: Representative;
  weightResults: Weight;
  balanceResults: Balance;
  //param
  paramsub: any;
  error: string;
  reg = new RegExp('"error"');

  constructor(private messageService: MessageService, private route: ActivatedRoute, private accountService: AccountService) { }

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
      this.accountResults = null;
      this.unprocessedBlocksResults = null;
      this.representativeResults = null;
      this.weightResults = null;
      this.error = null;
      this.balanceResults = null;
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
        this.accountResults = data;
        if (this.reg.test(JSON.stringify(this.accountResults))) {
          this.error = JSON.stringify(this.accountResults['error']);
        }
      });
  }

  getUnprocessedBlocks(accountParam: string): void {
    this.accountService.getUnprocessedBlocks(accountParam)
      .subscribe(data => {
        this.unprocessedBlocksResults = data;
      });
  }

  getWeight(accountParam: string): void {
    this.accountService.getWeight(accountParam)
      .subscribe(data => {
        this.weightResults = data;
      });
  }

  getBalance(accountParam: string): void {
    this.accountService.getBalance(accountParam)
      .subscribe(data => {
        this.balanceResults = data;
      });
  }

  getRepresentative(accountParam: string): void {
    this.accountService.getRepresentative(accountParam)
      .subscribe(data => {
        this.representativeResults = data;
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
