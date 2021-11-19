import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service'
import { NgbModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {

  pending_recipes: any;
  empty = false;
  recipe_full
  recipe
  private modalRef;
  images = [];
  modal_images = [];

  ngbModalOptions: NgbModalOptions = {
      centered: true,
      size: 'lg'
  };


  constructor(
      private commonService: CommonService,
      private modalService: NgbModal
  ) { }

  ngOnInit(): void {
      this.commonService.getPendingRecipes().subscribe(data => {
          this.pending_recipes = data;

          if(typeof data === 'object'){
              this.empty = false // doesn't work
          }else{
              this.empty = true
          }

          this.getImagesS3()

      },
          error => console.error(error)
      )
  }

  hasImage(recipe_id){
    return this.images.find(x=>x.recipe_id == recipe_id)
  }

  getImgData(recipe){
     let img = this.images.find(x=>x.recipe_id == recipe.id && x.primary_img == true)
     if (img){
       return img.filedata
     }else{
       console.log('no img')
     }
  }

  getImgDataS3(recipe){
     let img = this.images.find(x=>x.recipe_id == recipe.id && x.primary_img == true)
     if (img){
       // console.log('https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + img.filename)
       return 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + recipe.id+img.filename
     }else{
       // console.log('no img')
     }
  }

  getImages(recipeid=''){
    this.commonService.getImages(recipeid).subscribe(data => {
        if (recipeid==''){
          this.images = data
        }else{
          // if a single recipeid was asked for, then this was an update to a single recipe's imgs. delete those imgs and add any current ones.
          this.images = this.images.filter(img=>img.recipe_id!=recipeid)
          this.images.push.apply(this.images, data);
        }

    },
        error => console.error(error)
    )
  }

  getImagesS3(recipeid=''){
    this.commonService.getImagesS3(recipeid).subscribe(data => {
        if (recipeid==''){
          this.images = data
        }else{
          // if a single recipeid was asked for, then this was an update to a single recipe's imgs. delete those imgs and add any current ones.
          this.images = this.images.filter(img=>img.recipe_id!=recipeid)
          this.images.push.apply(this.images, data);
        }

    },
        error => console.error(error)
    )
  }


  get_full_recipe(){
      this.commonService.getRecipe(this.recipe._id).subscribe(data => {
          this.recipe_full = data;
          this.openModal()
      },
          error => console.error(error)
      )
  }

  viewRecipeModal(recipe) {
      this.modal_images = []
      this.recipe_full = recipe;
      let imgs = this.images.filter(x=>x.recipe_id == recipe.id);
      this.modal_images = imgs;
      this.openModal()
      // this.get_full_recipe();
  }

  openModal(){
      this.modalRef = this.modalService.open(RecipeModalComponent, this.ngbModalOptions)
      // this.modalRef.componentInstance.data = this.recipe_full
      this.modalRef.componentInstance.data = {
        'recipe': this.recipe_full,
        'images': this.modal_images
      }
      this.modalRef.result.then((result) => {
          this.commonService.getPendingRecipes().subscribe(data => {
              this.pending_recipes = data
              if(typeof data === 'object'){
                  this.empty = false
              }else{
                  this.empty = true
              }
          },
              error => console.error(error)
          )
        }, (reason) => {
            this.commonService.getPendingRecipes().subscribe(data => {
                this.pending_recipes = data
                if(typeof data === 'object'){
                    this.empty = true
                }else{
                    this.empty = false
                }
            },
                error => console.error(error)
            )
        }
      );

  }

}
