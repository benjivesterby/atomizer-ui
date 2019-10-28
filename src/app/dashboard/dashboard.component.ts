import { Component, OnInit } from '@angular/core';
import { RabbitmqService } from '../shared/services/rabbitmq.service';
import { IMessageResponse } from '../shared/models/messageResponse';
import { IAlive } from '../shared/models/Alive';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public messageResponse = {} as IMessageResponse;
  public alive = {} as IAlive;

  constructor(private _rabbitmqService: RabbitmqService) { }

  ngOnInit() {

    //Test if RabbitMQ is alive
    this._rabbitmqService.alive()
      .subscribe(data => this.alive = data);
  }

}
