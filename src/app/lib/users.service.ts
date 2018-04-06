import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class UsersService {
  token: string;
  headerOptions: RequestOptions;
  constructor(private http: Http) { 
    this.token = sessionStorage.getItem('jwtToken');
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.token);

    this.headerOptions = new RequestOptions();
    this.headerOptions.headers = headers;
    
  }
  public getList(filter, sortColumn, sortDirection, pageIndex, pageSize): Observable<UserListResponse> {
    //return this.http.get('http://localhost:3000/users').map((res: Response) => res.json());
    // filter, sortDirection, pageIndex, pageSize
    let filterQuery = '';

    if(Object.keys(filter).length > 0) {
      for(let i in filter) {
        filterQuery += ('&' + i + '=' + filter[i]);
      }
      /*filterQuery = keys.reduce((acc, cv) => {
        console.log('==============');
        console.log(cv + '=' + filter[cv])
        return acc + ('&' + cv + '=' + filter[cv]);
      });*/
    }

    return this.http.get('http://localhost:3000/users?' + filterQuery + 
    '&sortBy=' + sortColumn + '&sortOrder=' + sortDirection + 
    '&page=' + pageIndex + '&pageSize=' + pageSize, 
    this.headerOptions ).map( (res: Response) => {
      return res.json();
    });
  }

  public get(userId): Observable<Users> {
    let filterQuery = '';

    return this.http.get('http://localhost:3000/users/' + userId, 
      this.headerOptions ).map( (res: Response) => {
        return res.json();
    });
  }

  public save(data) {
    // let headers = new Headers({ 'Content-Type': 'application/json' });

    if (typeof data.id === 'undefined') {
      console.log('X');
      return this.http.post('http://localhost:3000/users', JSON.stringify(data),
      this.headerOptions).subscribe((res: Response) => {
        return res.json();
      });
      //.catch((e: any) => Observable.throw(this.errorHandler(e)));
    } else {
      console.log('Y');
      return this.http.put('http://localhost:3000/users/' + data.id, JSON.stringify(data), 
      this.headerOptions).subscribe((res: Response) => {
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
  password: string;
  confirmpassword :string;
  firstName: number;
  lastName: number;
  dob: string;
  education: string;
  occupation: string;
  currentLoction: string;
  permLoction: string;
}
