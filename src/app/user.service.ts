import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: any;

  constructor() { }

  setUser(user){
      // this should also save the user to local storage
      this.user = user
  }

  getUser(){
      return this.user
  }

}
