import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import  *  as  recipes  from  './recipes.json';
import  *  as  recipes_all  from  './recipes_all.json';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PantryService {

  constructor(private cookieService: CookieService) { }


      private ingredients = []
      private recipes = []

      setIngredients(){

      }

      retrieveCookieIngredients(){
          const cookieexists = this.cookieService.check('myingredients');
          if (cookieexists){
              var retrieved_ings = this.cookieService.get('myingredients')
              retrieved_ings.split(" ").forEach(element => {
                  this.ingredients.push(element);
              });
          }
      }

      addIngredient(ingredient){
          this.ingredients.push(ingredient)

          const cookieexists = this.cookieService.check('myingredients');
          if (!cookieexists){
              this.cookieService.set('myingredients',ingredient)
          }else{
              var cookieings = this.cookieService.get('myingredients')
              cookieings = cookieings + "  "+ingredient;
              this.cookieService.set('myingredients',cookieings)
          }
      }

      removeIngredient(ingredient){
          if (this.ingredients.includes(ingredient)){
              delete this.ingredients[ingredient]
              const cookieexists = this.cookieService.check('myingredients');
              if (!cookieexists){
                  var cstring = "";
                  this.ingredients.forEach(element => {
                      cstring=cstring+element+"  ";
                  });
                  this.cookieService.set('myingredients',cstring)
              }else{
                  var cookieings = this.cookieService.get('myingredients')
                  cookieings = cookieings.replace(ingredient+'  ','')
                  this.cookieService.set('myingredients',cookieings)
              }
          }

      }


      getRecipes() {
          return this.recipes;
      }

      getIngredients(){
          return this.ingredients;
      }



      refreshRecipes(){
          // use ingredients to figure out which recipes i can make - move code from ingredients.comp.ts to here
          // console.log('Recipes refreshed! :))')
          // console.log('Ingredients:', this.ingredients)
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
