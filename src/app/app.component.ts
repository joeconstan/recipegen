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
import { userObjectWithToken } from 'src/types';

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
    let usertoken = JSON.parse(localStorage.getItem('usertoken'));

    // use local usertoken to retrieve full updated db record
    if (usertoken) {
      this.commonService
        .getUser(undefined, undefined, (usertoken = usertoken))
        .subscribe(
          (data: userObjectWithToken) => {
            if (!data) {
            } else {
              this.userService.setUser(data.result);
              this.user = {
                id: data.result.id,
                username: data.result.username,
                adminflag: data.result.adminflag,
                color_key: data.result.color_key,
              };

              // localStorage.setItem('user', JSON.stringify(this.user));
              // localStorage.setItem('usertoken', JSON.stringify(this.user.id));
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
    if (this.userService.getUser()) {
      return this.userService.getUser().adminflag == true;
    }
    return false;
  }

  getUser() {
    if (this.userService.getUser()) {
      return this.userService.getUser();
    }
    return false;
  }

  getUserFromService() {
    if (this.userService.getUser() && this.userService.getUser().username) {
      this.user = this.userService.getUser();
      return true;
    } else {
      return false;
    }
  }

  logout() {
    var nouser = {};
    this.userService.setUser(nouser);
    localStorage.removeItem('usertoken');
    this.router.navigate(['/login']);
  }

  navHome() {
    this.router.navigate(['/']);
  }

  openHelp() {}
}
