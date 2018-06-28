import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService, Users, UserListResponse } from './../../lib/users.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable } from "rxjs/Rx";
import { catchError, finalize, tap } from 'rxjs/operators';
// import { _throw } from 'rxjs/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from  'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UsersService]
})

export class UsersComponent implements OnInit {
  public data: any;
  private displayedColumns = [];
  private usersCount = 0;
  public userSearchForm: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fb: FormBuilder, private router: Router, public usersService: UsersService) { }

  ngOnInit() {
    this.userSearchForm = this.fb.group({
      filter: [""],
      firstName: [""],
      lastName: [""]
    });
    let data = new UserDataSource(this.usersService);
    data.loadUsers({}, 'firstName', 'asc', 0, 3);
    this.usersCount = data.loadCount();

    this.displayedColumns = ['email', 'firstName', 'lastName', 'dob', 'education', 'occupation', 'currentLocation', 'actions'];
    // console.log('XCXCXC')
    // console.log(data.count);
    // data.paginator = this.paginator;
    // this.usersCount  = 12;
    this.data = data;
    /*this.usersService.getList('').subscribe(
      data => {
          // Emit list event
          // this.data = new MatTableDataSource<Users>(data);
          this.data = new UserDataSource(data);
          console.log('XCXCXC')
          console.log(this.data);
      },
      err => {
          // Log errors if any
          console.log(err);
      });*/
    }

    ngAfterViewInit() {
      Observable.merge(this.paginator.page, this.sort.sortChange)
          .pipe(
              tap(() => this.loadUsersPage()),

          )
          .map(data => {
            // console.log('-=-=-=-=-=-=-=-=-=-');
            // console.log(data);
            return data['data'];
          })
          .subscribe();
    }

    loadUsersPage() {
        this.data.loadUsers(
            {},
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    }
    // let data = new MatTableDataSource<Users>(sdata);

    openAddUser() {
      this.router.navigate(['users/add']);
    }

    openEditForm($event) {
      console.log($event)
      this.router.navigate(['users/edit', $event.id]);
    }

    search(form) {

    }
  }



  export class UserDataSource extends DataSource<any> {
    public count = 0;
    private usersSubject = new BehaviorSubject<Users[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(public usersService: UsersService) {
      super();
    }
    /*connect(): Observable<Users[]> {
      console.log('BNBNBN')
      return this.usersService.getList('');
    }
    disconnect() {}*/

    connect(collectionViewer: CollectionViewer): Observable<Users[]> {
        return this.usersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.usersSubject.complete();
        this.loadingSubject.complete();
    }

    loadUsers(filter = {}, sortColumn = 'firstName',
      sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

      this.loadingSubject.next(true);

      this.usersService.getList(filter, sortColumn, sortDirection, pageIndex, pageSize).pipe(
          catchError(() => Observable.of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.usersSubject.next(response['data']);
        this.count = response['total'];
      }, error => {
        // console.log(error)
      });
    }

    loadCount() {
      return this.count;
    }


  }
