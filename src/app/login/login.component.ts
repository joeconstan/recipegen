import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { userObject, userObjectWithToken } from 'src/types';
// import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  form: FormGroup;
  loading = false;
  submitted = false;
  user: userObject;
  loggedIn: boolean;
  errorMsg: String;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // anime({
    //   targets: '.animetarget path',
    //   // loop: true,
    //   // direction: 'alternate',
    //   strokeDashoffset: [anime.setDashoffset, 0],
    //   easing: 'easeInOutSine',
    //   // backgroundColor: '#FFF',
    //   duration: 900,
    //   delay: (el, i) => {
    //     return i * 300;
    //   },
    // });

    // const svgText = anime({});

    // this.authService.authState.subscribe((user) => {
    // this.user = {
    //   username: user['name'],
    //   google: true
    // }
    // this.loggedIn = (user != null);
    // console.log(user)

    // this.commonService.getUser(this.f.username.value, this.f.password.value).subscribe(data => {
    //      if (!data){
    //          // console.log('user does not exist or wrong pswd')
    //          // if user doesnt exist, make a user record for them
    //          this.commonService.register(user).subscribe(data => {
    //           if (data){
    //              this.userService.setUser(user)
    //              localStorage.setItem('user', JSON.stringify(user));
    //              this._snackBar.open('Logged in as '+user['name'], 'ok', {
    //                  duration: 2000,
    //              });
    //              this.router.navigate(['/rb'])
    //             // if data, then it succeeded
    //             // this._snackBar.open('User added!', 'ok', {
    //                // duration: 2000,
    //             // });
    //             // this.router.navigate(['/login'])
    //           }else{
    //             // else, it failed. prob duplicate username
    //             this._snackBar.open('Username already taken', '', {
    //                duration: 2000,
    //             });
    //           }
    //
    //          },
    //               error => console.error(error)
    //          )
    //      }else{
    //          this.userService.setUser(data)
    //          localStorage.setItem('user', JSON.stringify(data));
    //          // this.userService.getUser() = data[0]
    //          this._snackBar.open('Logged in as '+data['username'], 'ok', {
    //              duration: 2000,
    //          });
    //          this.router.navigate(['/rb'])
    //      }
    // },
    //      error => console.error(error)
    // )

    //    });
  }

  get f() {
    return this.form.controls;
  }

  login_user() {}

  logout() {
    var nouser = {};
    this.userService.setUser(nouser);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();
    //
    // // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // this.loading = true;
    this.commonService
      .getUser(this.f.username.value, this.f.password.value)
      .subscribe(
        (data: userObjectWithToken) => {
          if (!data) {
            console.log('user does not exist or wrong pswd');
            this.errorMsg = 'Username or password is incorrect';
          } else {
            this.userService.setUser(data.result);
            this.user = {
              id: data.result.id,
              username: data.result.username,
              adminflag: data.result.adminflag,
              color_key: data.result.color_key,
            };

            localStorage.setItem('usertoken', JSON.stringify(data.token));
            this._snackBar.open(
              'Logged in as ' + data.result['username'],
              'ok',
              {
                duration: 2000,
              }
            );
            this.router.navigate(['/rb']);
          }
        },
        (error) => console.error(error)
      );
  }
}
