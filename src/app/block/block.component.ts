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
  type: string;
  paramsub: any;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account: string;
  signature: string;
  work: string;
  //Reults
  contentResults: Content;
  blockResults: Block;


  constructor(private messageService: MessageService, private route: ActivatedRoute, private blockService: BlockService) { }

  ngOnInit(): void {
    this.paramsub = null;
    this.type = null;
    this.account = null;
    this.previous = null;
    this.representative = null;
    this.balance = null;
    this.link = null;
    this.link_as_account = null;
    this.signature = null;
    this.work = null;
    this.paramsub = this.route.params.subscribe(sub => {
      this.getBlock(sub['id']);
      //this.log(`Block Component: ${sub['id']}`);
    });
  }

  getBlock(blockParam: string): void {
    this.blockService.getBlock(blockParam)
      .subscribe(data => {
        this.blockResults = data;
        this.contentResults = JSON.parse(this.formatContents(JSON.stringify(this.blockResults['contents'])));
        this.type = this.contentResults['type'];
        this.account = this.contentResults['account'];
        this.previous = this.contentResults['previous'];
        this.representative = this.contentResults['representative'];
        this.balance = this.contentResults['balance'];
        this.link = this.contentResults['link'];
        this.link_as_account = this.contentResults['link_as_account'];
        this.signature = this.contentResults['signature'];
        this.work = this.contentResults['work'];
      });
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g , "").replace(/\\/g , "").replace(/\"{/g , "{").replace(/}\"/g , "}");
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }
}

interface Block
{
    contents: Content;
}

interface Content
{
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