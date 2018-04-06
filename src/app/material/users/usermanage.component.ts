import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, Users, UserListResponse } from '../../lib/users.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable } from "rxjs/Rx";
import { catchError, finalize, tap } from 'rxjs/operators';
// import { _throw } from 'rxjs/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from  'rxjs/Observable';
import { FormBuilder, FormGroup, FormControl,  Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-material-user-manage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UsersService, MatSnackBar]
})

export class UsermanageComponent implements OnInit {
  private data: any;
  private user: any;
  private userId: string;
  private displayedColumns = [];
  private usersCount = 0;
  public userManageForm: any;
  public dob: any;
  password = 'password';
  confirmpassword = 'confirmpassword';

  constructor(private fb: FormBuilder, public usersService: UsersService, 
    private route: ActivatedRoute, public router: Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
    /*this.userManageForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmpassword: ["", [Validators.required, Validators.minLength(6), this.matchValidator(this.password)]],
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      dob: ["", Validators.required],
      education: ["", Validators.required],
      occupation: ["", Validators.required],
      permLocation: ["", Validators.required],
      currentLocation: ["", Validators.required]
    });*/
    this.userManageForm = this.fb.group({
        email: ["", [Validators.required]],
        password: ["", [Validators.required]],
        confirmpassword: ["", [Validators.required]],
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        dob: ["", [Validators.required]],
        education: [""],
        occupation: [""],
        permLocation: [""],
        currentLocation: [""]
      });
      this.dob = new Date();  
      this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
            this.userId = params['id'];

            this.usersService.get(this.userId).subscribe((data:any) => {
                const userData = data;
                
                this.userManageForm.patchValue({
                    email: [userData.email],
                    password: [""],
                    confirmpassword: [""],
                    firstName: [userData.firstName],
                    lastName: [userData.lastName],
                    dob: [],
                    education: [userData.education],
                    occupation: [userData.occupation],
                    permLocation: [userData.permLocation],
                    currentLocation: [userData.currentLocation]
                  });
                  this.dob = new Date(userData.dob); 
            }, () => {
            // No Handling
            }, () => {
            });
        } else {
            
        }
    });
  }

  matchValidator(fieldName: string) {
      let fcfirst: FormControl;
      let fcSecond: FormControl;

      return function matchValidator(control: FormControl) {

          if (!control.parent) {
              return null;
          }

          // INITIALIZING THE VALIDATOR.
          if (!fcfirst) {
              //INITIALIZING FormControl first
              fcfirst = control;
              fcSecond = control.parent.get(fieldName) as FormControl;

              //FormControl Second
              if (!fcSecond) {
                  throw new Error('matchValidator(): Second control is not found in the parent group!');
              }

              fcSecond.valueChanges.subscribe(() => {
                  fcfirst.updateValueAndValidity();
              });
          }

          if (!fcSecond) {
              return null;
          }

          if (fcSecond.value !== fcfirst.value) {
              return {
                  matchOther: true
              };
          }

          return null;
      }
  }

  save() {
    let msg = '';  
    if (this.userManageForm.valid) {
        let user = this.userManageForm.value;
        if(this.userId) {
            msg = 'User updated successfully';
            user.id = this.userId;
        } else {
            msg = 'User addeded successfully';
        }
        
        // user.dob = new Date(user.dob).toISOString();
        console.log(user);
        this.usersService.save(user);
        this.snackBar.open(msg, 'Action', {
            duration: 2000,
        });
        this.router.navigate(['users']);
        /* Any API call logic via services goes here */
    }

  }

  dateFormat(dt: Date) {
    dt = new Date(dt);
    let mm = dt.getMonth() + 1; // getMonth() is zero-based
    let dd = dt.getDate();

    let fdt = [
        (mm > 9 ? '' : '0') + mm,
        '/',
        (dd > 9 ? '' : '0') + dd,
        '/',
        dt.getFullYear(),
    ].join('');
    console.log(fdt);
    return fdt;    
  }
}
