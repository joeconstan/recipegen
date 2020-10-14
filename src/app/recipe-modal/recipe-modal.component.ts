import { Component, OnInit, Input } from '@angular/core';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.css']
})
export class RecipeModalComponent implements OnInit {

    @Input() data

    public recipe_full: any

  constructor(
      private pantryService: PantryService,
      public modal: NgbActiveModal,
      private commonService: CommonService
  ) { }

  ngOnInit() {
      this.recipe_full = this.data
      // this.recipe_full = this.pantryService.loadRecipe(this.data)
      // this.recipe_full.name = this.data
      // this.recipe_full.ingredients =
  }

  bookmark_recipe(){

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

  }

}
