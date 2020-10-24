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

  saveRecipe(user){
      // return this.http.post('http://localhost:8080/user/saveRecipe', user)
      // uncomment for deployment
      return this.http.post('/user/saveRecipe', user)
  }

 updateRecipe(recipe){
      // return this.http.post('http://localhost:8080/api/updateRecipe', recipe)
      // uncomment for deployment
      return this.http.post('/api/updateRecipe', recipe)
  }

 commentRecipe(recipe){
      // return this.http.post('http://localhost:8080/api/commentRecipe', recipe)
      // uncomment for deployment
      return this.http.post('/api/commentRecipe', recipe)
  }

  getRecipes(){
      // return this.http.get('http://localhost:8080/api/getRecipes')
      // uncomment for deployment
      return this.http.get('/api/getRecipes')
  }

  getPendingRecipes(){
      // return this.http.get('http://localhost:8080/api/getPendingRecipes')
      // uncomment for deployment
      return this.http.get('/api/getPendingRecipes')
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

  getRandomRecipe(){
      // return this.http.get('http://localhost:8080/api/getRandomRecipe')
      // uncomment for deployment
      return this.http.get('/api/getRandomRecipe')
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



  deleteRecipe(recipe){
      // return this.http.post('http://localhost:8080/api/deleteRecipe', recipe)
      // uncomment for deployment
      return this.http.post('/api/deleteRecipe', recipe)
  }



  // USERS

  register(user){
      // return this.http.post('http://localhost:8080/user/newUser', user)
      // uncomment for deployment
      return this.http.post('/user/newUser', user)
  }

  getUser(username:string,password:string) {
      var username = encodeURIComponent(username)
      var pswd = encodeURIComponent(password)
      var params = new HttpParams().set('username', username).set('pswd',pswd)

      // return this.http.get('http://localhost:8080/user/getUser', {params})

      // uncomment for deployment
      return this.http.get('/user/getUser', {params})
  }


  getSavedRecipes(user){
      // first query: get the saved recipes by this user from the db - new table?
      var params = new HttpParams().set('userid', user._id)
      // return this.http.get('http://localhost:8080/user/getSaved', {params})
      // uncomment for deployment
      return this.http.get('/user/getSaved', {params})

          // console.log('success! data: ', data)
          // params = new HttpParams().set('recipelist', data)
          // return this.http.get('http://localhost:8080/recipe/getRecipesFromList', {params})

      // second query: grab the recipes by the recipe names given by the first query
  }


}
