import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NanoodleService } from '../nanoodle.service';
import { MessageService } from '../message.service';
import { MyNanoNinjaService } from '../mynanoninja.service';
import { NodeService } from '../node.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
const accountAmount = 50;
const receiveAmount = 50;

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
  currencyType: string;
  pastRate: number;
  receiveAmount: number = receiveAmount;
  accountAmount: number = accountAmount;
  copied: boolean;
  votingWeight: number;
  nanoUrl: SafeUrl;
  tempRate: FiatResults;
  repScore: string;
  utcOffset: string;
  repDelegators: string;
  repLastVoted: string;
  error: string;
  repUptime: number;
  blockTime: BlockTime;
  transactions: Transaction[];
  priceResults: number;
  alias: Object;
  temp: Object;
  balanceResults: Balance;
  keys: string[];
  identifier: string;
  //param
  paramsub: any;
  reg = new RegExp('"error"');

  constructor(private sanitizer: DomSanitizer, private messageService: MessageService, private myNanoNinjaService: MyNanoNinjaService, private nanoodleService: NanoodleService, private nodeService: NodeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
      this.identifier = sub['id'].replace(/^xrb/, 'nano');
      //check if the local storage has the currency set
      let storedCurrency = localStorage.getItem('currencyType');
      if (storedCurrency != null) {
        this.currencyType = storedCurrency;
      }
      else {
        this.currencyType = 'GBP';
      }
      this.accountResults = null;
      this.representativeResults = null;
      this.weightResults = null;
      this.keys = null;
      this.error = null;
      this.votingWeight = null;
      this.temp = new Object();
      this.alias = null;
      this.copied = false;
      let tz = Math.floor(new Date().getTimezoneOffset() / -60);
      if (tz > -1) {
        this.utcOffset = "+" + tz;
      }
      else {
        this.utcOffset = "" + tz;
      }
      this.balanceResults = null;
      this.blockResults = null;
      this.unprocessedBlocksResults = null;
      this.repScore = null;
      this.repDelegators = null;
      this.repLastVoted = null;
      this.repUptime = null;
      this.transactions = [];
      this.getPrice();
      this.getAliases();
      this.getAccount(this.identifier, this.accountAmount);
      this.getUnprocessedBlocks(this.identifier, this.receiveAmount);
      this.getRepresentative(this.identifier);
      this.getBalance(this.identifier);
      this.nanoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("nano:" + this.identifier);
    });
  }

  clearSavedAccount(): void {
    localStorage.removeItem('account');
  }

  saveAccount(): void {
  localStorage.setItem('account', this.identifier);
  }

  getAliases(): void {
    try {
      this.myNanoNinjaService.getAliases()
        .subscribe(data => {
          if (data != null) {
            for (var i = 0; i < data.length; i++) {
              this.temp[data[i]['account']] = data[i]['alias'];
            }
          }
          this.alias = this.temp;
        });
    } catch (error) {

    }
  }

  getAccountDetails(account: string): void {
    try {
      this.myNanoNinjaService.getAccountDetails(account)
        .subscribe(data => {
          if (data.hasOwnProperty('votingweight')) {
            this.votingWeight = data['votingweight'];
          }
          if (data.hasOwnProperty('score')) {
            this.repScore = data['score'];
          }
          if (data.hasOwnProperty('delegators')) {
            this.repDelegators = data['delegators'];
          }
          if (data.hasOwnProperty('lastVoted')) {
            this.repLastVoted = data['lastVoted'];
          }
          if (data.hasOwnProperty('uptime')) {
            this.repUptime = +data['uptime'];
          }
        });
    } catch (error) {

    }
  }

  getPrice() {
    localStorage.setItem('currencyType', this.currencyType);
    this.priceResults = null;
    this.nanoodleService.getPrice(new Date())
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate[this.currencyType];
          }
          this.priceResults = returnRate / results.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }



  hasAlias(account: string): boolean {
    if (account in this.alias) {
      return true;
    }
    else {
      return false;
    }
  }

  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  getAccount(accountParam: string, size: number): void {
    this.nodeService.getAccount(accountParam, size)
      .subscribe(data => {
        this.accountResults = data;
        for (var i = 0; i < this.accountResults['history'].length; i++) {
          let tempTransaction = {
            "timestamp": 0,
            "hash": this.accountResults['history'][i]['hash'],
            "type": this.accountResults['history'][i]['type'],
            "account": this.accountResults['history'][i]['account'],
            "amount": this.accountResults['history'][i]['amount']
          }
          this.transactions.push(tempTransaction);
        }
      })
  }

  checkAccountStored(): boolean {
    if (localStorage.hasOwnProperty('account') && localStorage['account'] && localStorage['account']==this.identifier)
    {
      return true;
    }
    return false;
  }

  getUnprocessedBlocks(accountParam: string, size: number): void {
    this.nodeService.getUnprocessedBlocks(accountParam, size)
      .subscribe(data => {
        this.unprocessedBlocksResults = data;
        this.nodeService.getBlocks(this.unprocessedBlocksResults['blocks'])
          .subscribe(data => {
            this.blockResults = JSON.parse(this.formatContents(JSON.stringify(data)));
            this.keys = Object.keys(this.blockResults['blocks']);
            for (var i = 0; i < this.keys.length; i++) {
              let tempTransaction = {
                "timestamp": 0,
                "hash": this.keys[i],
                "type": "unprocessed",
                "account": this.blockResults["blocks"][this.keys[i]]["block_account"],
                "amount": this.blockResults["blocks"][this.keys[i]]["amount"]
              }
              this.transactions.push(tempTransaction);
            }
          });
      });
  }

  getBalance(accountParam: string): void {
    this.nodeService.getBalance(accountParam)
      .subscribe(data => {
        this.balanceResults = data;
      });
  }

  getRepresentative(accountParam: string): void {
    this.nodeService.getRepresentative(accountParam)
      .subscribe(data => {
        this.representativeResults = data;
        this.getAccountDetails(this.representativeResults['representative']);
      });
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }

  formatDate(rawDate: string): string {
    return rawDate.match(/\d{2}\/[A-Za-z]{3}\/\d{4}/) + " " + ("" + rawDate.match(/\d{2}:\d{2}:\d{2} /)).trim();
  }

  formatDateLocal(rawDate: string, offset: number): string {
    let myDate = new Date(new Date(rawDate).getTime() + (offset * 3600000));
    return myDate.toLocaleString('en-GB', { timeZone: 'UTC' });
  }

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }

  trackElement(index: number, element: any) {
    return element ? element.guid : null;
  }

  copyToClipboard(str: string) {
    var el = document.createElement('textarea');
    el.value = str;
    this.copied = true;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // save current contentEditable/readOnly status
      var editable = el.contentEditable;
      var readOnly = el.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      el.contentEditable = editable;
      el.readOnly = true;

      // create a selectable range
      var range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    } else {
      el.select();
    }

    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

interface Transaction {
  timestamp?: number;
  hash: string;
  type: string;
  account: string;
  amount: number;
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

interface FiatResults {
  [currencyType: string]: number;
}

interface BlockTime {
  _id: string;
  log: Time;
}

interface Time {
  epochTimeStamp: DateTime;
}

interface DateTime {
  $date: DateTime;
}

interface BlockTime {
  _id: string;
  log: Time;
}

interface Time {
  epochTimeStamp: DateTime;
}

interface DateTime {
  $date: DateTime;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}