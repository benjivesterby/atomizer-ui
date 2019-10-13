import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { IMessageResponse } from '../models/messageResponse';


@Injectable({
  providedIn: 'root'
})
export class RabbitmqService {

  constructor(private http: HttpClient) { }

  getStatus(): Observable<IMessageResponse> {
    return this.http.get<IMessageResponse>('http://localhost:3000/api/rabbit');
  }

}
