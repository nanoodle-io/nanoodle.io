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
  contentResults: Content;
  blockResults: Block;
  error: string;
  reg = new RegExp('"error"');


  constructor(private messageService: MessageService, private route: ActivatedRoute, private blockService: BlockService) { }

  ngOnInit(): void {
    this.contentResults = null;
    this.blockResults = null;
    this.error = null;
    this.paramsub = this.route.params.subscribe(sub => {
      this.getBlock(sub['id']);
    });
  }

  getBlock(blockParam: string): void {
    this.blockService.getBlock(blockParam)
      .subscribe(data => {
        this.blockResults = data;
        if (this.reg.test(JSON.stringify(this.blockResults)))
        {
          this.error = JSON.stringify(this.blockResults['error']);
          //this.log(this.error);
        }
        else
        {
          this.contentResults = JSON.parse(this.formatContents(JSON.stringify(this.blockResults['contents'])));
        }
      });
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

interface Block {
  contents: Content;
}

interface Block {
  error: string;
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