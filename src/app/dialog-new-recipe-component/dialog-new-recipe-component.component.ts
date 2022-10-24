import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../common.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  edit: boolean;
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
  blurb: string;
  submittedby: string;
  deleted: boolean;
  fileToUpload: {
    recipeid: string;
    filedata: any;
    filename: string;
    primary: boolean;
    dbinsert: boolean;
  };
}

@Component({
  selector: 'app-dialog-new-recipe-component',
  templateUrl: './dialog-new-recipe-component.component.html',
  styleUrls: ['./dialog-new-recipe-component.component.scss'],
})
export class DialogNewRecipeComponent implements OnInit {
  dialogue_ingredient: string;
  dialogue_direction = '';
  dialogue_type: string[];
  dialogue_tags: string[];
  dialogue_difficulty: string;
  step_num = 1;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  import = false;
  recipeurl: string;
  fileToUpload = {
    recipeid: '',
    filedata: null,
    filename: '',
    primary: true,
    dbinsert: false,
  };
  hasFile = false;
  loading:boolean = false;

  
  constructor(
    public dialogRef: MatDialogRef<DialogNewRecipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.ingredients) {
      this.dialogue_ingredient = this.data.ingredients.join('\n');
    }
    if (this.data.directions) {
      this.dialogue_direction = this.data.directions.join('\n');
    }
    if (this.data.directions) {
      this.dialogue_type = this.data.type;
    }
    if (this.data.tags) {
      this.dialogue_tags = this.data.tags;
    }
  }

  dialogue_addIngredient() {
    this.data.ingredients = this.dialogue_ingredient.split(/\r?\n/);
    // this.dialogue_ingredient = '';
  }
  dialogue_addDirection() {
    // this.data.Directions.push(this.dialogue_direction)
    // this.dialogue_direction = '';
    this.data.directions = this.dialogue_direction.split(/\r?\n/);
  }

  checkSteps() {
    for (var i = 1; i <= this.step_num; i++) {
      if (this.dialogue_direction.indexOf(i.toString() + '.') == -1) {
        // imperfect...
        this.step_num = i - 1;
        if (this.step_num < 1) {
          this.step_num = 1;
        }
      }
    }
  }

  newRecipeFieldsComplete() {
    return (
      this.data.name !== '' &&
      this.data.timelength !== 0 &&
      !isNaN(+this.data.timelength) &&
      this.data.ingredients.length > 0 &&
      this.data.directions.length > 0 &&
      this.data.type.length > 0
    );
  }

  addNumbering() {
    // get cursor position
    // so, if dialogue_direction now has a newline character where previously it didnt...then..ugh but idk. that happens after the numbering, i think
    this.checkSteps();
    this.step_num += 1;
    this.dialogue_direction += this.step_num + '. ';
  }

  dialogue_addType() {
    this.data.type = this.dialogue_type;
  }

  dialogue_addTags() {
    this.data.tags = this.dialogue_tags;
  }
  // dialogue_addTimeWarning(){
  // this.data.timeWarning = this.di
  // }

  dialogue_removeIngredient(ingredient) {
    var index = this.data.ingredients.indexOf(ingredient, 0);
    if (index > -1) {
      this.data.ingredients.splice(index, 1);
    }
  }

  importRecipe() {
    this.import = true;
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  readImage(fileInput: FileList) {
    this.hasFile = true;
    this.data.fileToUpload.filename = fileInput[0].name.toString();
    this.data.fileToUpload.primary = true;
    let filetypea = this.data.fileToUpload.filename.split('.');
    let filetype = filetypea[filetypea.length - 1].toLowerCase();
    if (
      filetype != 'jpg' &&
      filetype != 'png' &&
      filetype != 'jpeg' &&
      filetype != 'gif'
    ) {
      this._snackBar.open('Incorrect file type', 'ok', {
        duration: 2000,
      });
      return;
    }

    this.getBase64(fileInput[0]).then((data: string) => {
      this.data.fileToUpload.filedata = data;
      this.data.fileToUpload.dbinsert = false;
      this._snackBar.open('Image Added!', 'ok', {
        duration: 2000,
      });
    });
  }
}
