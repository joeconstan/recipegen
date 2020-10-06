import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'
// import 'rxjs/add/operator/toPromise';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-recipelist',
  templateUrl: './recipelist.component.html',
  styleUrls: ['./recipelist.component.css']
})
export class RecipelistComponent implements OnInit {

    public recipes
    recipe_full
    recipe


  constructor(
      private pantryService: PantryService,
      private modalService: NgbModal
  ) { }

  ngOnInit(): void {
      this.recipes = this.pantryService.getRecipes()
  }



  get_full_recipe(){
      // this.recipe_full = await this.pantryService.loadRecipe(this.recipe).toPromise();
      this.pantryService.loadRecipe(this.recipe).then((res) => {
            this.recipe_full = res
            this.openModal()
      });
  }

  viewRecipeModal(recipe) {
      this.recipe = recipe;
      this.get_full_recipe();
  }

  loadRecipe(recipe){
      this.recipe_full = this.pantryService.loadRecipe(recipe)
      return;
  }


  openModal(){
      console.log(this.recipe_full)
      const modalRef = this.modalService.open(RecipeModalComponent, { centered: true, size: 'lg'})
      modalRef.componentInstance.data = this.recipe_full

  }


}
