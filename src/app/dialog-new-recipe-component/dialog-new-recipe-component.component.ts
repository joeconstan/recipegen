import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PantryService } from '../pantry.service'
import { CommonService } from '../common.service'
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../user.service'
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


export interface DialogData {
  name: string;
  ingredients: string[];
  directions: string[];
  type: string[];
  timelength: number;
  timeWarning: boolean;
  difficulty: string;
  difficultyWarning: boolean;
  pending: boolean;
  author: string;
  rating: number;
  tags: string[];
  yield: string;
  title: string;
  submitText: string;
  id: number;
}


@Component({
  selector: 'app-dialog-new-recipe-component',
  templateUrl: './dialog-new-recipe-component.component.html',
  styleUrls: ['./dialog-new-recipe-component.component.css']
})

export class DialogNewRecipeComponent implements OnInit{

    dialogue_ingredient: string;
    dialogue_direction = '';
    dialogue_type: string[];
    dialogue_tags: string[];
    dialogue_difficulty: string;
    step_num = 1;
    separatorKeysCodes: number[] = [ENTER,COMMA];
    import = false
    recipeurl: string;

  constructor(
    public dialogRef: MatDialogRef<DialogNewRecipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.ingredients){
      this.dialogue_ingredient = this.data.ingredients.join('\n');
    }
    if (this.data.directions){
      this.dialogue_direction = this.data.directions.join('\n');
    }
    if (this.data.directions){
      this.dialogue_type = this.data.type;
    }
    if (this.data.tags){
      this.dialogue_tags = this.data.tags;
    }
  }


  dialogue_addIngredient(){
    this.data.ingredients = this.dialogue_ingredient.split(/\r?\n/)
    // this.dialogue_ingredient = '';
  }
  dialogue_addDirection(){
     // this.data.Directions.push(this.dialogue_direction)
     // this.dialogue_direction = '';
     this.data.directions = this.dialogue_direction.split(/\r?\n/)
  }

  checkSteps(){
      for (var i=1;i<=this.step_num;i++){
          if (this.dialogue_direction.indexOf(i.toString()+'.')==-1){
              // imperfect...
              this.step_num=i-1;
              if (this.step_num < 1){
                  this.step_num = 1;
              }
          }
      }

  }

  addNumbering(){
    // get cursor position
      // so, if dialogue_direction now has a newline character where previously it didnt...then..ugh but idk. that happens after the numbering, i think
      this.checkSteps()
      this.step_num+=1
      this.dialogue_direction+=this.step_num+". "
  }


  dialogue_addType(){
    console.log(this.dialogue_type);
     this.data.type = this.dialogue_type;
  }

  dialogue_addTags(){
     this.data.tags = this.dialogue_tags;
  }
  // dialogue_addTimeWarning(){
    // this.data.timeWarning = this.di
  // }

  // dialogue_addDifficulty(){
    //  this.data.difficulty = this.dialogue_difficulty;
  // }

  dialogue_removeIngredient(ingredient){
    var index = this.data.ingredients.indexOf(ingredient, 0);
    if (index > -1) {
       this.data.ingredients.splice(index, 1);
    }
  }


  importRecipe(){
    this.import = true;
  }


  // dialogue_addLength(){
  //     console.log('testing addlength')
  //    this.data.Length = this.dialogue_length;
  // }

}