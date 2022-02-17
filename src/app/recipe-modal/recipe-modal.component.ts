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
      filename:'',
      primary: true
    };
    user;
    removeable: boolean[] = [];
    primary: boolean[] = [];
    images = []
    modal_images;
    recipe_scale = 1
    originalIngScale
    scaled_ingredients = []

  constructor(
      private pantryService: PantryService,
      public modal: NgbActiveModal,
      private commonService: CommonService,
      private userService: UserService,
      private router: Router,
      private _snackBar: MatSnackBar,
      private _clipboardService: ClipboardService,
      private _sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
      this.user = this.userService.user
      this.recipe_full = this.data.recipe
      this.modal_images = this.data.images
      // console.log(this.data)
      this.commonService.getComments(this.recipe_full.id).subscribe( data =>{
        this.recipe_comments = data;
      },
        error => console.log(error)
      )

      if (this.recipe_full.images){
        // NOTE: recipe_full.images will not exist going forward. moved to separate table
        this.recipe_full.images.forEach((element, i) => {
            this.removeable.push(false);
        });
      }

      this.getImages()

      // storing for use with scaling recipe later
      this.scaled_ingredients = this.recipe_full.ingredients
      // this.originalIngScale = []
      // this.recipe_full.ingredients.forEach(ing => {
        // this.originalIngScale.push(JSON.parse(JSON.stringify(ing)))
      // });


      // const obj = JSON.parse(JSON.stringify(this.recipe_full.ingredients));
      // this.originalIngScale = obj



      // this.commonService.getImages(this.recipe_full.id).subscribe( data => {
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


  getImages(){
    // this.images = this.recipe_full.images
    this.images = this.modal_images
    // this.commonService.getImages(idList).subscribe(data => {
    //     this.images = data
    // },
    //     error => console.error(error)
    // )
  }


  getImagesS3(recipe){
    let imgs = this.images.filter(x=>x.recipe_id == recipe.id);
    imgs.forEach(img => {
      img.url = 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + recipe.id+img.filename
    });
    return imgs;
  }


  getImgDataS3(recipe){
     let img = this.images.find(x=>x.recipe_id == recipe.id)
     if (img){
       // console.log('https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + img.filename)
       return 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + recipe.id+img.filename
     }else{
       // console.log('no img')
     }
  }

  bookmark_recipe(){
      // if user logged in, add recipe to saved
      // else, close modal & redirect to login page
      if(!this.userService.getUser()){
          this.modal.close()
          this.router.navigate(['/login'])
      }

      var user = this.userService.getUser()
      if (!user.saved){
        user.saved = [];
      }
      user.saved.push(this.recipe_full.id)

      this.userService.setUser(user)

      this.commonService.saveRecipe(user).subscribe(data => {
          this._snackBar.open('Recipe Saved', 'ok', {
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
          const index = user.saved.indexOf(this.recipe_full.id);
          if (index >= 0) {
              user.saved.splice(index, 1);
              console.log(user.saved)
              this.userService.setUser(user)
              this.commonService.unSaveRecipe(user).subscribe(data => {
                  this._snackBar.open('Recipe removed from saved list', 'ok', {
                      duration: 2000,
                  });
              },
                    error => console.error(error)
              )
          }


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
              recipeid: this.recipe_full.id,
              created: new Date(),
              userid: this.userService.user.id,
              username: this.userService.user.username,
              text: this.newComment
          }

          this.recipe_comments.push(commentObj)
          this.newComment = ''

          // this.commonService.commentRecipe(this.recipe_full).subscribe(data => {
          this.commonService.commentRecipe(commentObj).subscribe(data => {
                // console.log(data)
          },
                error => console.error(error)
          )
      }

  }

  approveRecipe(){
      this.recipe_full.pending = false
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
      this.recipe_full.pending = false
      this.commonService.deleteRecipe(this.recipe_full.id).subscribe(data => {
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
    // if (section == 'ingredients'){
    //   this.editable_ing = torf
    // }else if (section == 'name'){
    //   this.editable_name = torf
    // }else if (section == 'directions'){
    //   this.editable_dir = torf
    // }else if (section == 'meta'){
    //   this.editable_meta = torf
    // }
  }


  userSaved(){
      // console.log(this.userService.user)
      if (this.userService.user && this.userService.user.saved!=null){
        if (this.userService.user.saved.indexOf(this.recipe_full.id) > -1){
            return true
        }
      }
      return false
  }

  shareRecipe(){
    // var uri_param = encodeURIComponent(this.recipe_full.name)
    var uri_param = encodeURIComponent(this.recipe_full.id)
    // uncomment for deployment
    // let recipe_url = `http://localhost:4200/#/recipe/${uri_param}`
    let recipe_url = `https://therecipedoc.com/#/recipe/${uri_param}`
    // pop up a dialog letting them copy the url
    // console.log(recipe_url)

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
      this.fileToUpload.recipeid = this.recipe_full.id.toString();
      this.fileToUpload.primary = this.modal_images.length < 1;
      let filetypea = this.fileToUpload.filename.split('.')
      let filetype = filetypea[filetypea.length-1].toLowerCase()
      if (filetype!='jpg' && filetype!='png' && filetype!='jpeg' && filetype!='gif'){
        this._snackBar.open('Incorrect file type', 'ok', {
            duration: 2000,
        });
        return;
      }

      // var fileName = fileInput.target.files[0].name
      this.getBase64(this.fileToUpload.filedata).then(data => {
        this.fileToUpload.filedata = data
        // this.commonService.gets3Url().subscribe(data => {
          // get s3 presigned upload url
          // use the url to post the image to s3, where it will then move to db (how? some trigger?)
          // this.commonService.addRecipeImgS3(data['url'], data['fields'], this.fileToUpload).subscribe(data => {
          this.commonService.addRecipeImgS3(this.fileToUpload).subscribe(data => {

          // this.commonService.addRecipeImg(this.fileToUpload).subscribe(data => {
                this._snackBar.open('Image Added!', 'ok', {
                    duration: 2000,
                });
                // reload the recipe so the image shows up
                this.commonService.getRecipe(this.recipe_full.id).subscribe(data => {
                    this.recipe_full = data;
                    this.refreshImages()
                },
                    error => console.error(error)
                )

          },
                error => console.error(error)
          )


        // },
              // error => console.error(error)
        // )
        // });



      });
  }

  refreshImages(){
    console.log(this.recipe_full.id)
    this.commonService.getImages(this.recipe_full.id).subscribe(data => {
        this.images = data;
    },
        error => console.error(error)
    )
  }


  getImgData(recipe_id){
     let img = this.images.find(x=>x.recipeid == recipe_id)
     if (img){
       return img.filedata
     }
  }

  upload_image(){
  }



  removeImage(){
  }

  showremove(torf,i){
    this.removeable[i] = torf;
  }

  showprimary(torf,i){
    this.primary[i] = torf;
  }

  isRemoveable(idx){
    return this.removeable[idx];
  }

  isHovered(idx){
    return this.primary[idx];
  }

  makePrimary(image){
    console.log(image)
    this.commonService.makePrimary(image.id, image.recipe_id).subscribe( data =>{
      // this.recipe_comments = data;
    },
      error => console.log(error)
    )
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


  retrieveAmountFromIngredient(ingredient:string){
    let amount:string
    let regx = /(\d\s\d|\d|[/]| - |[-])+/g;
    // /(\d\s\d|\d|[/]|[-])+/g;
    // /(\d|[/]|\s|[-])+/g;
    // ((\d)+(|[/]|\s|[-]))+

    let res = ingredient.match(regx)
    if (res){
      amount = res[0]
      return amount
    }
  }

  scaleAmount(amount:string,multiple:number){
    let scaledAmount:number
    let afterws, beforews
    if (amount.includes('/')){
      afterws = amount.split(' ')
      if (afterws.length>1){
        beforews = afterws[0]
        afterws = afterws[1]
      }else{
        afterws = amount
      }

      let numerator = afterws.split('/')[0]
      let denominator = afterws.split('/')[1]
      let dec = Number((Number(numerator)/Number(denominator)).toFixed(2))
      if (beforews){
        scaledAmount = (Number(beforews)*multiple) + Number((dec*multiple).toFixed(2))
      }else{
        scaledAmount = Number((dec*multiple).toFixed(2))
      }

    }else{
      scaledAmount = Number(amount)*multiple
    }
    return scaledAmount
  }

  scaleRecipe(multiple){
    this.recipe_scale = multiple
    if (multiple!=1){
      let ing_els = []
      this.recipe_full.ingredients.forEach((ing,index) => {
        // parse for number at beginning of string
        // if found, multiply it by the scale
        let newing = JSON.parse(JSON.stringify(ing));
        // let re = /(\d|[/])+/;
        // let res = newing.match(re)
        let amount = this.retrieveAmountFromIngredient(newing)
        let scaledAmount
        if (amount){
          if (amount.includes('-')){
            // if theres a range, calculate them separately
            let resa = amount.split('-')[0].trim()
            let resb = amount.split('-')[1].trim()
            let scaledAmount1 = this.scaleAmount(resa,multiple)
            let scaledAmount2 = this.scaleAmount(resb,multiple)
            scaledAmount = scaledAmount1 + ' - ' + scaledAmount2
          }
          else{
          // else if (amount.includes('/')){
            scaledAmount = this.scaleAmount(amount,multiple)
          }
            // let frac = amount;
            // let dec = Number((Number(frac.charAt(0))/Number(frac.charAt(2))).toFixed(2))
            // let newamount = Number((dec*multiple).toFixed(2))
          ing_els.push(newing.replace(amount,scaledAmount+ ' '))
          // }
          // else{
            // ing_els.push(newing.replace(amount,scaledAmount))
          // }
        }else{
          ing_els.push(newing)
        }
      });
      this.scaled_ingredients = ing_els
    }
  }


}
