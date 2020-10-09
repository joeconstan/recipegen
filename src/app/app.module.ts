import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { RecipelistComponent } from './recipelist/recipelist.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlphaPipe } from './alpha.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    IngredientsComponent,
    RecipelistComponent,
    RecipeModalComponent,
    AlphaPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AutocompleteLibModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule
  ],
  exports: [ MatButtonModule, MatCardModule, MatTabsModule, MatInputModule, MatIconModule, MatChipsModule ],
  providers: [ CookieService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
