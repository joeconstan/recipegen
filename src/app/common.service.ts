import { Injectable } from '@angular/core';
// import { Response } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor( private http: HttpClient ) { }



  newRecipe(recipe){
      return this.http.post('http://localhost:8080/api/newRecipe', recipe)
  }

  getRecipes(){
      console.log('in get recipes');
      return this.http.get('http://localhost:8080/api/getRecipes')
  }


}
