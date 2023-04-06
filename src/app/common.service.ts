import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'x-api-key': environment.apiKey,
      },
    });
    return next.handle(request);
  }

  /* RECIPES */
  newRecipe(recipe) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe',
      recipe
    );
  }

  saveRecipe(user_id, recipe_id) {
    let info = {
      user_id: user_id,
      recipe_id: recipe_id,
    };
    return this.http.put(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/saved-recipes',
      info
    );
  }

  unSaveRecipe(user_id, recipe_id) {
    var params = new HttpParams()
      .set('user_id', user_id)
      .set('recipe_id', recipe_id);

    return this.http.delete(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/saved-recipes',
      { params }
    );
  }

  getSavedCount(recipe_id) {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/saved-count',
      { params: { recipe_id: recipe_id } }
    );
  }

  rateRecipe(ratingobj) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/rating',
      ratingobj
    );
  }

  updateRecipe(recipe) {
    return this.http.put(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe',
      recipe
    );
  }

  makePrimary(imageid, recipeid) {
    let image = {
      id: imageid,
      recipe_id: recipeid,
    };
    return this.http.put(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images',
      image
    );
  }

  // editRecipe(recipe) {
  //   return this.http.post('http://localhost:8080/api/editRecipe', recipe);
  // }

  getRecipes(sort?: string) {
    if (sort) {
      var params = new HttpParams().set('sort', sort);
      return this.http.get(
        'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipes-v2',
        { params }
      );
    } else {
      return this.http.get(
        'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipes-v2'
      );
    }
  }

  getRecipeCount() {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe-count'
    );
  }

  getPendingRecipes() {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/pending-recipes'
    );
  }

  getRecipe(recipe) {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipe/',
      { params: { recipe: recipe } }
    );
  }

  pageView(pageviewinfo) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/pageviews',
      pageviewinfo
    );
  }

  getPageViews(recipe_id) {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/pageviews',
      { params: { recipe_id: recipe_id } }
    );
  }

  getLists() {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/lists/'
    );
  }

  getList(list_id) {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/list/',
      { params: { list_id: list_id } }
    );
  }

  getRandomRecipe() {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/random-recipe'
    );
  }

  getRecipesWithFilters(filters, sort?: string) {
    var params = new HttpParams();
    if (sort) {
      params = params.set('sort', sort);
    }
    if (filters.keywords.length > 0) {
      params = params.set('keywords', filters.keywords);
    }
    if (filters.type != '') {
      params = params.set('type', filters.type);
    }
    if (filters.time != '') {
      params = params.set('time', filters.time);
    }
    if (filters.difficulty != '') {
      params = params.set('difficulty', filters.difficulty);
    }
    if (filters.searchIngredients) {
      params = params.set('searchIngredients', filters.searchIngredients);
    }
    if (filters.tags) {
      params = params.set('tags', filters.tags);
    }

    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/recipes-v2',
      { params }
    );
  }

  deleteRecipe(recipeid) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/pending-recipes',
      recipeid
    );
  }

  /* COMMENTS */
  commentRecipe(comment) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/comments',
      comment
    );
  }

  getComments(recipeid) {
    var params = new HttpParams().set('recipeid', recipeid);
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/comments',
      { params }
    );
  }

  getRating(recipeid) {
    var params = new HttpParams().set('recipeid', recipeid);
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/rating',
      { params }
    );
  }

  getRatings(): Observable<any> {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/ratings'
    );
  }

  /* IMAGES */
  getImages(recipeid = ''): Observable<any> {
    if (recipeid != '') {
      var params = new HttpParams().set('recipeid', recipeid);
      return this.http.get(
        'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images',
        { params }
      );
    } else {
      return this.http.get(
        'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/images'
      );
    }
  }

  gets3Url(recipeid = '') {
    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images'
    );
  }

  getImagesS3(recipeid = ''): Observable<any> {
    // return the names from the db of all the images along w their recipe ids
    // return this.http.get('https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images')
    if (recipeid != '') {
      var params = new HttpParams().set('recipeid', recipeid);
      return this.http.get(
        'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images',
        { params }
      );
    } else {
      return this.http.get(
        'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images'
      );
    }
  }

  addRecipeImg(fileobj) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images',
      fileobj
    );
  }

  addRecipeImgS3(fileobj) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/s3images',
      fileobj
    );
  }

  /* USERS */

  register(user) {
    return this.http.post(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/user',
      user
    );
  }

  getUser(
    username: string = '',
    password: string = '',
    usertoken: string = ''
  ) {
    var username = encodeURIComponent(username);
    var pswd = encodeURIComponent(password);
    var usertoken = encodeURIComponent(usertoken);
    var params = new HttpParams()
      .set('username', username)
      .set('pswd', pswd)
      .set('usertoken', usertoken);

    return this.http.get(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/user',
      { params }
    );
  }

  getSavedRecipes(user_id) {
    var params = new HttpParams().set('user_id', user_id);
    return this.http.get<any[]>(
      'https://3blap58k04.execute-api.us-west-2.amazonaws.com/prod/saved-recipes',
      { params }
    );
  }
}
