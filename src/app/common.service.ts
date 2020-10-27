import { Injectable } from '@angular/core';
// import { Response } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  private dev = false;

  constructor( private http: HttpClient ) { }



  newRecipe(recipe){
      if (this.dev){
          return this.http.post('http://localhost:8080/api/newRecipe', recipe)
      }else{
          return this.http.post('/api/newRecipe', recipe)
      }
  }

  saveRecipe(user){
       if (this.dev){
           return this.http.post('http://localhost:8080/user/saveRecipe', user)
       }else{
           return this.http.post('/user/saveRecipe', user)
       }
  }

  unSaveRecipe(user){
       if (this.dev){
           return this.http.post('http://localhost:8080/user/unSaveRecipe', user)
       }else{
           return this.http.post('/user/unSaveRecipe', user)
       }
  }

 updateRecipe(recipe){
       if (this.dev){
           return this.http.post('http://localhost:8080/api/updateRecipe', recipe)
       }else{
           return this.http.post('/api/updateRecipe', recipe)
       }
      // uncomment for deployment
  }

 commentRecipe(comment){
      if (this.dev){
          return this.http.post('http://localhost:8080/api/commentRecipe', comment)
      }else{
          return this.http.post('/api/commentRecipe', comment)
      }
      // uncomment for deployment
  }

  getComments(recipeid){
      var uri_param = encodeURIComponent(recipeid);
       if (this.dev){
           return this.http.get(`http://localhost:8080/api/getComments/${uri_param}`)
       }else{
           return this.http.get(`/api/getComments/${uri_param}`)
       }
  }

  getRecipes(){
       if (this.dev){
           return this.http.get('http://localhost:8080/api/getRecipes')
       }else{
           return this.http.get('/api/getRecipes')
       }
      // uncomment for deployment
  }

  getPendingRecipes(){
       if (this.dev){
           return this.http.get('http://localhost:8080/api/getPendingRecipes')
       }else{
           return this.http.get('/api/getPendingRecipes')
       }
      // uncomment for deployment
  }
  getRecipesByType(type){
      var uri_param = encodeURIComponent(type);
      if (this.dev){
          return this.http.get(`http://localhost:8080/api/getRecipesByType/${uri_param}`)
      }else{
          return this.http.get(`/api/getRecipesByType/${uri_param}`)
      }
      // uncomment for deployment
  }

  getRecipe(recipe){
      var uri_param = encodeURIComponent(recipe);
      if (this.dev){
          return this.http.get(`http://localhost:8080/api/getRecipe/${uri_param}`)
      }else{
          return this.http.get(`/api/getRecipe/${uri_param}`)
      }
      // uncomment for deployment
  }

  getRandomRecipe(){
      if (this.dev){
          return this.http.get('http://localhost:8080/api/getRandomRecipe')
      }else{
          return this.http.get('/api/getRandomRecipe')
      }
  }

  getRecipesbyKeyword(keyword){
      var uri_param = encodeURIComponent(keyword);
      if (this.dev){
          return this.http.get(`http://localhost:8080/api/getRecipesbyKeyword/${uri_param}`)
      }else{
          return this.http.get(`/api/getRecipesbyKeyword/${uri_param}`)
      }
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

      if (this.dev){
          return this.http.get('http://localhost:8080/api/getRecipesWithFilters', {params})
      }else{
          return this.http.get('/api/getRecipesWithFilters', {params})
      }
  }


  deleteRecipe(recipe){
       if (this.dev){
           return this.http.post('http://localhost:8080/api/deleteRecipe', recipe)
       }else{
           return this.http.post('/api/deleteRecipe', recipe)
       }
  }


  // USERS

  register(user){
      if (this.dev){
          return this.http.post('http://localhost:8080/user/newUser', user)
      }else{
          return this.http.post('/user/newUser', user)
      }
  }

  getUser(username:string,password:string) {
      var username = encodeURIComponent(username)
      var pswd = encodeURIComponent(password)
      var params = new HttpParams().set('username', username).set('pswd',pswd)

      if (this.dev){
          return this.http.get('http://localhost:8080/user/getUser', {params})
      }else{
          return this.http.get('/user/getUser', {params})
      }
  }


  getSavedRecipes(user){
      // first query: get the saved recipes by this user from the db - new table?
      var params = new HttpParams().set('userid', user._id)
      if (this.dev){
          return this.http.get('http://localhost:8080/user/getSaved', {params})
      }else{
          return this.http.get('/user/getSaved', {params})
      }
  }

}
