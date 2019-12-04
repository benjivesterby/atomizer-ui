import { Component, OnInit } from '@angular/core';
import { RabbitmqService } from '../shared/services/rabbitmq.service';
import { IMessageResponse } from '../shared/models/messageResponse';
import { IAlive } from '../shared/models/Alive';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public messageResponse = {} as IMessageResponse;
  public alive = {} as IAlive;
  public rabbitAlive = {} as IAlive;

  constructor(private _rabbitmqService: RabbitmqService, private _apiService: ApiService) { }

  ngOnInit() {

    //Test if RabbitMQ is alive
    this._rabbitmqService.alive()
      .subscribe(data => this.alive = data);

    //Test if Atomizer is alive
    this._apiService.atomizerAlive()
      .subscribe(data => this.rabbitAlive = data);
  }

}
