import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
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

  public save(data) {
    console.log('In Save')
    let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new RequestOptions(new RequestOptionsArgs({ 'headers': headers }));
    if(typeof data.id === 'undefined') {
      console.log('In Post Request')
      return this.http.post('http://localhost:3000/users', JSON.stringify(data),
    {headers: headers }).subscribe((res: Response) => {
        console.log('In Post Response')
        console.log(res);
        return res.json();
      })
      //.catch((e: any) => Observable.throw(this.errorHandler(e)));
    } else {
      console.log('In Put Request')
      return this.http.put('http://localhost:3000/users/' + data.id, data).map((res: Response) => {
        console.log('In Put Response')
        console.log(res);
        return res.json();
      });
    }

  }

  errorHandler(error) {
    console.log(error);
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
