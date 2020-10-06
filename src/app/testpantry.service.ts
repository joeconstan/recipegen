import { Injectable } from '@angular/core'
@Injectable({
    providedIn: 'root'
})


export class PantryService {

    constructor(
        // private backend: BackendService,
    ){ }

    private ingredients = []
    private recipes = []

    public setIngredients(){

    }

    public addIngredient(ingredient){
        this.ingredients.push(ingredient)
    }
    public getRecipes() {
        return this.recipes;
    }

    public getIngredients(){

    }


    public refreshRecipes(){
        // use ingredients to figure out which recipes i can make - move code from ingredients.comp.ts to here
        return this.recipes;
    }

}