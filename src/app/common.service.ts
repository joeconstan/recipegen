import { Injectable } from '@angular/core';
// import { Response } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor( private http: HttpClient ) { }



  newRecipe(recipe){
      // return this.http.post('http://localhost:8080/api/newRecipe', recipe)
      // uncomment for deployment
      return this.http.post('/api/newRecipe', recipe)
  }

  getRecipes(){
      // return this.http.get('http://localhost:8080/api/getRecipes')
      // uncomment for deployment
      return this.http.get('/api/getRecipes')
  }
  getRecipesByType(type){
      var uri_param = encodeURIComponent(type);
      // return this.http.get(`http://localhost:8080/api/getRecipesByType/${uri_param}`)
      // uncomment for deployment
      return this.http.get(`/api/getRecipesByType/${uri_param}`)
  }

  getRecipe(recipe){
      var uri_param = encodeURIComponent(recipe);
      // return this.http.get(`http://localhost:8080/api/getRecipe/${uri_param}`)
      // uncomment for deployment
      return this.http.get(`/api/getRecipe/${uri_param}`)
  }


}
