import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogNewRecipeComponent } from '../dialog-new-recipe-component/dialog-new-recipe-component.component';
import { NavigationService } from '../navigation.service';
import { Recipe, RatingInfo } from '../consts/consts';

// interface Ingredient {
//   ingredient: string;
//   isHeader?: boolean;
// }

@Component({
  selector: 'app-recipelist',
  templateUrl: './recipelist.component.html',
  styleUrls: ['./recipelist.component.scss'],
})
export class RecipelistComponent implements OnInit {
  public recipes: Recipe[];
  headerText = 'All Recipes';
  p: number = 1;
  mealtypes = [
    'Breakfast',
    'Lunch/Dinner',
    'Desserts',
    'Sauces/Spices',
    'Sides',
    'Holiday',
    'Breads',
    'Salads',
    'Soups',
  ];
  times = ['0-10 min', '10-30 min', '30-60 min', '60+ min'];
  difficulties = ['Easy', 'Moderate', 'Hard'];
  // tags = ['Gluten Free', 'Low FODMAP', 'Nut Free', 'Soy Free'] //should be: any tag that has been added to a recipe
  tags = ['Nut Free', 'Gluten Free'];
  image_upload: any;
  search_value;
  filters = {
    keywords: [],
    type: '',
    time: '',
    difficulty: '',
    searchIngredients: false,
    tags: '',
  };

  new_recipe = {
    name: '',
    ingredients: [],
    directions: [],
    type: '',
    timelength: 0,
    difficulty: '',
    pending: Boolean,
    submittedby: '',
    author: '',
    rating: 0,
    tags: [],
    yield: '',
    blurb: '',
  };

  images = [];
  ratings: RatingInfo[] = [];

  recipesLoading = true;
  limitedResults = false;
  recipes_sort: string;
  innerWidth: number;
  imgSize: string;

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;

