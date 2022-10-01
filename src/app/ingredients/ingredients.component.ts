import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../ingredient';
import { ViewChild } from '@angular/core';
import { PantryService } from '../pantry.service';

import * as recipes from '../recipes.json';
// import justingredients  from  '../justingredients.json';
import scingredients from '../scingredients.json';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
})
export class IngredientsComponent implements OnInit {
  added_ingredient = '';
  my_ingredients = [];
  my_recipes = [];

  keyword = 'name';
  // public ingdata = justingredients
  public ingdata = scingredients;

  @ViewChild('ngacinput') inputbox;

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.pantryService.retrieveCookieIngredients();
    this.my_ingredients = this.pantryService.getIngredients();
    // HOW DOES THIS STAY UPDATED I DONT UNDERSTAND. I DONT APPEND TO MY_INGREDIENTS ANYWHERE
  }

  addIngredient() {
    // this.my_ingredients.push(this.added_ingredient)
    this.pantryService.addIngredient(this.added_ingredient);
    this.added_ingredient = '';
  }
  remove(ingredient) {
    this.pantryService.removeIngredient(ingredient);
  }

  findRecipes() {
    this.my_recipes = this.pantryService.refreshRecipes();
  }

  // autocomplete

  selectEvent(item) {
    // do something with selected item
    // console.log(this.my_ingredients,'<--')
    this.added_ingredient = item.name;
    this.addIngredient();
    this.inputbox.clear();
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }
}
