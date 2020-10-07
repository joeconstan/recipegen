import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    constructor(private cookieService: CookieService) {}
    title = 'Recipes';


    public ngOnInit(): void {
        // this.cookieService.set('cookie-test', 'test-value')
        // const cookieexists = cookieService.check('myingredients');
        // if (!cookieexists){
            // this.cookieService.set('myingredients', '')
        // }

    }
}
