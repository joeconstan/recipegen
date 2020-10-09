import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'
import {NgxPaginationModule} from 'ngx-pagination';
// import 'rxjs/add/operator/toPromise';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-recipelist',
  templateUrl: './recipelist.component.html',
  styleUrls: ['./recipelist.component.css']
})
export class RecipelistComponent implements OnInit {

    public recipes: any;
    recipe_full
    recipe
    p: number = 1;
    mealtypes = ['Breakfast','Lunch/Dinner','Dessert','Sides/Sauces','Holiday']
    times = ['0-10 min','10-30 min','30-60 min','60+ min']
    difficulties = ['Easy','Moderate','Hard']
    image_upload: any;


  constructor(
      private pantryService: PantryService,
      private modalService: NgbModal,
      private commonService: CommonService
  ) { }

  ngOnInit(): void {
      // this.recipes = this.pantryService.getRecipes()
      // this.recipes = this.pantryService.getAllRecipes()
      this.commonService.getRecipes().subscribe(data => {
          // console.log('success!');
          // console.log(data);
          this.recipes = data;
      },
          error => console.error(error)
      )
  }



  get_full_recipe(){
      // this.recipe_full = await this.pantryService.loadRecipe(this.recipe).toPromise();
      // console.log('here::: ', this.recipe.Name)
      this.commonService.getRecipe(this.recipe.Name).subscribe(data => {
          this.recipe_full = data[0];
          this.openModal()
      },
          error => console.error(error)
      )

      // this.pantryService.loadRecipe(this.recipe).then((res) => {
            // this.recipe_full = res
            // this.openModal()
      // });
  }

  viewRecipeModal(recipe) {
      this.recipe = recipe;
      this.get_full_recipe();
  }

  // loadRecipe(recipe){
  //     // this.recipe_full = this.pantryService.loadRecipe(recipe)
  //
  //     this.commonService.getRecipe(recipe).subscribe(data => {
  //         console.log(data);
  //         this.recipe_full = data;
  //     },
  //         error => console.error(error)
  //     )
  //
  //     return;
  // }


  openModal(){
      const modalRef = this.modalService.open(RecipeModalComponent, { centered: true, size: 'lg'})
      modalRef.componentInstance.data = this.recipe_full
  }



  pageChanged(event){}

  filter(mealtype){
      console.log('filtered on type: ', mealtype)
      this.commonService.getRecipesByType(mealtype).subscribe(data => {
          // console.log(data);
          this.recipes = data;
      },
          error => console.error(error)
      )

  }



  getBase64(file){
      return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
      })
  }


  readImage(fileInput: any){
      var fileName = fileInput.target.files[0].name
      // console.log(fileName)
      if(fileInput.target.files && fileInput.target.files[0]){
          var file = fileInput.target.files[0]
          this.getBase64(file).then(data => this.image_upload = data)
      }
  }


  // uploadImage(){
  //
  // }

}
