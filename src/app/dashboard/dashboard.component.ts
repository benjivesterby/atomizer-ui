import { Component, OnInit } from '@angular/core';
import { RabbitmqService } from '../shared/services/rabbitmq.service';
import { IMessageResponse } from '../shared/models/messageResponse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public messageResponse = {} as IMessageResponse;

  constructor(private _rabbitmqService: RabbitmqService) { }

  ngOnInit() {

    this._rabbitmqService.getStatus()
      .subscribe(data => this.messageResponse = data);
  }

}
