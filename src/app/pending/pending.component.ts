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
              this.empty = true
          }else{
              this.empty = false
          }
      },
          error => console.error(error)
      )

  }


  get_full_recipe(){
      this.commonService.getRecipe(this.recipe.Name).subscribe(data => {
          this.recipe_full = data[0];
          this.openModal()
      },
          error => console.error(error)
      )
  }

  viewRecipeModal(recipe) {
      this.recipe = recipe;
      this.get_full_recipe();
  }

  openModal(){
      this.modalRef = this.modalService.open(RecipeModalComponent, this.ngbModalOptions)
      this.modalRef.componentInstance.data = this.recipe_full
      this.modalRef.result.then((result) => {
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
