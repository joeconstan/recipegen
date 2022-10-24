import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any;

  constructor() {}

  setUser(user) {
    // this should also save the user to local storage
    this.user = {
      id: user.id,
      username: user.username,
      adminflag: user.adminflag,
      color_key: user.color_key,
    };
  }

  getUser() {
    return this.user;
  }
}
