import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Rx";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class UsersService {

  constructor(private http: Http) { }
  public getList(filter, sortColumn, sortDirection, pageIndex, pageSize): Observable<UserListResponse> {
    //return this.http.get('http://localhost:3000/users').map((res: Response) => res.json());
    // filter, sortDirection, pageIndex, pageSize
    let filterQuery = '';

    if(Object.keys(filter).length > 0) {
      for(let i in filter) {
        filterQuery += ('&' + i + '=' + filter[i])
      }
      /*filterQuery = keys.reduce((acc, cv) => {
        console.log('==============');
        console.log(cv + '=' + filter[cv])
        return acc + ('&' + cv + '=' + filter[cv]);
      });*/
    }

    return this.http.get('http://localhost:3000/users?' + filterQuery + '&sortBy=' + sortColumn + '&sortOrder=' + sortDirection + '&page=' + pageIndex + '&pageSize=' + pageSize).map((res: Response) => {
      console.log('In Response')
      console.log(res);
      return res.json();
    });
  }
}



export interface UserListResponse {
  data: Users[];
  total: number;
}

export interface Users {
  email: string;
  firstName: number;
  lastName: number;
  dob: string;
  education: string;
  occupation: string;
  currentLoction: string;
}
