import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { NanoodleService } from '../nanoodle.service';

@Component({
  selector: 'unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {
  identifier: string;
  paramsub: any;

  constructor(private messageService: MessageService, private nanoodleService: NanoodleService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsub = this.route.params.subscribe(sub => {
      this.removeWatcher(this.identifier = sub['id']);
    });
  }

  removeWatcher(unsubscribe: string)
  {
    this.nanoodleService.removeWatcher(unsubscribe).subscribe(data => {
    });
  }
}
