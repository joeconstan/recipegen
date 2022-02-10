import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service'
import { UserService } from '../user.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-singlerecipe',
  templateUrl: './singlerecipe.component.html',
  styleUrls: ['./singlerecipe.component.css']
})
export class SinglerecipeComponent implements OnInit {

  recipe_full: any
  newComment
  recipe_comments
  editing = false

  editing_name = false
  editing_ing = false
  editing_dir = false

  editable_name = false
  editable_ing = false
  editable_dir = false
  images = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    var recipe_id = this.route.snapshot.paramMap.get('recipe')

    this.commonService.getRecipe(recipe_id).subscribe(data => {
        this.recipe_full = data;
        this.getImageNamesS3()
    },
        error => console.error(error)
    )

  }

  getImageNamesS3(){
    this.commonService.getImagesS3(this.recipe_full.id).subscribe(data => {
        this.images = data
    },
        error => console.error(error)
    )
  }

  getImagesS3(recipe){
    let imgs = this.images.filter(x=>x.recipe_id == recipe.id);
    imgs.forEach(img => {
      img.url = 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + recipe.id+img.filename
    });
    return imgs;
  }


}
