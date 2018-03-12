import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../../lib/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public loginForm: any;

  //  public fb: FormBuilder;

  constructor(private fb: FormBuilder, private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  login(form) {
    if (this.loginForm.dirty && this.loginForm.valid) {
      // alert(`Email: ${this.loginForm.value.email} Password: ${this.loginForm.value.password}`);
      this.loginService.authenticate(this.loginForm.value.email, this.loginForm.value.password);
    }
  }

}
