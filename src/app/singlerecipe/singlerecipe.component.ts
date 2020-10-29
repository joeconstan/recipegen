import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service'
import { UserService } from '../user.service'

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
    private userService: UserService
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







  bookmark_recipe(){
      // if user logged in, add recipe to saved
      if(this.userService.getUser()){
          console.log('saved recipe')
      }
      // else, close modal & redirect to login page
      else{
          this.modal.close()
          this.router.navigate(['/login'])
      }

      var user = this.userService.getUser()
      user.Saved.push(this.recipe_full._id)

      this.userService.setUser(user)

      this.commonService.saveRecipe(user).subscribe(data => {
          this._snackBar.open('Recipe Saved!', 'ok', {
              duration: 2000,
          });
      },
            error => console.error(error)
      )

  }
  unbookmark_recipe(){
      // if user logged in, add recipe to saved
      if(this.userService.getUser()){
          var user = this.userService.getUser()
          const index = user.Saved.indexOf(this.recipe_full._id);
          if (index >= 0) {
              user.Saved.splice(index, 1);
          }
          this.userService.setUser(user)

          this.commonService.unSaveRecipe(user).subscribe(data => {
              this._snackBar.open('Recipe removed from saved list', 'ok', {
                  duration: 2000,
              });
          },
                error => console.error(error)
          )
      }
      // else, close modal & redirect to login page
      else{
          this.modal.close()
          this.router.navigate(['/login'])
      }
  }


  addComment(){
      if (!this.userService.user || !this.userService.user.username || this.userService.user.username==''){
          this.modal.close()
          this.router.navigate(['/login'])
      }else{
          var commentObj = {
              recipeid: this.recipe_full._id,
              userid: this.userService.user._id,
              username: this.userService.user.username,
              text: this.newComment
          }

          this.recipe_comments.push(commentObj)
          this.newComment = ''

          // this.commonService.commentRecipe(this.recipe_full).subscribe(data => {
          this.commonService.commentRecipe(commentObj).subscribe(data => {
                console.log(data)
          },
                error => console.error(error)
          )
      }

  }

  approveRecipe(){
      this.recipe_full.Pending = false
      this.commonService.updateRecipe(this.recipe_full).subscribe(data => {
          this.modal.close()
      },
            error => console.error(error)
      )
  }

  rejectRecipe(){
      this.recipe_full.Pending = false
      this.commonService.deleteRecipe(this.recipe_full).subscribe(data => {
          this.modal.close()
      },
          error => console.error(error)
      )
  }

  editRecipe(section){
      // this.editing = true
      if (section == 'ingredients'){
        this.editing_ing = true
      }else if (section == 'directions'){
        this.editing_dir = true
      }else if (section == 'name'){
        this.editing_name = true
      }
      // var editable_dir_string = ''
      // this.recipe_full.Directions.forEach(element => {
      //     editable_dir_string+=element+'\n'
      // });
      // // this.TAdirections = this.recipe_full.Directions
      // this.TAdirections = editable_dir_string
      //
      // var editable_ing_string = ''
      // this.recipe_full.Ingredients.forEach(element => {
      //     editable_ing_string+=element+'\n'
      // });
      // // this.TAdirections = this.recipe_full.Directions
      // this.TAIngredients = editable_ing_string
  }

  saveEdits(){
    // save changes -- if user has admin rights, edits go straight to the databse. otherwise, they go to admins for approval

    //set editing false
    this.editing = false
    this.editing_name = false
    this.editing_ing = false
    this.editing_dir = false
  }


  cancelEdits(){
    //reset text

    //set editing false
    this.editing = false
  }

  editable(section,torf){
    if (section == 'ingredients'){
      this.editable_ing = torf
    }
    else if (section == 'name'){
      this.editable_name = torf
    }
    else if (section == 'directions'){
      this.editable_dir = torf
    }
  }


  userSaved(){
      if (this.userService.user){
        if (this.userService.user.Saved.indexOf(this.recipe_full._id) > -1){
            return true
        }
      }
      return false
  }

  shareRecipe(){
    var uri_param = encodeURIComponent(this.recipe_full.Name)
    let recipe_url = `http://localhost:4200/recipe/${uri_param}`
    // pop up a dialog letting them copy the url
    console.log(recipe_url)
    console.log(uri_param)

  }






}