    // get user's filters,searches,sorts,pagination ONLY if navtrigger is not imperative (imperative = router link clicked)
    if (
      this.navigationService.getTrigger() &&
      this.navigationService.getTrigger() !== 'imperative'
    ) {
      let filters = JSON.parse(localStorage.getItem('filters'));
      let pagination = JSON.parse(localStorage.getItem('pagination'));
      if (filters) {
        this.filters = filters;
      }
      if (pagination) {
        this.p = pagination;
      }
    } else {
      // else clear filters
      localStorage.removeItem('filters');
      localStorage.removeItem('pagination');
    }
    this.recipes_sort = this.route.snapshot.paramMap.get('sort');
    if (this.recipes_sort == 'new') {
      this.headerText = 'Latest Recipes';
    }
    this.query_recipes(true);
  }

  getImages(recipeid = '') {
    this.commonService.getImages(recipeid).subscribe(
      (data) => {
        if (recipeid == '') {
          this.images = data;
        } else {
          // if a single recipeid was asked for, then this was an update to a single recipe's imgs. delete those imgs and add any current ones.
          this.images = this.images.filter((img) => img.recipe_id != recipeid);
          this.images.push.apply(this.images, data);
        }
      },
      (error) => console.error(error)
    );
  }

  getImagesS3(recipeid = '') {
    // get an s3 presigned url, then GET to that url to retrieve the images
    this.commonService.getImagesS3(recipeid).subscribe(
      (data) => {
        if (recipeid == '') {
          this.images = data;
        } else {
          // if a single recipeid was asked for, then this was an update to a single recipe's imgs. delete those imgs and add any current ones.
          this.images = this.images.filter((img) => img.recipe_id != recipeid);
          this.images.push.apply(this.images, data);
        }
      },
      (error) => console.error(error)
    );
  }

  getRatings() {
    this.commonService.getRatings().subscribe(
      (data: RatingInfo[]) => {
        this.ratings = data;
      },
      (error) => console.error(error)
    );
  }

  hasImage(recipe_id) {
    return this.images.find((x) => x.recipe_id == recipe_id);
  }

  hasRating(recipe_id) {
    if (this.ratings) {
      return this.ratings.filter((x) => x.recipe_id == recipe_id);
    }
  }

  getRatingCount(recipe_id) {
    if (this.ratings) {
      let toret;
      let rr = this.ratings.filter((x) => x.recipe_id == recipe_id);
      if (!rr || rr.length == 0) {
        toret = 0;
      } else {
        toret = rr[0]['numratings'];
      }
      return toret;
    }
  }
  getRating(recipe_id) {
    if (this.ratings) {
      let toret;
      let rr = this.ratings.filter((x) => x.recipe_id == recipe_id);
      if (!rr || rr.length == 0) {
        toret = 0;
      } else {
        toret = rr[0]['rating'];
      }
      return toret;
    }
  }

  getImgData(recipe) {
    let img = this.images.find(
      (x) => x.recipe_id == recipe.id && x.primary_img == true
    );
    if (img) {
      return img.filedata;
    } else {
      console.log('no img');
    }
  }
  getImgDataS3(recipe) {
    let img = this.images.find(
      (x) => x.recipe_id == recipe.id && x.primary_img == true
    );
    if (img) {
      if (this.innerWidth > 1000) {
        this.imgSize = '';
      } else {
        this.imgSize = '-600-';
      }

      return (
        // 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' +
        'https://dgj7g8gpy2eza.cloudfront.net/' +
        recipe.id +
        this.imgSize +
        img.filename
      );
    } else {
    }
  }

  imgError(event, recipe) {
    let img = this.images.find(
      (x) => x.recipe_id == recipe.id && x.primary_img == true
    );
    event.target.src =
      'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' +
      recipe.id +
      img.filename;
  }

  getImageById(recipeid) {
    this.images.forEach((element) => {
      if (element.recipeid == recipeid) {
        return element;
      }
    });
  }

  loggedIn() {
    return this.userService.getUser();
  }

  viewSingleRecipe(recipe) {
    var uri_param = encodeURIComponent(recipe.id);
    let recipe_url = `https://therecipedoc.com/#/recipe/${uri_param}`;
    this.router.navigate(['/recipe/', recipe.id]);
  }

  pageChanged(event) {
    this.recipesLoading = true;

    localStorage.setItem('pagination', JSON.stringify(this.p));

    if (this.limitedResults) {
      this.recipesLoading = false;
    } else {
      this.query_recipes();
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // readImage(fileInput: any) {
  //   var fileName = fileInput.target.files[0].name;
  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     var file = fileInput.target.files[0];
  //     this.getBase64(file).then((data) => (this.image_upload = data));
  //   }
  // }

  runSearchIfValue() {
    if (this.search_value || this.filters.keywords.length > 0) {
      this.search_recipes();
    }
  }

  search_recipes() {
    this.addFilter(this.search_value, 'keywords');
  }

  addFilter(value, category): void {
    this.recipesLoading = true;
    this.limitedResults = true;
    // this.imagesLoading = true;
    // const input = event.input;
    // const value = event.value;
    if (category == 'type') {
      this.filters.type = value;
    } else if (category == 'keywords') {
      if ((value || '').trim()) {
        this.filters.keywords.push(value.trim());
      }
    } else if (category == 'time') {
      this.filters.time = value;
    } else if (category == 'difficulty') {
      this.filters.difficulty = value;
    } else if (category == 'tag') {
      this.filters.tags = value;
    }

    this.search_value = '';
    this.query_recipes();
    this.p = 1;
    localStorage.setItem('pagination', JSON.stringify(this.p));
    localStorage.setItem('filters', JSON.stringify(this.filters));
  }

  removeFilter(filter, category): void {
    if (category == 'keywords') {
      const index = this.filters.keywords.indexOf(filter);
      if (index >= 0) {
        this.filters.keywords.splice(index, 1);
      }
    } else if (category == 'type') {
      this.filters.type = '';
    } else if (category == 'time') {
      this.filters.time = '';
    } else if (category == 'difficulty') {
      this.filters.difficulty = '';
    } else if (category == 'tag') {
      this.filters.tags = '';
    }

    this.recipesLoading = true;
    if (
      this.filters.type == '' &&
      this.filters.difficulty == '' &&
      this.filters.keywords.length == 0 &&
      this.filters.time == '' &&
      this.recipes_sort == ''
    ) {
      // if no filters set, query normally
      this.limitedResults = false;
      this.commonService.getRecipes().subscribe(
        (data: any) => {
          // this.recipes = data['Items']
          this.recipes = data;
          this.getImages();
          this.recipesLoading = false;
        },
        (error) => console.error(error)
      );
    } else {
      this.query_recipes();
    }

    localStorage.setItem('filters', JSON.stringify(this.filters));
    this.p = 1;
    localStorage.setItem('pagination', JSON.stringify(this.p));
  }

  query_recipes(runImages: boolean = false) {
    this.commonService
      .getRecipesWithFilters(this.filters, this.recipes_sort)
      .subscribe(
        (data: Recipe[]) => {
          this.recipes = data;
          this.recipesLoading = false;
          if (runImages) {
            this.getImagesS3();
            this.getRatings();
          }
        },
        (error) => console.error(error)
      );
    // this.p = 1;
  }

  openNewRecipeDialog() {
    // show new-recipe-form
    const dialogRef = this.dialog.open(DialogNewRecipeComponent, {
      width: '600px',
      height: 'auto',
      autoFocus: false,
      data: {
        edit: false,
        name: this.new_recipe.name,
        ingredients: this.new_recipe.ingredients,
        directions: this.new_recipe.directions,
        pending: true,
        timelength: this.new_recipe.timelength,
        difficulty: this.new_recipe.difficulty,
        type: this.new_recipe.type,
        author: this.new_recipe.author,
        rating: 0,
        tags: [],
        yield: this.new_recipe.yield,
        blurb: this.new_recipe.blurb,
        submittedby: this.new_recipe.submittedby,
        fileToUpload: {
          recipeid: '',
          filedata: null,
          filename: '',
          primary: true,
          dbinsert: false,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.new_recipe.ingredients = [];
      if (result) {
        result.ingredients = result.ingredients.map((ing) => ing.ingredient);
        result.directions = result.directions.map((dir) => dir.step);
        // result.Ingredients = this.parseIngredients(result.Ingredients)
        result.submittedby = this.userService.getUser().username;
        let nutFree = true;
        // result.ingredients.forEach((ing: Ingredient) => {
        result.ingredients.forEach((ing: string) => {
          if (
            ing.toLowerCase().includes('nut') ||
            ing.toLowerCase().includes('cashew') ||
            ing.toLowerCase().includes('almond') ||
            ing.toLowerCase().includes('pecan')
          ) {
            nutFree = false;
          }
        });
        if (nutFree) {
          result.tags.push('Nut Free');
        }
        this.commonService.newRecipe(result).subscribe(
          (data) => {
            this._snackBar.open('Recipe Suggestion Submitted!', 'ok', {
              duration: 2000,
            });
          },
          (error) => console.error(error)
        );
      }
    });
  }

  random_recipe() {
    this.commonService.getRandomRecipe().subscribe(
      (data) => {
        this.viewSingleRecipe(data);
      },
      (error) => console.error(error)
    );
  }

  scrollTop() {
    window.scroll(0, 0);
  }

  toLogin() {
    this.router.navigate(['/login/']);
  }
}
