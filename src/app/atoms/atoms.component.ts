import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketioService } from '../shared/services/socketio.service';
import { MonteCarloPI, Payload } from '../shared/models/monte-carlo-pi';
import { v4 as uuidv4 } from 'uuid';
import { NotifierService } from "angular-notifier";
import { ApiService } from '../shared/services/api.service';


@Component({
  selector: 'app-atoms',
  templateUrl: './atoms.component.html',
  styleUrls: ['./atoms.component.scss']
})
export class AtomsComponent implements OnInit {

  //Vars
  montes = [];
  appid: string;

  //Form Controls
  numTosses = new FormControl('', Validators.compose(
    [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]
  ));

  //Notifier Service
  private readonly notifier: NotifierService;

  //Constructor
  constructor(private socketService: SocketioService, notifierService: NotifierService, private _apiService: ApiService) {
    this.notifier = notifierService;
  }

  //On Init
  ngOnInit() {

    //Get appid from api service
    this._apiService.appid()
      .subscribe(data => this.appid = data);

    //Listen for atomizer responses and process messages
    this.socketService
      .getMessage()
      .subscribe(msg => {
        console.log('[Socket.io"] atomizer-response:', msg);
        this.montes.push(JSON.parse(msg));
      });
  }

  //Publish a MonteCarloPI Atomizer Object to RabbitMQ
  atomizeMonte(tosses) {
    //console.log(this.appid);
    var monte = new MonteCarloPI(this.appid, uuidv4(), 'montecarlopi.MonteCarlo', new Payload(parseInt(tosses)));
    this.socketService.publishMessage(monte);
    this.numTosses.setValue('');
    this.notifier.notify("success", monte.atomid + " with ID: " + monte.id + " has been sent to the Atomizer!");
  }

}
