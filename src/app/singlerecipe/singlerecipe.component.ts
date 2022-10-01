import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { recipeObject } from '../../types';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogNewRecipeComponent } from '../dialog-new-recipe-component/dialog-new-recipe-component.component';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

@Component({
  selector: 'app-singlerecipe',
  templateUrl: './singlerecipe.component.html',
  styleUrls: ['./singlerecipe.component.scss'],
})
export class SinglerecipeComponent implements OnInit {
  recipe_full: any;
  newComment;
  recipe_comments;
  editing = false;

  editing_name = false;
  editing_ing = false;
  editing_dir = false;

  editable_name = false;
  editable_ing = false;
  editable_dir = false;
  images = [];
  rating_count;
  recipe_rating;
  scaled_ingredients = [];
  saved = [];
  savedCount;
  recipe_scale = 1;
  user;
  fileToUpload = {
    recipeid: '',
    filedata: null,
    filename: '',
    primary: true,
  };

  measure_system = 'us';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private _clipboardService: ClipboardService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.user = this.userService.user;
    var recipe_id = this.route.snapshot.paramMap.get('recipe');

    this.commonService.getRecipe(recipe_id).subscribe(
      (data: recipeObject) => {
        if ((data.pending || data.deleted) && !this.userAdmin()) {
          // if deleted or pending and user is not admin, redirect to 404
          this.router.navigate(['/404']);
        } else {
          this.recipe_full = data;
          this.getImageNamesS3();

          this.commonService.getRating(this.recipe_full.id).subscribe(
            (data) => {
              this.rating_count = data[0];
              this.recipe_rating = data[1];
            },
            (error) => console.log(error)
          );

          this.commonService.getComments(this.recipe_full.id).subscribe(
            (data) => {
              if (data) {
                this.recipe_comments = data;
              } else {
                this.recipe_comments = [];
              }
            },
            (error) => console.log(error)
          );

          this.commonService.getSavedCount(this.recipe_full.id).subscribe(
            (data) => {
              this.savedCount = data;
            },
            (error) => console.log(error)
          );

          if (this.userService.user) {
            this.getSavedRecipes(this.userService.user.id);
          } else {
            setTimeout(() => {
              if (this.userService.user) {
                this.getSavedRecipes(this.userService.user.id);
              }
            }, 150);
          }

          // storing for use with scaling recipe later
          this.scaled_ingredients = this.recipe_full.ingredients;
        }
      },
      (error) => console.error(error)
    );
  }

  openPrintDialog() {
    window.print();
  }

  openEditRecipeDialog() {
    const dialogRef = this.dialog.open(DialogNewRecipeComponent, {
      width: '600px',
      height: '700px',
      autoFocus: false,
      data: {
        name: this.recipe_full.name,
        ingredients: this.recipe_full.ingredients,
        directions: this.recipe_full.directions,
        pending: false,
        timelength: this.recipe_full.timelength,
        difficulty: this.recipe_full.difficulty,
        type: this.recipe_full.type,
        author: this.recipe_full.author,
        rating: 0,
        tags: this.recipe_full.tags,
        yield: this.recipe_full.yield,
        title: 'Edit Recipe',
        submitText: 'Submit Edits',
        id: this.recipe_full.id,
        blurb: this.recipe_full.blurb,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.recipe_full.Ingredients = [];
      if (result) {
        // result.Ingredients = this.parseIngredients(result.Ingredients)
        result.submittedby = this.userService.user.username;
        let nutFree = true;
        result.ingredients.forEach((ing) => {
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
            this._snackBar.open('Changes saved', 'ok', {
              duration: 2000,
            });
          },
          (error) => console.error(error)
        );
      }
    });
  }

  toggleMeasureSystem(value) {
    this.measure_system = value;
  }

  userAdmin() {
    return this.userService.user && this.userService.user.adminflag == true;
  }

  getSavedRecipes(user_id) {
    this.commonService.getSavedRecipes(user_id).subscribe(
      (data) => {
        data.forEach((record) => {
          this.saved.push(record.id);
        });
      },
      (error) => console.error(error)
    );
  }

  getImageNamesS3() {
    this.commonService.getImagesS3(this.recipe_full.id).subscribe(
      (data) => {
        this.images = data;
      },
      (error) => console.error(error)
    );
  }

  getImagesS3(recipe) {
    let imgs = this.images.filter((x) => x.recipe_id == recipe.id);
    imgs.forEach((img) => {
      img.url =
        'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' +
        recipe.id +
        img.filename;
    });
    return imgs;
  }

  retrieveAmountsFromIngredient(ingredient: string) {
    let amounts: string[];
    let regx = /(\d\s\d|\d|[/]|[.](\d+))+/g;
    // let regx = /(\d\s\d|\d|[/]|[.])+/g;
    // let regx = /(\d\s\d|\d|[/]|[.]| - |[-])+/g;
    // /(\d\s\d|\d|[/]|[-])+/g;
    // /(\d|[/]|\s|[-])+/g;
    // ((\d)+(|[/]|\s|[-]))+
    let matches = [];
    for (let match of ingredient.matchAll(regx)) {
      matches.push(match);
    }
    return matches.reverse();
  }

  fractionize(decimal) {
    if (decimal - Math.floor(decimal) == 0) {
      return decimal;
    } else {
      // if .5 in it, return predecimal + ' ' + 1/2
      let splits = decimal.toString().split('.');
      let predecimal = splits[0];
      let fract = '';
      if (splits[1]) {
        if (splits[1] == 5) {
          fract = '1/2';
        } else if (splits[1] == 25) {
          fract = '1/4';
        } else if (splits[1] == 75) {
          fract = '3/4';
        } else if (splits[1] == 13) {
          fract = '1/8';
        } else if (splits[1] == 63) {
          fract = '5/8';
        } else if (splits[1] == 34) {
          fract = '1/3';
        } else if (splits[1].toString() == '01') {
          fract = '';
        } else {
          fract = decimal;
        }
      } else {
        fract = decimal;
      }
      let newstr = '';

      if (predecimal == '0') {
        newstr = fract;
      } else {
        newstr = predecimal + ' ' + fract;
      }
      return newstr;
    }
  }

  scaleAmount(amount: string, multiple: number) {
    let scaledAmount: number;
    let afterws, beforews;
    if (amount.includes('/')) {
      afterws = amount.split(' ');
      if (afterws.length > 1) {
        beforews = afterws[0];
        afterws = afterws[1];
      } else {
        afterws = amount;
      }

      let numerator = afterws.split('/')[0];
      let denominator = afterws.split('/')[1];
      let dec = Number((Number(numerator) / Number(denominator)).toFixed(2));
      if (beforews) {
        scaledAmount =
          Number(beforews) * multiple + Number((dec * multiple).toFixed(2));
      } else {
        scaledAmount = Number((dec * multiple).toFixed(2));
      }
    } else {
      scaledAmount = Number(amount) * multiple;
    }
    return this.fractionize(scaledAmount);
  }

  scaleRecipe(multiple) {
    this.recipe_scale = multiple;
    if (multiple != 1) {
      let ing_els = [];
      this.recipe_full.ingredients.forEach((ing, index) => {
        // parse for number at beginning of string
        // if found, multiply it by the scale
        let newing = JSON.parse(JSON.stringify(ing));
        let matches = this.retrieveAmountsFromIngredient(newing);
        if (matches) {
          matches.forEach((match) => {
            let amount = match[0];
            let str_index = match.index;
            let match_length = match[0].length;
            let scaledAmount;
            if (amount.includes(' - ')) {
              // if there's a range, calculate them separately
              let resa = amount.split('-')[0].trim();
              let resb = amount.split('-')[1].trim();
              let scaledAmount1 = this.scaleAmount(resa, multiple);
              let scaledAmount2 = this.scaleAmount(resb, multiple);
              scaledAmount = scaledAmount1 + ' - ' + scaledAmount2;
            } else if (amount.includes('-')) {
              // if there's a range, calculate them separately
              let resa = amount.split('-')[0].trim();
              let resb = amount.split('-')[1].trim();
              let scaledAmount1 = this.scaleAmount(resa, multiple);
              let scaledAmount2 = this.scaleAmount(resb, multiple);
              scaledAmount = scaledAmount1 + '-' + scaledAmount2;
            } else {
              scaledAmount = this.scaleAmount(amount, multiple);
            }
            newing =
              newing.slice(0, str_index) +
              scaledAmount +
              ' ' +
              newing.slice(str_index + match_length);
          });
          ing_els.push(newing);
        } else {
          ing_els.push(newing);
        }
      });
      this.scaled_ingredients = ing_els;
    }
  }

  userSaved() {
    if (this.saved.indexOf(this.recipe_full.id) > -1) {
      return true;
    }
    return false;
  }

  rateRecipe(event) {
    let rating = event.target.htmlFor;
    // if user not signed in, redirect to sign in
    if (
      !this.userService.user ||
      (this.userService.user && !this.userService.user.username) ||
      this.userService.user.username == ''
    ) {
      this.router.navigate(['/login']);
    } else {
      // otherwise, submit rating
      let ratingObj = {
        recipeid: this.recipe_full.id,
        username: this.userService.user.username,
        rating: rating,
      };
      this.commonService.rateRecipe(ratingObj).subscribe(
        (data) => {
          this.commonService.getRating(this.recipe_full.id).subscribe(
            (data) => {
              this.rating_count = data[0];
              this.recipe_rating = data[1];
            },
            (error) => console.log(error)
          );
        },
        (error) => console.error(error)
      );
    }
  }

  addComment() {
    if (
      !this.userService.user ||
      !this.userService.user.username ||
      this.userService.user.username == ''
    ) {
      this.router.navigate(['/login']);
    } else {
      var commentObj = {
        user_id: this.userService.user.id,
        username: this.userService.user.username,
        recipe_id: this.recipe_full.id,
        text: this.newComment,
      };

      this.recipe_comments.push(commentObj);
      this.newComment = '';

      this.commonService.commentRecipe(commentObj).subscribe(
        (data) => {
          // console.log(data)
        },
        (error) => console.error(error)
      );
    }
  }

  bookmark_recipe() {
    // if user logged in, add recipe to saved
    // else, close modal & redirect to login page
    if (!this.userService.getUser()) {
      this.router.navigate(['/login']);
    }

    var user = this.userService.getUser();
    // if (!user.saved){
    //   user.saved = [];
    // }
    this.saved.push(this.recipe_full.id);

    // this.userService.setUser(user)

    this.commonService.saveRecipe(user.id, this.recipe_full.id).subscribe(
      (data) => {
        this._snackBar.open('Recipe Saved', 'Ok', {
          duration: 2000,
        });
      },
      (error) => console.error(error)
    );
  }
  unbookmark_recipe() {
    // if user logged in, add recipe to saved
    if (this.userService.getUser()) {
      var user = this.userService.getUser();
      const index = this.saved.indexOf(this.recipe_full.id);
      if (index >= 0) {
        this.saved.splice(index, 1);
        // this.userService.setUser(user)
        this.commonService.unSaveRecipe(user.id, this.recipe_full.id).subscribe(
          (data) => {
            this._snackBar.open('Recipe removed from saved list', 'ok', {
              duration: 2000,
            });
          },
          (error) => console.error(error)
        );
      }
    }
    // else, close modal & redirect to login page
    else {
      this.router.navigate(['/login']);
    }
  }

  shareRecipe() {
    var uri_param = encodeURIComponent(this.recipe_full.id);
    let recipe_url = `https://therecipedoc.com/#/recipe/${uri_param}`;
    this._clipboardService.copy(recipe_url);
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  readImage(fileInput: FileList) {
    if (
      !this.userService.user ||
      (this.userService.user && this.userService.user.adminflag == false)
    ) {
      return;
    }
    this.fileToUpload.filedata = fileInput[0];
    this.fileToUpload.filename = fileInput[0].name.toString();
    this.fileToUpload.recipeid = this.recipe_full.id.toString();
    this.fileToUpload.primary = this.images.length < 1;
    let filetypea = this.fileToUpload.filename.split('.');
    let filetype = filetypea[filetypea.length - 1].toLowerCase();
    if (
      filetype != 'jpg' &&
      filetype != 'png' &&
      filetype != 'jpeg' &&
      filetype != 'gif'
    ) {
      this._snackBar.open('Incorrect file type', 'ok', {
        duration: 2000,
      });
      return;
    }

    // var fileName = fileInput.target.files[0].name
    this.getBase64(this.fileToUpload.filedata).then((data) => {
      this.fileToUpload.filedata = data;
      // this.commonService.gets3Url().subscribe(data => {
      // get s3 presigned upload url
      // use the url to post the image to s3, where it will then move to db (how? some trigger?)
      // this.commonService.addRecipeImgS3(data['url'], data['fields'], this.fileToUpload).subscribe(data => {
      this.commonService.addRecipeImgS3(this.fileToUpload).subscribe(
        (data) => {
          // this.commonService.addRecipeImg(this.fileToUpload).subscribe(data => {
          this._snackBar.open('Image Added!', 'ok', {
            duration: 2000,
          });
          // reload the recipe so the image shows up
          this.commonService.getRecipe(this.recipe_full.id).subscribe(
            (data) => {
              this.recipe_full = data;
              this.refreshImages();
            },
            (error) => console.error(error)
          );
        },
        (error) => console.error(error)
      );

      // },
      // error => console.error(error)
      // )
      // });
    });
  }

  refreshImages() {
    this.commonService.getImages(this.recipe_full.id).subscribe(
      (data) => {
        this.images = data;
      },
      (error) => console.error(error)
    );
  }

  approveRecipe() {
    this.recipe_full.pending = false;
    this.commonService.updateRecipe(this.recipe_full).subscribe(
      (data) => {
        this._snackBar.open('Recipe Approved', 'ok', {
          duration: 2000,
        });
        this.router.navigate(['/pending']);
      },
      (error) => console.error(error)
    );
  }

  rejectRecipe() {
    this.recipe_full.pending = false;
    this.commonService.deleteRecipe(this.recipe_full.id).subscribe(
      (data) => {
        this._snackBar.open('Recipe Deleted', 'ok', {
          duration: 2000,
        });
        this.router.navigate(['/pending']);
      },
      (error) => console.error(error)
    );
  }
}
