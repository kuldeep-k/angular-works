import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../../lib/login.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public loginForm: any;
  public errormsg: string;
  //  public fb: FormBuilder;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  login(form) {
    if (this.loginForm.dirty && this.loginForm.valid) {
      // alert(`Email: ${this.loginForm.value.email} Password: ${this.loginForm.value.password}`);
      this.loginService.authenticate(this.loginForm.value.email, this.loginForm.value.password, (err, resp) => {
        if (err !== false) {
          if (err.status === 401) {
            this.loginForm.controls['email'].setErrors({'incorrect': true});
            this.errormsg = err.error.msg;
            // console.error('Login Failed');
            // console.error(err.error.msg);
          }
          // console.error(err)
        } else {
          // console.log(resp.token);
          sessionStorage.setItem('jwtToken', resp.token);
          this.router.navigate(['users']);
        }
      });
    }
  }

}
