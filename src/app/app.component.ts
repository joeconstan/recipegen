import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationStart,
} from '@angular/router';
import { DialogNewRecipeComponent } from './dialog-new-recipe-component/dialog-new-recipe-component.component';
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
    private navigationService: NavigationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  new_recipe = {
    name: '',
    ingredients: [],
    directions: [],
    type: '',
    timelength: 0,
    difficulty: '',
    pending: Boolean,
    submittedby: '',
    author: '',
    rating: 0,
    tags: [],
    yield: '',
    blurb: '',
  };

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
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  loggedIn() {
    return this.userService.getUser();
  }

  toLogin() {
    this.router.navigate(['/login/']);
  }

  openNewRecipeDialog() {
    // show new-recipe-form
    const dialogRef = this.dialog.open(DialogNewRecipeComponent, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      data: {
        edit: false,
        name: this.new_recipe.name,
        ingredients: this.new_recipe.ingredients,
        directions: this.new_recipe.directions,
        pending: true,
        timelength: this.new_recipe.timelength,
        difficulty: this.new_recipe.difficulty,
        type: this.new_recipe.type,
        author: this.new_recipe.author,
        rating: 0,
        tags: [],
        yield: this.new_recipe.yield,
        blurb: this.new_recipe.blurb,
        submittedby: this.new_recipe.submittedby,
        fileToUpload: {
          recipeid: '',
          filedata: null,
          filename: '',
          primary: true,
          dbinsert: false,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.new_recipe.ingredients = [];
      if (result) {
        result.ingredients = result.ingredients.map((ing) => ing.ingredient);
        result.directions = result.directions.map((dir) => dir.step);
        // result.Ingredients = this.parseIngredients(result.Ingredients)
        result.submittedby = this.userService.getUser().username;
        let nutFree = true;
        // result.ingredients.forEach((ing: Ingredient) => {
        result.ingredients.forEach((ing: string) => {
          if (
            ing.toLowerCase().includes('nut') ||
            ing.toLowerCase().includes('cashew') ||
            ing.toLowerCase().includes('almond') ||
            ing.toLowerCase().includes('pecan')
          ) {
            nutFree = false;
          }
        });
        if (nutFree) {
          result.tags.push('Nut Free');
        }
        this.commonService.newRecipe(result).subscribe(
          (data) => {
            this._snackBar.open('Recipe Suggestion Submitted!', 'ok', {
              duration: 2000,
            });
          },
          (error) => console.error(error)
        );
      }
    });
  }

  navHome() {
    this.router.navigate(['/']);
  }

  openHelp() {}
}
