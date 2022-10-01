import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
})
export class ListPageComponent implements OnInit {
  list: any;
  listRecipes = [];
  images: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    var list_id = this.route.snapshot.paramMap.get('list');
    // get full list from db, and assign to this.list
    this.getImagesS3();
    this.commonService.getList(list_id).subscribe(
      (data) => {
        this.list = data;

        this.commonService.getRecipes().subscribe(
          (data) => {
            let recipes: any = data;
            this.listRecipes = recipes.filter((x) =>
              this.list.recipes.includes(x.id)
            );
          },
          (error) => console.error(error)
        );
      },
      (error) => console.error(error)
    );
  }

  getRecipeLink(recipe) {
    var uri_param = encodeURIComponent(recipe.id);
    let recipe_url = `http://localhost:4200/#/recipe/${uri_param}`;
    // let recipe_url = `https://therecipedoc.com/#/recipe/${uri_param}`
    return recipe_url;
  }

  getImagesS3() {
    this.commonService.getImagesS3().subscribe(
      (data) => {
        this.images = data;
      },
      (error) => console.error(error)
    );
  }

  getCoverImage() {
    return (
      'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' +
      this.list.coverimgfilename
    );
  }

  getImage(recipeid) {
    if (this.images) {
      let img = this.images.find(
        (x) => x.recipe_id == recipeid && x.primary_img == true
      );
      if (img) {
        return (
          'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' +
          recipeid +
          img.filename
        );
      }
    }
  }
}
