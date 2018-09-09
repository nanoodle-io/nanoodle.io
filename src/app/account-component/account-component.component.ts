import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService }  from '../account.service';
import { Observable } from 'rxjs';

@Component({
  selector: "app-account",
  templateUrl: "./account-component.component.html"
})

export class AccountComponentComponent implements OnInit {
  private transactions$: Observable<transaction[]>;
  private account: string;
  private paramsub: any;
  private responsesub: any;

  constructor(private route: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
    this.account = sub['id'];
    //console.log(this.account);
    });
    this.getAccount(this.account);
  }

  getAccount(account: string): void {
      this.responsesub = this.accountService.getTransactions(account).subscribe(transactions$ => this.transactions$ = transactions$);
      }

  formatAmount (mRai: number, type: string): string
  {
    if (type == "receive")
    {
      return "+" + (mRai / 1000000000000000000000000000000);
    }
    else
    {
      return "-" + (mRai / 1000000000000000000000000000000);
    }
  }

  formatAccount (account: string, type: string): string
  {
    if (type == "receive")
    {
      return "from " + account;
    }
    else
    {
      return "to " + account;
    }
  }

      ngOnDestroy() {
        this.paramsub.unsubscribe();
        this.responsesub.unsubscribe();
      }
}

interface transaction {
  type: string;
  account: string;
  amount: number;
  hash: string;
 }