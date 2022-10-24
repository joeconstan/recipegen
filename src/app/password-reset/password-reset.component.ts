import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  email: String;
  form: FormGroup;
  loading = false;
  submitted = false;
  user: any;
  loggedIn: boolean;
  errorMsg: String;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
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
    // this.commonService
    //   .getUser(this.f.username.value, this.f.password.value)
    //   .subscribe(
    //     (data) => {
    //       if (!data) {
    //         console.log('user does not exist or wrong pswd');
    //         this.errorMsg = 'Username or password is incorrect';
    //       } else {
    //         this.userService.setUser(data);
    //         localStorage.setItem('user', JSON.stringify(data));
    //         // this.userService.getUser() = data[0]
    //         this._snackBar.open('Logged in as ' + data['username'], 'ok', {
    //           duration: 2000,
    //         });
    //         this.router.navigate(['/rb']);
    //       }
    //     },
    //     (error) => console.error(error)
    //   );
  }
}
