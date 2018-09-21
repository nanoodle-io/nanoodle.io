import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepresentativeService } from '../representative.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-reps',
  templateUrl: './reps.component.html',
  styleUrls: ['./reps.component.css']
})
export class RepsComponent implements OnInit {

blockCountResults: BlockCountResults;
  paramsub: any;
  error: string;
  reg = new RegExp('"error"');

  constructor(private messageService: MessageService, private route: ActivatedRoute, private representativeService: RepresentativeService) { }

  ngOnInit(): void {
      this.blockCountResults = null;
      this.getBlockCount();
  }

  getBlockCount(): void {
    this.representativeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
        if (this.reg.test(JSON.stringify(this.blockCountResults))) {
          this.error = JSON.stringify(this.blockCountResults['error']);
        }
        //this.log(JSON.stringify(this.blockCountResults));
      });
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  private log(message: string) {
    this.messageService.add(`Representative Component: ${message}`);
  }

}

interface BlockCountResults {
  error?: string;
  count?: string;
  unchecked?: string;  
}