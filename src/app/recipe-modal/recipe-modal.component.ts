import { Component, OnInit, Input } from '@angular/core';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'


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
      public modal: NgbActiveModal
  ) { }

  ngOnInit() {
      this.recipe_full = this.data
      // this.recipe_full = this.pantryService.loadRecipe(this.data)
      // this.recipe_full.name = this.data
      // this.recipe_full.ingredients =
  }

}
