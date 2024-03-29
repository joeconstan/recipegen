import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RecipelistComponent } from './recipelist/recipelist.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { PendingComponent } from './pending/pending.component';
import { SavedComponent } from './saved/saved.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangelogComponent } from './changelog/changelog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SinglerecipeComponent } from './singlerecipe/singlerecipe.component';
import { ClipboardModule } from 'ngx-clipboard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExploreComponent } from './explore/explore.component';
import { ListPageComponent } from './list-page/list-page.component';
import { MatRadioModule } from '@angular/material/radio';
import { HelpComponent } from './help/help.component';
import { EggsComponent } from './w/eggs/eggs.component';
import { GrainsComponent } from './w/grains/grains.component';
import { DialogNewRecipeComponent } from './dialog-new-recipe-component/dialog-new-recipe-component.component';
import { VeganReferenceComponent } from './vegan-reference/vegan-reference.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { CommonService } from './common.service';
import { RecipeFormatterPipe } from './recipe-formatter.pipe';
import { IngredientsFormatterPipe } from './ingredients-formatter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RecipelistComponent,
    RegisterComponent,
    LoginComponent,
    PendingComponent,
    SavedComponent,
    ChangelogComponent,
    SinglerecipeComponent,
    ExploreComponent,
    ListPageComponent,
    HelpComponent,
    EggsComponent,
    GrainsComponent,
    DialogNewRecipeComponent,
    VeganReferenceComponent,
    NotFoundComponent,
    PasswordResetComponent,
    RecipeFormatterPipe,
    IngredientsFormatterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
    ClipboardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatRadioModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatRadioModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonService,
      multi: true,
    },
  ],
  entryComponents: [DialogNewRecipeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
