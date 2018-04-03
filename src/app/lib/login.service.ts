import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {

  }

  public authenticate(email, password, callback) {
    const req = this.http.post('http://localhost:3000/auth/signIn', {
      email: email,
      password: password
    })
      .subscribe(
        res => {
          // console.log(res);
          callback(false, res);
        },
        err => {
          // console.log("Error occured");
          callback(err, null);
        }
      );
  }

}
