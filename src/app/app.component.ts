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
        // this.background = this.background ? undefined : 'basic';
        this.tabcolor = this.tabcolor ? undefined : 'accent';
        // this.cookieService.set('cookie-test', 'test-value')
        // const cookieexists = cookieService.check('myingredients');
        // if (!cookieexists){
            // this.cookieService.set('myingredients', '')
        // }

        let user = localStorage.getItem('user')
        if (user){
            this.userService.setUser(user)
        }

    }
}
