import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockService } from '../block.service';
import { MessageService } from '../message.service';

@Component({
  selector: "app-block",
  templateUrl: "./block.component.html",
  styleUrls: ['./block.component.css']
})

export class BlockComponent implements OnInit {
  paramsub: any;
  //Results
  blockResults: BlockResults;
  detail: Detail;
  contents: Content;
  key: string;
  error: string;
  reg = new RegExp('"error"');

  constructor(private messageService: MessageService, private route: ActivatedRoute, private blockService: BlockService) { }

  ngOnInit(): void {
    this.key = null;
    this.detail = null;
    this.contents = null;
    this.blockResults = null;
    this.error = null;
    this.paramsub = this.route.params.subscribe(sub => {
      this.getBlock(sub['id']);
    });
  }

  getBlock(blockParam: string): void {
    this.blockService.getBlock(blockParam)
      .subscribe(data => {
        this.blockResults = JSON.parse(this.formatContents(JSON.stringify(data)));
        if (this.reg.test(JSON.stringify(this.blockResults))) {
          this.error = JSON.stringify(this.blockResults['error']);
        }
        this.key = JSON.stringify(Object.keys(this.blockResults['blocks'])[0]).replace(/\"/g, '');
        this.detail = this.blockResults['blocks'][this.key];
        this.contents = this.detail['contents'];
      });
  }

  formatAmount(mRai: number): string {
    const dec = 4;
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(dec);
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }
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