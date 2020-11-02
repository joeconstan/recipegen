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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // var recipe_name = decodeURIComponent(this.route.snapshot.paramMap.get('recipe'));
    var recipe_name = this.route.snapshot.paramMap.get('recipe')
    console.log(recipe_name)

    this.commonService.getRecipe(recipe_name).subscribe(data => {
        this.recipe_full = data[0];
          console.log(this.recipe_full)
    },
        error => console.error(error)
    )
  }


}
