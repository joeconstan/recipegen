import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecipelistComponent } from './recipelist/recipelist.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PendingComponent } from './pending/pending.component';
import { SavedComponent } from './saved/saved.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { SinglerecipeComponent } from './singlerecipe/singlerecipe.component';
import { ExploreComponent } from './explore/explore.component';
import { ListPageComponent } from './list-page/list-page.component';
import { HelpComponent } from './help/help.component';
import { GrainsComponent } from './w/grains/grains.component';
import { VeganReferenceComponent } from './vegan-reference/vegan-reference.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: RecipelistComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'rb', component: RecipelistComponent },
  { path: 'new/:sort', component: RecipelistComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pending', component: PendingComponent },
  { path: 'saved', component: SavedComponent },
  { path: 'changelog', component: ChangelogComponent },
  { path: 'recipe/:recipe', component: SinglerecipeComponent },
  { path: 'list/:list', component: ListPageComponent },
  { path: 'help', component: HelpComponent },
  { path: 'w/grains', component: GrainsComponent },
  { path: 'veganref', component: VeganReferenceComponent },
  { path: '404', component: NotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
