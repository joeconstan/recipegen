import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IngredientsComponent } from './ingredients/ingredients.component'
import { RecipelistComponent } from './recipelist/recipelist.component'

const routes: Routes = [
    { path: 'sc', component: IngredientsComponent },
    { path: 'rb', component: RecipelistComponent }
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
