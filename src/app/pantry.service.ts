import { Injectable } from '@angular/core';

import  *  as  recipes  from  './recipes.json';
import  *  as  recipes_all  from  './recipes_all.json';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PantryService {

  constructor() { }


      private ingredients = []
      private recipes = []

      setIngredients(){

      }

      addIngredient(ingredient){
          this.ingredients.push(ingredient)
      }
      getRecipes() {
          return this.recipes;
      }

      getIngredients(){

      }


      refreshRecipes(){
          // use ingredients to figure out which recipes i can make - move code from ingredients.comp.ts to here
          console.log('Recipes refreshed! :))')
          console.log('Ingredients:', this.ingredients)
          recipes["Recipes"].forEach(element => {
              var canmake = true;
              element["Ingredients"].forEach(needed_ing => {
                  var hasing = false;

                  if (this.ingredients.includes(needed_ing)){
                      hasing=true;
                  }else{
                       needed_ing.split(" ").forEach(cvaluesubStrng => {
                          if (this.ingredients.includes(cvaluesubStrng)){
                              hasing=true;
                          }
                      });
                    }

                  if (!hasing){
                      canmake = false;
                  }
              });
                if (canmake){
                    if (!this.recipes.includes(element["Name"])){
                        this.recipes.push(element["Name"]);
                    }
                }
          });


          return this.recipes;
      }

      loadRecipe(rec_name):Promise<any>{
          // find in json file
          // is there a faster way than just iterating linearly?

          return new Promise((resolve,reject) => {
              recipes_all["Recipes"].forEach(element => {
                  if (element['Name'] == rec_name){
                      // return element;
                      resolve(element)
                  }
              });
              reject(rec_name)
          });

      }


}
