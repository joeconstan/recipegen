import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss'],
})
export class SavedComponent implements OnInit {
  public recipes: any;
  p: number = 1;
  mealtypes = [
    'Breakfast',
    'Lunch/Dinner',
    'Desserts',
    'Sauces/Sides',
    'Holiday',
    'Breads',
    'Salads',
    'Soups',
  ];
  headerText = 'Saved Recipes';

  times = ['0-10 min', '10-30 min', '30-60 min', '60+ min'];
  difficulties = ['Easy', 'Moderate', 'Hard'];
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

  tags = ['Nut Free', 'Gluten Free'];

  new_recipe = {
    Name: '',
    Ingredients: [],
    Directions: [],
    Type: '',
    timelength: 0,
    Difficulty: '',
    Pending: Boolean,
  };

  images = [];
  modal_images = [];

  ngbModalOptions: NgbModalOptions = {
    centered: true,
    size: 'xl',
    beforeDismiss: () => {
      this.commonService
        .getSavedRecipes(this.userService.getUser().id)
        .subscribe(
          (data) => {
            this.recipes = data;
          },
          (error) => console.error(error)
        );
      return true;
    },
  };

  recipesLoading = true;

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.userService.getUser()) {
      this.commonService
        .getSavedRecipes(this.userService.getUser().id)
        .subscribe(
          (data) => {
            this.recipesLoading = false;
            this.recipes = data;
            this.getImagesS3();
          },
          (error) => console.error(error)
        );
    } else {
      setTimeout(() => {
        if (this.userService.getUser()) {
          this.commonService
            .getSavedRecipes(this.userService.getUser().id)
            .subscribe(
              (data) => {
                this.recipesLoading = false;
                this.recipes = data;
                this.getImagesS3();
              },
              (error) => console.error(error)
            );
        }
      }, 150);
    }
  }

  runSearchIfValue() {
    if (this.search_value || this.filters.keywords.length > 0) {
      this.search_recipes();
    }
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

  hasImage(recipe_id) {
    return this.images.find((x) => x.recipe_id == recipe_id);
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
      return (
        'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' +
        recipe.id +
        img.filename
      );
    } else {
    }
  }

  // get_full_recipe() {
  //   this.commonService.getRecipe(this.recipe.name).subscribe(
  //     (data) => {
  //       this.recipe_full = data;
  //       this.openModal();
  //     },
  //     (error) => console.error(error)
  //   );
  // }

  viewRecipeModal(recipe) {
    var uri_param = encodeURIComponent(recipe.id);
    let recipe_url = `https://therecipedoc.com/#/recipe/${uri_param}`;
    this.router.navigate(['/recipe/', recipe.id]);
  }

  // openModal() {
  //   this.modalRef = this.modalService.open(
  //     RecipeModalComponent,
  //     this.ngbModalOptions
  //   );
  //   this.modalRef.componentInstance.data = this.recipe_full;
  //   this.modalRef.componentInstance.data = {
  //     recipe: this.recipe_full,
  //     images: this.modal_images,
  //   };
  // }

  pageChanged(event) {
    this.recipesLoading = true;
    this.query_recipes();
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  readImage(fileInput: any) {
    var fileName = fileInput.target.files[0].name;
    // console.log(fileName)
    if (fileInput.target.files && fileInput.target.files[0]) {
      var file = fileInput.target.files[0];
      this.getBase64(file).then((data) => (this.image_upload = data));
    }
  }

  search_recipes() {
    this.addFilter(this.search_value, 'keywords');
    // this.commonService.getRecipesbyKeyword(this.search_value).subscribe(data => {
    // this.recipes = data;
    // },
    // error => console.error(error)
    // )
    this.query_recipes();
  }

  toLogin() {
    this.router.navigate(['/login/']);
  }

  scrollTop() {
    window.scroll(0, 0);
  }

  addFilter(value, category): void {
    this.recipesLoading = true;
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
    }

    this.query_recipes();
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

    this.query_recipes();
    // re-run mongo query
    // need to make a generic query to call then. so like just pass in filters. maybe as a dict. so that it can just check like, oh time was passed as a filter type? then query with time. etc
  }

  query_recipes() {
    this.commonService.getRecipesWithFilters(this.filters).subscribe(
      (data) => {
        this.recipes = data;
        this.recipesLoading = false;
      },
      (error) => console.error(error)
    );
    this.p = 1;
  }

  // random_recipe() {
  //   this.commonService.getRandomRecipe().subscribe(
  //     (data) => {
  //       this.recipe_full = data[0];
  //       this.openModal();
  //     },
  //     (error) => console.error(error)
  //   );
  // }
}
