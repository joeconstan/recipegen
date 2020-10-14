import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IngredientsComponent } from './ingredients/ingredients.component'
import { RecipelistComponent } from './recipelist/recipelist.component'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { PendingComponent } from './pending/pending.component'

const routes: Routes = [
    { path: 'sc', component: IngredientsComponent },
    { path: 'rb', component: RecipelistComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'pending', component: PendingComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule { }
