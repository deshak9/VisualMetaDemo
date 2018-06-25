import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {
  }

  /**
   * This method is responsible to mock backend server
   * uncomment "fakeBackendProvider" in shared module to activate this feature
   * if activated, we don't require backend server
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // array in local storage for registered users
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || {};
    let currentUserPosts = currentUser && currentUser.id && posts[currentUser.id] || [];

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {
      // authenticate
      if (request.url.endsWith('/login') && request.method === 'POST') {
        // find if any user matches login credentials
        let filteredUsers = users.filter(user => {
          return user.username === request.body.username && user.password === request.body.password;
        });

        if (filteredUsers.length) {
          // if login details are valid return 200 OK with user details and fake jwt token
          let user = filteredUsers[0];
          let body = {
            success: true,
            response: {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              token: 'fake-jwt-token'
            }
          };

          return of(new HttpResponse({status: 200, body: body}));
        } else {
          // else return 400 bad request
          return of(new HttpResponse({
            status: 200,
            body: {error: true, description: 'Username or password incorrect'}
          }));
        }
      }

      // register user
      if (request.url.endsWith('/register') && request.method === 'POST') {

        if (currentUser) {
          return of(new HttpResponse({
            status: 200,
            body: {error: true, description: "Logged in user can not create new account"}
          }));
        }
        // get new user object from post body
        let newUser = request.body;

        // validation
        let duplicateUser = users.filter(user => {
          return user.username === newUser.username;
        }).length;
        if (duplicateUser) {
          return throwError({error: {message: 'Username "' + newUser.username + '" is already taken'}});
        }

        // save new user
        newUser.id = users.length + 1;
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // respond 200 OK
        return of(new HttpResponse({status: 200, body: {success: true, response: newUser}}));
      }

      if (request.url.endsWith('/posts') && request.method === 'POST') {
        let newPost = request.body;

        newPost.id = currentUserPosts.length + 1;
        currentUserPosts.push(newPost);
        posts[currentUser.id] = currentUserPosts;

        localStorage.setItem('posts', JSON.stringify(posts));
        return of(new HttpResponse({status: 200, body: {success: true}}));
      }

      if (request.url.endsWith('/posts') && request.method === 'GET') {
        return of(new HttpResponse({status: 200, body: {success: true, response: posts[currentUser.id] || []}}));
      }

      if (request.url.match(/\/posts\/\d+$/) && request.method === 'DELETE') {

        let urlParts = request.url.split('/');
        let id = parseInt(urlParts[urlParts.length - 1]);

        currentUserPosts = currentUserPosts.filter(i => i.id !== id);
        posts[currentUser.id] = currentUserPosts;
        localStorage.setItem('posts', JSON.stringify(posts));
        return of(new HttpResponse({status: 200, body: {success: true}}));
      }

      if (request.url.endsWith('/logout') && request.method === 'POST') {
        return of(new HttpResponse({status: 200}));
      }


      // pass through any requests not handled above
      return next.handle(request);

    }))

    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};