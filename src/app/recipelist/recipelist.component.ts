import { Component, OnInit, Inject } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service'
import { FormControl, Validators } from '@angular/forms';


export interface DialogData {
  Name: string;
  Ingredients: string[];
  Directions: string[];
  Type: string;
  timelength: number;
  Difficulty: string;
  Pending
}

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
    mealtypes = ['Breakfast', 'Lunch/Dinner', 'Desserts', 'Sauces/Spices', 'Sides', 'Holiday', 'Breads', 'Salads', 'Soups']
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
        Pending: Boolean,
        submittedby: ''
    }

    images = []

    user;

    private modalRef;

    separatorKeysCodes: number[] = [ENTER,COMMA];


  constructor(
      private pantryService: PantryService,
      private modalService: NgbModal,
      private commonService: CommonService,
      private userService: UserService,
      public dialog: MatDialog,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.user = this.userService.user
      this.commonService.getRecipes().subscribe(data => {
          this.recipes = data
      },
          error => console.error(error)
      )

  }

  getImageById(recipeid){
    // console.log('recipeid')
    // console.log(recipeid)
    this.images.forEach(element => {
      // console.log(element)
      if (element.recipeid == recipeid){
        return element;
      }
    });
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
      this.modalRef = this.modalService.open(RecipeModalComponent, { centered: true, size: 'lg'})
      this.modalRef.componentInstance.data = this.recipe_full
      this.modalRef.result.then((result) => {
        // this.query_recipes doesnt sort the recipe results, while getRecipes() does, so gotta check. kinda messy tho
        if (this.filters.keywords.length<1 && this.filters.type=='' && this.filters.time=='' && this.filters.difficulty==''){
          this.commonService.getRecipes().subscribe(data => {
              this.recipes = data
          },
              error => console.error(error)
          )
        }else{
          this.query_recipes()
        }

      }, (reason) => {
        if (this.filters.keywords.length<1 && this.filters.type=='' && this.filters.time=='' && this.filters.difficulty==''){
          this.commonService.getRecipes().subscribe(data => {
              this.recipes = data
          },
              error => console.error(error)
          )
        }else{
          this.query_recipes()
        }
      }
    );
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

  // parseIngredients(res_ings){
  //     //
  //     var ings = res_ings.split('\n')
  //     if (ings.length == 0){
  //       ings = ings.split(', ')
  //       if (ings.length == 0){
  //         ings = ings.split(',')
  //       }
  //     }
  //     return ings
  // }


  openNewRecipeDialog(){
      // show new-recipe-form
      const dialogRef = this.dialog.open(DialogNewRecipeComponent, {
            width: '600px',
            height: '700px',
            autoFocus: false,
            data: {
                Name: this.new_recipe.Name,
                Ingredients: this.new_recipe.Ingredients,
                Directions: this.new_recipe.Directions,
                Pending: true,
                timelength: this.new_recipe.timelength,
                Difficulty: this.new_recipe.Difficulty,
                Type: this.new_recipe.Type
            }
          });

          dialogRef.afterClosed().subscribe(result => {
              this.new_recipe.Ingredients = []
              if (result){
                  // result.Ingredients = this.parseIngredients(result.Ingredients)
                  result.submittedby = this.user.username
                  this.commonService.newRecipe(result).subscribe(data => {
                      this._snackBar.open('Recipe Suggestion Submitted!', 'ok', {
                          duration: 2000,
                      });
                  },
                    error => console.error(error)
                  )
              }

          });

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


@Component({
  selector: 'dialog-new-recipe',
  templateUrl: 'dialog-new-recipe.html',
  styleUrls: ['./dialog-new-recipe.css']
})
export class DialogNewRecipeComponent {

    dialogue_ingredient: string;
    dialogue_direction = '1. ';
    dialogue_type: string;
    dialogue_difficulty: string;
    step_num = 1;
    // dialogue_length: string;
    separatorKeysCodes: number[] = [ENTER,COMMA];


  constructor(
    public dialogRef: MatDialogRef<DialogNewRecipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }



  dialogue_addIngredient(){
     this.data.Ingredients = this.dialogue_ingredient.split(/\r?\n/)
     // this.dialogue_ingredient = '';
  }
  dialogue_addDirection(){
     // this.data.Directions.push(this.dialogue_direction)
     // this.dialogue_direction = '';
     this.data.Directions = this.dialogue_direction.split(/\r?\n/)
  }

  checkSteps(){
      for (var i=1;i<=this.step_num;i++){
          if (this.dialogue_direction.indexOf(i.toString()+'.')==-1){
              // imperfect...
              this.step_num=i-1;
              if (this.step_num < 1){
                  this.step_num = 1;
              }
          }
      }

  }

  addNumbering(){
      this.checkSteps()
      this.step_num+=1
      this.dialogue_direction+=this.step_num+". "
  }


  dialogue_addType(){
     this.data.Type = this.dialogue_type;
  }
  dialogue_addDifficulty(){
     this.data.Difficulty = this.dialogue_difficulty;
  }

  dialogue_removeIngredient(ingredient){
    var index = this.data.Ingredients.indexOf(ingredient, 0);
    if (index > -1) {
       this.data.Ingredients.splice(index, 1);
    }

  }


  // dialogue_addLength(){
  //     console.log('testing addlength')
  //    this.data.Length = this.dialogue_length;
  // }

}