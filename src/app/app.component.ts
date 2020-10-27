import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ThemePalette } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router'
import { UserService } from './user.service'

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
        private userService: UserService
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
        // this.user = this.userService.user
        let user = JSON.parse(localStorage.getItem('user'))
        if (user){
            this.user=user
            this.userService.setUser(user)
        }

    }

    getAdmin(){
        if (this.userService.user){
          return this.userService.user.adminflag==true
        }
        return false
    }
}
