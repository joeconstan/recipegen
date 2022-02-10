import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor( private http: HttpClient ) { }



  /* RECIPES */
  newRecipe(recipe){
      return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe', recipe)
  }

  saveRecipe(user){

       return this.http.put('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/user', user)
  }

  unSaveRecipe(user){
       return this.http.put('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/user', user)
  }

 updateRecipe(recipe){
        return this.http.put('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe', recipe)
  }

 editRecipe(recipe){
        return this.http.post('http://localhost:8080/api/editRecipe', recipe)
  }


  getRecipes(){
    // var startKey2 = encodeURIComponent(startKey)
    // var params = new HttpParams().set('startKey', startKey2)
         // return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipes-v2', {params} )
         return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipes-v2' )

  }


  getRecipeCount(){
      return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe-count')
  }

  getPendingRecipes(){
           return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/pending-recipes')
  }
  // getRecipesByType(type){
  //     var uri_param = encodeURIComponent(type);
  //     if (this.dev){
  //         // return this.http.get(`http://localhost:8080/api/getRecipesByType/${uri_param}`)
  //         return this.http.get(`http://localhost:8080/api/getRecipesByType/${uri_param}`)
  //     }else{
  //         return this.http.get(`/api/getRecipesByType/${uri_param}`)
  //     }
  // }

  getRecipe(recipe){
      // var uri_param = encodeURIComponent(recipe);
        return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe/',{params:{'recipe':recipe}})
  }



  getLists(){
    return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/lists/')
  }

  getList(list_id){
    return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/list/',{params:{'list_id':list_id}})
  }

  getRandomRecipe(){
    return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/random-recipe')
  }

  // getRecipesbyKeyword(keyword){
  //     var uri_param = encodeURIComponent(keyword);
  //     if (this.dev){
  //         // return this.http.get(`http://localhost:8080/api/getRecipesbyKeyword/${uri_param}`)
  //         return this.http.get(`http://localhost:8080/api/getRecipesbyKeyword/${uri_param}`)
  //     }else{
  //         return this.http.get(`/api/getRecipesbyKeyword/${uri_param}`)
  //     }
  // }

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
      if (filters.searchIngredients){
          params = params.set('searchIngredients', filters.searchIngredients);
      }
      if (filters.tags){
          params = params.set('tags', filters.tags);
      }

          return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipes-v2', {params})
  }


  deleteRecipe(recipeid){
       // if (this.dev){
           // return this.http.post('http://localhost:8080/api/deleteRecipe', recipe)
           return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/pending-recipes', recipeid)
       // }else{
           // return this.http.post('/api/deleteRecipe', recipe)
       // }
  }



 /* COMMENTS */
 commentRecipe(comment){
      // if (this.dev){
          // return this.http.post('http://localhost:8080/api/commentRecipe', comment)
          return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/comments', comment)
      // }else{
      //     return this.http.post('/api/commentRecipe', comment)
      // }
  }

  getComments(recipeid){
       var params = new HttpParams().set('recipeid', recipeid)
       // if (this.dev){
           // return this.http.get(`http://localhost:8080/api/getComments/${uri_param}`)
       return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/comments', {params} )
       // }else{
           // return this.http.get(`/api/getComments/${uri_param}`)
       // }
  }

  // getImages(recipeid):Observable<any>{
  //     var uri_param = encodeURIComponent(recipeid);
  //      if (this.dev){
  //          return this.http.get(`http://localhost:8080/api/getImages/${uri_param}`)
  //      }else{
  //          return this.http.get(`/api/getImages/${uri_param}`)
  //      }
  // }


  /* IMAGES */
  // getImages(idList):Observable<any>{
  getImages(recipeid=''):Observable<any>{
    if (recipeid!=''){
      var params = new HttpParams().set('recipeid', recipeid)
      return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images', {params} )
    }
    else{
      return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images' )
    }
    // var params = new HttpParams().set('idList', idList)
    // return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images', {params} )
  }

  // getAllImages(){
  //      if (this.dev){
  //          return this.http.get('http://localhost:8080/api/getAllImages')
  //      }else{
  //          return this.http.get('/api/getAllImages')
  //      }
  // }

  gets3Url(recipeid=''){
      // return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images')
      return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images')
  }

  getImagesS3(recipeid=''):Observable<any>{
      // return the names from the db of all the images along w their recipe ids
      // return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images')
      if (recipeid!=''){
        var params = new HttpParams().set('recipeid', recipeid)
        return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images', {params} )
      }else{
        return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images')
      }
  }

  addRecipeImg(fileobj){
        // if (this.dev){
            // return this.http.post('http://localhost:8080/api/addRecipeImg', fileobj)
            // return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images', fileobj)
      return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images', fileobj)
        // }else{
            // return this.http.post('/api/addRecipeImg', fileobj)
        // }
   }

  // addRecipeImgS3(s3url, s3data, fileobj){
  addRecipeImgS3(fileobj){
        // if (this.dev){
            // return this.http.post('http://localhost:8080/api/addRecipeImg', fileobj)
            // return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images', fileobj)
      // console.log(s3data)
      // var formData: any = new FormData();
      // formData.append('key', s3data['key']);
      // formData.append("file", fileobj);

      // ok s3data is json, need it to be an object..that could be the problem
      // let options = {
      //   'AWSAccessKeyId': s3data['AWSAccessKeyId'],
      //   'key': s3data['key'],
      //   'Content-Type': s3data['Content-Type'],
      //   'policy': s3data['policy'],
      //   'signature': s3data['signature'],
      //   'x-amz-security-token': s3data['x-amz-security-token']
      // }

      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'AWSAccessKeyId': s3data['AWSAccessKeyId'],
      //     'key': s3data['key'],
      //     'Policy': s3data['policy'],
      //     'Signature': s3data['signature'],
      //     'x-amz-security-token': s3data['x-amz-security-token']
      //   })
      // };

      // console.log(httpOptions)
      // return this.http.post(s3url, formData, httpOptions)
      return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images', fileobj)



        // }else{
            // return this.http.post('/api/addRecipeImg', fileobj)
        // }
   }






  /* USERS */

  register(user){
      // if (this.dev){
          // return this.http.post('http://localhost:8080/user/newUser', user)
      return this.http.post('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/user', user)
      // }else{
          // return this.http.post('/user/newUser', user)
      // }
  }

  getUser(username:string,password:string='') {
      var username = encodeURIComponent(username)
      var pswd = encodeURIComponent(password)
      var params = new HttpParams().set('username', username).set('pswd',pswd)

      // if (this.dev){
          // return this.http.get('http://localhost:8080/user/getUser', {params})
          return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/user', {params})
      // }else{
          // return this.http.get('/user/getUser', {params})
      // }
  }

  getSavedRecipes(user){
      var params = new HttpParams().set('username', user.username)
      // if (this.dev){
          // return this.http.get('http://localhost:8080/user/getSaved', {params})
          return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/saved-recipes', {params})
      // }else{
          // return this.http.get('/user/getSaved', {params})
      // }
  }

}
