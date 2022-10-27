import { Injectable } from '@angular/core';
import { userObject } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any;

  constructor() {}

  setUser(user: userObject | any) {
    if (!user.id) {
      this.user = undefined;
    } else {
      this.user = {
        id: user.id,
        username: user.username,
        adminflag: user.adminflag,
        color_key: user.color_key,
      };
    }
  }

  getUser() {
    return this.user;
  }
}
