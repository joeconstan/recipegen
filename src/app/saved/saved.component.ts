import { Component, OnInit, Inject } from '@angular/core';
import { NgbModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service'


@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {

    public recipes: any;
    recipe_full
    recipe
    p: number = 1;
    mealtypes = ['Breakfast','Lunch/Dinner','Desserts','Sauces/Sides','Holiday','Breads', 'Salads', 'Soups']
    times = ['0-10 min','10-30 min','30-60 min','60+ min']
    difficulties = ['Easy','Moderate','Hard']
    image_upload: any;
    search_value
    filters = {
        'keywords':[],
        'type':'',
        'time':'',
        'difficulty':''
    }

    new_recipe = {
        Name:'',
        Ingredients:[],
        Directions:[],
        Type:'',
        timelength: 0,
        Difficulty: '',
        Pending: Boolean
    }

    user;
    _subscription;

    separatorKeysCodes: number[] = [ENTER,COMMA];

    private modalRef;

    ngbModalOptions: NgbModalOptions = {
        centered: true,
        size: 'lg',
        beforeDismiss: () => {
            this.commonService.getSavedRecipes(this.user).subscribe(data => {
                this.recipes = data
            },
                error => console.error(error)
            )
            return true
        }
    };

  constructor(
      private pantryService: PantryService,
      private modalService: NgbModal,
      private commonService: CommonService,
      private userService: UserService,
      public dialog: MatDialog
  ) {
    this._subscription = userService.user.subscribe((value) => {
          this.user = value;
    });
  }

  ngOnInit(): void {
      this.commonService.getSavedRecipes(this.user).subscribe(data => {
          this.recipes = data
      },
          error => console.error(error)
      )
  }

  get_full_recipe(){

      this.commonService.getRecipe(this.recipe.Name).subscribe(data => {
          this.recipe_full = data[0];
          this.openModal()
      },
          error => console.error(error)
      )
  }

  viewRecipeModal(recipe) {
      this.recipe = recipe;
      this.get_full_recipe();
  }


  openModal(){
      this.modalRef = this.modalService.open(RecipeModalComponent, this.ngbModalOptions)
      this.modalRef.componentInstance.data = this.recipe_full
  }


  pageChanged(event){}

  filter(mealtype){
      // console.log('filtered on type: ', mealtype)
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


  search_recipes(){
      this.addFilter(this.search_value,'keywords')
      // this.commonService.getRecipesbyKeyword(this.search_value).subscribe(data => {
          // this.recipes = data;
      // },
          // error => console.error(error)
      // )
      this.query_recipes()
  }



  addFilter(value,category): void {
     // const input = event.input;
     // const value = event.value;
     if (category=='type'){
         this.filters.type = value
     }
     else if (category == 'keywords'){
         if ((value || '').trim()) {
             this.filters.keywords.push(value.trim());
         }
    }
    else if (category == 'time'){
        this.filters.time = value
    }
    else if (category == 'difficulty'){
        this.filters.difficulty = value
    }

     this.query_recipes()
   }

  removeFilter(filter,category): void {

   if (category == 'keywords'){
       const index = this.filters.keywords.indexOf(filter);
       if (index >= 0) {
           this.filters.keywords.splice(index, 1);
       }
   }
   else if(category == 'type'){
        this.filters.type=''
   }
   else if(category == 'time'){
        this.filters.time=''
   }
   else if(category == 'difficulty'){
        this.filters.difficulty=''
   }

   this.query_recipes()
   // re-run mongo query
   // need to make a generic query to call then. so like just pass in filters. maybe as a dict. so that it can just check like, oh time was passed as a filter type? then query with time. etc


  }


  query_recipes(){
      this.commonService.getRecipesWithFilters(this.filters).subscribe(data => {
          this.recipes = data;
      },
          error => console.error(error)
      )
      this.p=1

  }


  random_recipe(){
      this.commonService.getRandomRecipe().subscribe(data => {
          this.recipe_full = data[0];
          this.openModal()
      },
        error => console.error(error)
      )
  }

}