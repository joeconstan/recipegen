import { Component, OnInit, Input } from '@angular/core'
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { UserService } from '../user.service'
import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.css']
})
export class RecipeModalComponent implements OnInit {

    @Input() data

    public recipe_full: any
    newComment
    recipe_comments

  constructor(
      private pantryService: PantryService,
      public modal: NgbActiveModal,
      private commonService: CommonService,
      private userService: UserService,
      private router: Router,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
      this.recipe_full = this.data
      this.commonService.getComments(this.recipe_full._id).subscribe( data =>{
        console.log(data)
        this.recipe_comments = data;
      },
        error => console.log(error)
      )

      // this.recipe_full = this.pantryService.loadRecipe(this.data)
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


  addComment(){
      // var commentobj = {
          // user:'temp',
          // text:this.newComment,
      // }
      // this.recipe_full.comments.push(commentobj)
      if (!this.userService.user.username || this.userService.user.username==''){
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

}
