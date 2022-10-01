import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ThemePalette } from '@angular/material/core';
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationStart,
} from '@angular/router';
import { UserService } from './user.service';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
    private navigationService: NavigationService
  ) {}

  active = 1;
  private readonly destroy$ = new Subject<boolean>();
  user;
  background: ThemePalette = undefined;
  tabcolor: ThemePalette = undefined;
  links = [
    {
      label: 'SC',
      route: 'sc',
    },
    {
      label: 'Recipe Book',
      route: 'rb',
    },
    {
      label: 'IP Recipes',
      route: 'ip',
    },
  ];

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public ngOnInit(): void {
    this.titleService.setTitle('The Recipe Doc - Community Vegan Recipes');
    this.tabcolor = this.tabcolor ? undefined : 'accent';

    // retrieve the locally stored user
    let user = JSON.parse(localStorage.getItem('user'));

    // use local username to retrieve full updated db record
    if (user) {
      this.commonService.getUser(user['username']).subscribe(
        (data) => {
          if (!data) {
            // console.log('user does not exist or wrong pswd')
          } else {
            this.userService.setUser(data);
            this.user = data;
            localStorage.setItem('user', JSON.stringify(data));
          }
        },
        (error) => console.error(error)
      );
    }

    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger) {
          this.navigationService.setTrigger(event.navigationTrigger);
        }
      });
  }

  getAdmin() {
    if (this.userService.user) {
      return this.userService.user.adminflag == true;
    }
    return false;
  }

  getUser() {
    if (this.userService.user) {
      return this.userService.user != {};
    }
    return false;
  }

  getUserFromService() {
    if (this.userService.user && this.userService.user.username) {
      this.user = this.userService.user;
      return true;
    } else {
      return false;
    }
  }

  logout() {
    var nouser = {};
    this.userService.setUser(nouser);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  navHome() {
    this.router.navigate(['/']);
  }

  openHelp() {}
}
