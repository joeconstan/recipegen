import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../user.service'
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


export interface DialogData {
  name: string;
  ingredients: string[];
  directions: string[];
  type: string;
  timelength: number;
  timeWarning: boolean;
  difficulty: string;
  difficultyWarning: boolean;
  pending: boolean;
  author: string;
  rating: number;
  tags: string[];
  yield: string;
}

@Component({
  selector: 'app-recipelist',
  templateUrl: './recipelist.component.html',
  styleUrls: ['./recipelist.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class RecipelistComponent implements OnInit {

    public recipes: any;
    recipe_full
    recipe
    p: number = 1;
    mealtypes = ['Breakfast', 'Lunch/Dinner', 'Desserts', 'Sauces/Spices', 'Sides', 'Holiday', 'Breads', 'Salads', 'Soups']
    times = ['0-10 min','10-30 min','30-60 min','60+ min']
    difficulties = ['Easy','Moderate','Hard']
    // tags = ['Gluten Free', 'Low FODMAP', 'Nut Free', 'Soy Free'] //should be: any tag that has been added to a recipe
    tags = ['Nut Free', 'Gluten Free']
    image_upload: any;
    search_value
    filters = {
        'keywords':[],
        'type':'',
        'time':'',
        'difficulty':'',
        'searchIngredients':false,
        'tags':''
    }

    new_recipe = {
        Name:'',
        Ingredients:[],
        Directions:[],
        Type:'',
        timelength: 0,
        Difficulty: '',
        Pending: Boolean,
        submittedby: '',
        author: '',
        rating: 0,
        tags: [],
        yield: ''
    }

    images = []
    ratings = []

    user;

    private modalRef;

    separatorKeysCodes: number[] = [ENTER,COMMA];

    recipesLoading = true;
    // imagesLoading = true;

    // recipeCount = 100;

    limitedResults = false;
    modal_images = [];
    dev = true;
    // searchIngredients = false

  constructor(
      private pantryService: PantryService,
      private modalService: NgbModal,
      private commonService: CommonService,
      private userService: UserService,
      public dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.user = this.userService.user

      this.commonService.getRecipes().subscribe(data => {
          this.recipes = data
          this.getImagesS3()
          this.getRatings()
          this.recipesLoading = false;
      },
          error => console.error(error)
      )
  }

  getImages(recipeid=''){
    this.commonService.getImages(recipeid).subscribe(data => {
        if (recipeid==''){
          this.images = data
        }else{
          // if a single recipeid was asked for, then this was an update to a single recipe's imgs. delete those imgs and add any current ones.
          this.images = this.images.filter(img=>img.recipe_id!=recipeid)
          this.images.push.apply(this.images, data);
        }

    },
        error => console.error(error)
    )
  }

  getImagesS3(recipeid=''){
    // get an s3 presigned url, then GET to that url to retrieve the images
    this.commonService.getImagesS3(recipeid).subscribe(data => {
        if (recipeid==''){
          // console.log(data['Contents'])
          // console.log(data)
          this.images = data
          // this.images.forEach(element => {
          // });
          // use this url ^ to see what objects exist and then check the tags to see which recipes they belong to
          // then construct a url like
          // https://recipeimagesbucket.s3.us-west-2.amazonaws.com/bird_wp.jpg
          // to actually view the images

          // just return the result of list objects instead of making a presigned..


          // this.images = data
        }else{
          // if a single recipeid was asked for, then this was an update to a single recipe's imgs. delete those imgs and add any current ones.
          this.images = this.images.filter(img=>img.recipe_id!=recipeid)
          this.images.push.apply(this.images, data);
        }

    },
        error => console.error(error)
    )
  }

  getRatings(){
    this.commonService.getRatings().subscribe(data => {
      // data is in form:
      // [recipe_id, numRatings, rating]
      this.ratings = data
    },
        error => console.error(error)
    )
  }


  hasImage(recipe_id){
    return this.images.find(x=>x.recipe_id == recipe_id)
  }

  hasRating(recipe_id){
    if (this.ratings){
      return this.ratings.filter(x=>x.recipe_id == recipe_id)
    }
  }

  getRatingCount(recipe_id){
    if (this.ratings){
      let toret
      let rr = this.ratings.filter(x=>x.recipe_id == recipe_id)
      if (!rr || rr.length==0){
        toret = 0
      }else{
        toret = rr[0]['numratings']
      }
      return toret
    }
  }
  getRating(recipe_id){
    if (this.ratings){
      let toret
      let rr = this.ratings.filter(x=>x.recipe_id == recipe_id)
      if (!rr || rr.length==0){
        toret = 0
      }else{
        toret = rr[0]['rating']
      }
      return toret
    }
  }

  getImgData(recipe){
     let img = this.images.find(x=>x.recipe_id == recipe.id && x.primary_img == true)
     if (img){
       return img.filedata
     }else{
       console.log('no img')
     }
  }
  getImgDataS3(recipe){
     let img = this.images.find(x=>x.recipe_id == recipe.id && x.primary_img == true)
     if (img){
       // console.log('https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + img.filename)
       return 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + recipe.id+img.filename
     }else{
       // console.log('no img')
     }
  }


  getImageById(recipeid){
    this.images.forEach(element => {
      if (element.recipeid == recipeid){
        return element;
      }
    });
  }


  loggedIn(){
    return this.userService.getUser()
  }

  get_full_recipe(){

      this.commonService.getRecipe(this.recipe._id).subscribe(data => {
          this.recipe_full = data;
          this.openModal()
      },
          error => console.error(error)
      )
  }

  viewRecipeModal(recipe) {
      var uri_param = encodeURIComponent(recipe.id)
      // let recipe_url = `http://localhost:4200/#/recipe/${uri_param}`
      let recipe_url = `https://therecipedoc.com/#/recipe/${uri_param}`
      // window.location.href = recipe_url;
      this.router.navigate(['/recipe/',recipe.id])
      //
      // this.modal_images = [];
      // this.recipe = recipe;
      // this.recipe_full = recipe;
      // let imgs = this.images.filter(x=>x.recipe_id == recipe.id);
      // this.modal_images = imgs;
      // this.openModal()
  }


  addedimgs(){

  }

  openModal(){
      this.modalRef = this.modalService.open(RecipeModalComponent, {
        centered: true, size: 'xl'
     })
      this.modalRef.componentInstance.data = {
        'recipe': this.recipe_full,
        'images': this.modal_images
      }
      this.modalRef.result.then((result) => {
        // ON CLOSE
        // this.query_recipes doesnt sort the recipe results, while getRecipes() does, so gotta check. kinda messy tho
        if (this.filters.keywords.length<1 && this.filters.type=='' && this.filters.time=='' && this.filters.difficulty==''){
          // this.commonService.getRecipes('5f7dfef63317963e9c042bdd').subscribe(data => {
              // this.recipes = data['Items']
              // this.lastEvaluatedKey = data['LastEvaluatedKey']['_id']
              // this.recipesByPage.push({
                // 'page': this.p,
                // 'recipes': this.recipes
              // })
          // },
              // error => console.error(error)
          // )
            // this.recipes = this.recipesByPage.find(x=>x.page == this.p).recipes
        }else{
          this.query_recipes()
        }

      }, (reason) => {
        // ON DISMISS
        if (this.filters.keywords.length<1 && this.filters.type=='' && this.filters.time=='' && this.filters.difficulty==''){
          // this.commonService.getRecipes('5f7dfef63317963e9c042bdd').subscribe(data => {
          //     this.recipes = data['Items']
          //     this.lastEvaluatedKey = data['LastEvaluatedKey']['_id']
          //     this.recipesByPage.push({
          //       'page': this.p,
          //       'recipes': this.recipes
          //     })
          // },
          //     error => console.error(error)
          // )
            // this.recipes = this.recipesByPage.find(x=>x.page == this.p).recipes
        // this.getImages(this.recipe_full.id)
        this.getImagesS3(this.recipe_full.id)
        }else{
          this.query_recipes()
        }
      }
    );
  }

  pageChanged(event){
    // this.imagesLoading = true;
    this.recipesLoading = true;
    if (this.limitedResults){
      this.recipesLoading = false;
    }

    else{
      // if (this.recipesByPage.find(x=>x.page == this.p)){
      //     this.recipes = this.recipesByPage.find(x=>x.page == this.p).recipes
      //     this.recipesLoading = false;
      //     // this.getImages(this.recipes.map(x=>x._id))
      // }
        this.commonService.getRecipes().subscribe(data => {
            this.recipes = data
            // this.lastEvaluatedKey = data['LastEvaluatedKey']['_id']
            // this.recipesByPage.push({
            //   'page': this.p,
            //   'recipes': this.recipes
            // })
            // this.getImages(this.recipes.map(x=>x._id))
            this.recipesLoading = false;
        },
            error => console.error(error)
        )
    }

  }

  // filter(mealtype){
  //     // console.log('filtered on type: ', mealtype)
  //     this.commonService.getRecipesByType(mealtype).subscribe(data => {
  //         // console.log(data);
  //         this.recipes = data;
  //     },
  //         error => console.error(error)
  //     )
  //
  // }



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


  runSearchIfValue(){
    if (this.search_value || this.filters.keywords.length > 0){
      this.search_recipes()
    }
  }



  search_recipes(){
      this.addFilter(this.search_value,'keywords')
      // this.commonService.getRecipesbyKeyword(this.search_value).subscribe(data => {
          // this.recipes = data;
      // },
          // error => console.error(error)
      // )
      // this.query_recipes()
  }



  addFilter(value,category): void {
     this.recipesLoading = true;
     this.limitedResults = true
     // this.imagesLoading = true;
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
      else if (category == 'tag'){
          this.filters.tags = value
      }

      this.search_value = ''
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
   else if(category == 'tag'){
        this.filters.tags=''
   }

   this.recipesLoading = true;
   // this.imagesLoading = true;
   if (this.filters.type == '' && this.filters.difficulty == '' && this.filters.keywords.length == 0 && this.filters.time==''){
      // if no filters set, query normally
       this.limitedResults = false;
       this.commonService.getRecipes().subscribe(data => {
           // this.recipes = data['Items']
           this.recipes = data
           this.getImages()
           // this.recipesByPage.push({
           //   'page': this.p,
           //   'recipes': this.recipes,
           //   'images': []
           // })
           // this.lastEvaluatedKey = data['LastEvaluatedKey']['_id']
           // this.getImages(this.recipes.map(x=>x._id))
           this.recipesLoading = false;
       },
           error => console.error(error)
       )
       // this.commonService.getRecipeCount().subscribe(data => {
       //     this.recipeCount = data['records'];
       // },
       //     error => console.error(error)
       // )
   }
   else{
      this.query_recipes();
   }
   // re-run mongo query
   // need to make a generic query to call then. so like just pass in filters. maybe as a dict. so that it can just check like, oh time was passed as a filter type? then query with time. etc

  }


  query_recipes(){
      this.commonService.getRecipesWithFilters(this.filters).subscribe(data => {
          this.recipes = data;
          this.recipesLoading = false;
          // this.recipeCount = this.recipes.length
          // this.getImages(this.recipes.map(x=>x._id))
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
                Type: this.new_recipe.Type,
                author: this.new_recipe.author,
                rating: 0,
                tags: [],
                yield: this.new_recipe.yield
            }
          });

          dialogRef.afterClosed().subscribe(result => {
              this.new_recipe.Ingredients = []
              if (result){
                  // result.Ingredients = this.parseIngredients(result.Ingredients)
                  result.submittedby = this.userService.user.username
                  let nutFree = true;
                  result.Ingredients.forEach(ing => {
                    if (ing.toLowerCase().includes('nut') || ing.toLowerCase().includes('cashew') || ing.toLowerCase().includes('almond') || ing.toLowerCase().includes('pecan')){
                      nutFree = false;
                    }
                  });
                  if (nutFree){
                    result.tags.push('Nut Free')
                  }
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
          this.recipe_full = data;
          // console.log(data);
          this.modal_images = this.images.filter(x=>x.recipe_id == data['id']);

          this.openModal()
      },
        error => console.error(error)
      )
  }

  scrollTop(){
    window.scroll(0,0)
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
    import = false
    recipeurl: string;

  constructor(
    public dialogRef: MatDialogRef<DialogNewRecipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }



  dialogue_addIngredient(){
     this.data.ingredients = this.dialogue_ingredient.split(/\r?\n/)
     // this.dialogue_ingredient = '';
  }
  dialogue_addDirection(){
     // this.data.Directions.push(this.dialogue_direction)
     // this.dialogue_direction = '';
     this.data.directions = this.dialogue_direction.split(/\r?\n/)
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
    // get cursor position
      // so, if dialogue_direction now has a newline character where previously it didnt...then..ugh but idk. that happens after the numbering, i think
      this.checkSteps()
      this.step_num+=1
      this.dialogue_direction+=this.step_num+". "
  }


  dialogue_addType(){
     this.data.type = this.dialogue_type;
  }
  // dialogue_addTimeWarning(){
    // this.data.timeWarning = this.di
  // }

  dialogue_addDifficulty(){
     this.data.difficulty = this.dialogue_difficulty;
  }

  dialogue_removeIngredient(ingredient){
    var index = this.data.ingredients.indexOf(ingredient, 0);
    if (index > -1) {
       this.data.ingredients.splice(index, 1);
    }
  }


  importRecipe(){
    this.import = true;
    console.log(this.recipeurl)
  }


  // dialogue_addLength(){
  //     console.log('testing addlength')
  //    this.data.Length = this.dialogue_length;
  // }

}