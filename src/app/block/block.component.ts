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
  block: string;
  paramsub: any;

  constructor(private messageService: MessageService, private route: ActivatedRoute, private blockService: BlockService) { }

  ngOnInit(): void {
    this.paramsub = this.route.params.subscribe(sub => {
      this.getBlock(sub['id']);
      //this.log(`Block Component: ${sub['id']}`);
    });
  }

  getBlock(blockParam: string): void {
    this.blockService.getBlock(blockParam)
    .subscribe(data => {
    this.block = JSON.stringify(data);
    //this.log(`found block matching "${JSON.stringify(block)}"`);
    });
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }
}