import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { NanoodleService } from '../nanoodle.service';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  identifier: string;
  paramsub: any;

  constructor(private messageService: MessageService, private nanoodleService: NanoodleService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsub = this.route.params.subscribe(sub => {
      this.verifyWatcher(this.identifier = sub['id']);
    });
  }

  verifyWatcher(unsubscribe: string)
  {
    this.nanoodleService.verifyWatcher(unsubscribe).subscribe(data => {
      
    });
  }
}
