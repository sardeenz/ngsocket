import { RedisLocations } from './redis-locations';
import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GetAllCrashesService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000/';

  getGeometry(): Observable<RedisLocations> {
    return this.http.get<RedisLocations>(this.url);
    }

}
