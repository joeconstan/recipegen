import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common.service'
import { UserService } from '../user.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  email: String;
  password: String;
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private commonService: CommonService,
      private userService: UserService,
      private router: Router,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
  }

  get f() { return this.form.controls; }

  login_user(){

  }

  logout() {
        var nouser = {}
        this.userService.setUser(nouser)
        localStorage.removeItem('user')
        this.router.navigate(['/login'])
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
       this.commonService.getUser(this.f.username.value, this.f.password.value).subscribe(data => {
            // console.log(data)
            if (!data){
                console.log('user does not exist or wrong pswd')
            }else{
                this.userService.setUser(data[0])
                localStorage.setItem('user', JSON.stringify(data[0]));
                // this.userService.user = data[0]
                this._snackBar.open('Logged in as '+data[0].username, 'ok', {
                    duration: 2000,
                });
                this.router.navigate(['/rb'])
            }
       },
            error => console.error(error)
       )
   }


}
