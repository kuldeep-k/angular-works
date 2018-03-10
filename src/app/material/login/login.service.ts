import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {

  }

  public authenticate(email, password) {
    const req = this.http.post('http://localhost:3000/auth', {
      email: email,
      password: password
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

}
