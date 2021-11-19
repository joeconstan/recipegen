import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ThemePalette } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router'
import { UserService } from './user.service'
import { CommonService } from './common.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    constructor(
        private cookieService: CookieService,
        private titleService: Title,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private commonService: CommonService
    ) {}

    active = 1
    user
    background: ThemePalette = undefined;
    tabcolor: ThemePalette = undefined;
    links = [
        {
            label:'SC',
            route:'sc'
        },
        {
            label:'Recipe Book',
            route:'rb'
        },
        {
            label:'IP Recipes',
            route:'ip'
        }
    ]


    public ngOnInit(): void {
        this.titleService.setTitle( 'The Recipe Doc' );
        this.tabcolor = this.tabcolor ? undefined : 'accent';

        // retrieve the locally stored usre
        let user = JSON.parse(localStorage.getItem('user'))

        // use local username to retrieve full updated db record
        if (user){
          this.commonService.getUser(user['username']).subscribe(data => {
               if (!data){
                   // console.log('user does not exist or wrong pswd')
               }else{
                   this.userService.setUser(data)
                   this.user=data
                   localStorage.setItem('user', JSON.stringify(data));
                   // this.userService.user = data[0]
                   // this._snackBar.open('Logged in as '+data['username'], 'ok', {
                       // duration: 2000,
                   // });
                   // this.router.navigate(['/rb'])
               }
          },
               error => console.error(error)
          )
        }

        // if (user){
        //     this.user=user
        //     this.userService.setUser(user)
        // }

    }

    getAdmin(){
        if (this.userService.user){
          return this.userService.user.adminflag==true
        }
        return false
    }

    getUser(){
        if (this.userService.user){
          return this.userService.user != {}
        }
        return false
    }

    logout() {
          var nouser = {}
          this.userService.setUser(nouser)
          localStorage.removeItem('user')
          this.router.navigate(['/login'])
    }


}
