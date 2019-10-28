import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { IMessageResponse } from '../models/messageResponse';
import { IAlive } from '../models/Alive';


@Injectable({
  providedIn: 'root'
})
export class RabbitmqService {

  constructor(private http: HttpClient) { }

  alive(): Observable<IAlive> {
    return this.http.get<IAlive>('http://localhost:3000/api/alive');
  }

}
