import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { MonteCarloPI, Payload } from '../models/monte-carlo-pi';


@Injectable({
  providedIn: 'root'
})


export class SocketioService {

  constructor(public socket: Socket) { }

  getMessage() {
    return this.socket
      .fromEvent<any>('atomizer-response')
      .pipe(map(data => data));
  }

  publishMessage(msg) {
    this.socket.emit('publish', msg);
  }
}
