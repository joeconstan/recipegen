import { Component, OnInit, Input } from '@angular/core'
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { UserService } from '../user.service'
import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ClipboardService } from 'ngx-clipboard'
import { DomSanitizer } from '@angular/platform-browser';
import { NgxFlickingModule } from '@egjs/ngx-flicking';

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
    recipe_image: any
    editing = false

    editing_name = false
    editing_meta = false
    editing_ing = false
    editing_dir = false

    editable_name = false
    editable_meta = false
    editable_ing = false
    editable_dir = false

    fileToUpload = {
      recipeid:'',
      filedata:null,
      filename:''
    };
    user;
    removeable: boolean[] = [];

  constructor(
      private pantryService: PantryService,
      public modal: NgbActiveModal,
      private commonService: CommonService,
      private userService: UserService,
      private router: Router,
      private _snackBar: MatSnackBar,
      private _clipboardService: ClipboardService,
      private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
      this.user = this.userService.user
      this.recipe_full = this.data
      this.commonService.getComments(this.recipe_full._id).subscribe( data =>{
        this.recipe_comments = data;
      },
        error => console.log(error)
      )

      this.recipe_full.images.forEach((element, i) => {
          this.removeable.push(false);
      });

      // this.commonService.getImages(this.recipe_full._id).subscribe( data => {
      //   if (data){
      //     this.recipe_image = data.data
      //   }
      // },
      //   error => {
      //     console.log(error)
      //   }
      // )

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
          this._snackBar.open('Recipe Approved', 'ok', {
              duration: 2000,
          });
          this.modal.close()
      },
            error => console.error(error)
      )
  }

  rejectRecipe(){
      this.recipe_full.Pending = false
      this.commonService.deleteRecipe(this.recipe_full).subscribe(data => {
        this._snackBar.open('Recipe Deleted', 'ok', {
            duration: 2000,
        });
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
      }else if (section == 'meta'){
        this.editing_meta = true
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

  trackByIdx(index: number, obj: any): any {
    return index;
  }


  addIngredient(){
    this.recipe_full.Ingredients.push('')
  }
  addDirection(){
    this.recipe_full.Directions.push('')
  }

  saveEdits(){

    //set editing false
    this.editing = false
    this.editing_name = false
    this.editing_meta = false
    this.editing_ing = false
    this.editing_dir = false

    // save changes -- if user has admin rights, edits go straight to the databse. otherwise, they go to admins for approval
    var has_admin = this.userService.user && this.userService.user.adminflag == true;

    if (has_admin){
      this.commonService.editRecipe(this.recipe_full).subscribe(data => {
          console.log('edited');
      },
          error => console.error(error)
      )
    }else{
      this._snackBar.open('Unable to submit edits (not allowed)', 'ok', {
          duration: 2000,
      });
      // console.log('need admin priv');
      // if not admin, send edits for approval
      // somehow
      // and show a snackbar


    }

  }


  cancelEdits(){
    //reset text

    //set editing false
    this.editing = false
    this.editing_name = false
    this.editing_meta = false
    this.editing_ing = false
    this.editing_dir = false
  }

  editable(section,torf){
    if (section == 'ingredients'){
      this.editable_ing = torf
    }else if (section == 'name'){
      this.editable_name = torf
    }else if (section == 'directions'){
      this.editable_dir = torf
    }else if (section == 'meta'){
      this.editable_meta = torf
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
    // let recipe_url = `http://localhost:4200/#/recipe/${uri_param}`
    // uncomment for deployment
    let recipe_url = `https://recipe-doc.herokuapp.com/#/recipe/${uri_param}`
    // pop up a dialog letting them copy the url
    console.log(recipe_url)

    this._clipboardService.copy(recipe_url)

  }




  getBase64(file){
      return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
      })
  }




  readImage(fileInput: FileList){
      if (!this.userService.user || this.userService.user.adminflag == false){
        return;
      }
      this.fileToUpload.filedata = fileInput[0];
      this.fileToUpload.filename = fileInput[0].name.toString();
      this.fileToUpload.recipeid = this.recipe_full._id.toString();
      // var fileName = fileInput.target.files[0].name
      // console.log(this.fileToUpload.filename)
      this.getBase64(this.fileToUpload.filedata).then(data => {
        this.fileToUpload.filedata = data
        // console.log('this.fileToUpload.filedata')
        // console.log(this.fileToUpload.filedata)
        // console.log(this.fileToUpload.filedata)
        this.commonService.addRecipeImg(this.fileToUpload).subscribe(data => {
              // console.log(data)
              // on image uploaded,
              // open a snackbar
              this._snackBar.open('Image Added!', 'ok', {
                  duration: 2000,
              });
              // reload the recipe so the image shows up
              this.commonService.getRecipe(this.recipe_full.Name).subscribe(data => {
                  this.recipe_full = data[0];
              },
                  error => console.error(error)
              )

        },
              error => console.error(error)
        )


      });
      // if(fileInput){
          // var file = fileInput.target.files[0]
      // }
  }


  upload_image(){
  }



  removeImage(){

  }

  showremove(torf,i){
    this.removeable[i] = torf;
  }

  isRemoveable(idx){
    return this.removeable[idx];
  }



  onNeedPanel(e) {
    // ADD PANELS
  }

  onMoveEnd(e) {
    // HANDLE INDEX CHANGE
  }



  // helper function for displaying rating stars
  counter(i: number) {
      if (i>0){
        return new Array(i);
      }else{
        return [];
      }
  }

  removeDir(dir){
    var index_dir = this.recipe_full.directions.indexOf(dir);
    if (index_dir !== -1) {
      this.recipe_full.directions.splice(index_dir, 1);
    }
  }

}
