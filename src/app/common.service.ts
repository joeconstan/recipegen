import { Injectable } from '@angular/core';
// import { Response } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

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

  getRecipesbyKeyword(keyword){
      var uri_param = encodeURIComponent(keyword);
      // return this.http.get(`http://localhost:8080/api/getRecipesbyKeyword/${uri_param}`)
      // uncomment for deployment
      return this.http.get(`/api/getRecipesbyKeyword/${uri_param}`)
  }

  getRecipesWithFilters(filters){
      // var uri_param = encodeURIComponent('test1?test2');

      var params = new HttpParams();

      if (filters.keywords.length > 0){
          params = params.set('keywords', filters.keywords)
      }
      if (filters.type!=''){
          params = params.set('type', filters.type);
      }
      if (filters.time!=''){
          params = params.set('time', filters.time);
      }
      if (filters.difficulty!=''){
          params = params.set('difficulty', filters.difficulty);
      }

      // return this.http.get('http://localhost:8080/api/getRecipesWithFilters', {params})
      // uncomment for deployment
      return this.http.get('/api/getRecipesWithFilters', {params})
  }


}
