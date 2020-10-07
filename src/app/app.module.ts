import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { RecipelistComponent } from './recipelist/recipelist.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AppComponent,
    IngredientsComponent,
    RecipelistComponent,
    RecipeModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AutocompleteLibModule,
    NgbModule
  ],
  providers: [ CookieService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
