import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { BlockService } from '../block.service';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {

  //raw results
  accountResults: Account;
  unprocessedBlocksResults: UnprocessedBlocks;
  blockResults: BlockResults;
  representativeResults: Representative;
  weightResults: Weight;
  balanceResults: Balance;
  blockCountResults: BlockCountResults;
  keys: string[];
  //param
  paramsub: any;
  error: string;
  reg = new RegExp('"error"');

  constructor(private messageService: MessageService, private NodeService: NodeService, private route: ActivatedRoute, private accountService: AccountService, private blockService: BlockService) { }

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
      this.accountResults = null;
      this.representativeResults = null;
      this.weightResults = null;
      this.keys = null;
      this.error = null;
      this.balanceResults = null;
      this.blockResults = null;
      this.unprocessedBlocksResults = null;
      this.blockCountResults = null;
      this.getBlockCount();
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

  getBlockCount(): void {
    this.NodeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
        if (this.reg.test(JSON.stringify(this.blockCountResults))) {
          this.error = JSON.stringify(this.blockCountResults['error']);
        }
      });
  }

  formatDecimals(input: number): string {
    const dec = 3;
    return input.toFixed(dec);
  }
  
  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  getUnprocessedBlocks(accountParam: string): void {
    this.accountService.getUnprocessedBlocks(accountParam)
      .subscribe(data => {
        this.unprocessedBlocksResults = data;
        this.blockService.getBlocks(this.unprocessedBlocksResults['blocks'])
          .subscribe(data => {
            this.blockResults = JSON.parse(this.formatContents(JSON.stringify(data)));
            if (this.reg.test(JSON.stringify(this.blockResults))) {
              this.error = JSON.stringify(this.blockResults['error']);
            }
            this.keys = Object.keys(this.blockResults['blocks']);
          });
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

  formatType(type: string, cellID: string): string {
    if (type == "receive") {
      document.getElementById(cellID).classList.add('positive');
      return "+";
    }
    else {
      document.getElementById(cellID).classList.add('negative');
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
  account?: string;
  history?: Transaction[];
  previous?: string;
  error?: string;
}

interface UnprocessedBlocks {
  blocks: string[];
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

interface BlockResults {
  error?: string;
  blocks?: Block[];
}

interface Block {
  [detail: string]: Detail;
}

interface Detail {
  block_account: string;
  amount: string;
  contents: Content;
}
interface Content {
  type: string;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account: string;
  signature: string;
  work: string;
}


interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;  
}