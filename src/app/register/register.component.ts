import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // this.form = this.formBuilder.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   username: ['', Validators.required],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    // });
  }

  onBlurEmail() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  get email() {
    return this.form.get('email');
  }
  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
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
    // console.log(this.form.value)

    this.commonService.register(this.form.value).subscribe(
      (data) => {
        if (data) {
          // if data, then it succeeded
          this._snackBar.open('User added!', 'ok', {
            duration: 2000,
          });
          this.router.navigate(['/login']);
        } else {
          // else, it failed. prob duplicate username
          this._snackBar.open('Username already taken', '', {
            duration: 2000,
          });
        }
      },
      (error) => console.error(error)
    );
  }
}
