import { Injectable, inject } from '@angular/core';
import { task } from '../model/task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, Subject, catchError, exhaustMap, map, retry, take, tap, throwError } from 'rxjs';
import { AuthResponse } from '../model/AuthRespnse';
import swal from 'sweetalert2';
import { User } from '../model/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  errorSubject = new Subject<HttpErrorResponse>();
  http: HttpClient = inject(HttpClient);
  router : Router = inject(Router);
  user = new BehaviorSubject<User>(null);
  idToken : string;
  localid : string;
  CreateNewTask(data: task) {
    this.http.post("https://angularhttp-f2c40-default-rtdb.firebaseio.com/tasks.json", data,{params: {auth:this.idToken}})
      .subscribe(res => console.log('Done'));
  }
  GetAllTask(): Observable<any> {
    return this.http.get('https://angularhttp-f2c40-default-rtdb.firebaseio.com/tasks.json',).pipe(map((response) => {
        //TRANSFORM DATA
        let tasks = [];
        console.log(response);
        for (let key in response) {
            if (response.hasOwnProperty(key)) {
                tasks.push({ ...response[key], key: key });
            }
        }

        return tasks;
    }), catchError((err) => {
        //Write the logic to log errors
        const errorObj = { statusCode: err.status, errorMessage: err.message, datetime: new Date() }
        return throwError(() => err);
    }));
}
  deleteTask(id: string | undefined) {
    console.log(id);
    this.http.delete('https://angularhttp-f2c40-default-rtdb.firebaseio.com/tasks/' + id + '.json',{params:{auth:this.idToken}})
      .subscribe();
  }
  ClearAllTask() {
    this.http.delete('https://angularhttp-f2c40-default-rtdb.firebaseio.com/tasks.json')
      .subscribe((res) => console.log(res));
  }
  signupAuth(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    // console.log(data);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBhN9S6IspT0LPNJIqNNegtA-If3P6tKoM',
      data,
      { headers: headers }).pipe(catchError(this.handleError),tap((res) => {
        this.handleCreateUser(res)
    }))
      .subscribe({
        next(value) {
          swal("Success!", "You have successfully signed up.", "success");
        },
        error(err) {
          swal("Oops...", err, "error");
        },
      });
  }
  loginAuth(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBhN9S6IspT0LPNJIqNNegtA-If3P6tKoM',
      data,
      { headers: headers }).pipe(catchError(this.handleError),tap((res) => {
        this.handleCreateUser(res)
    }))
      .subscribe({
        next(value) {
          swal("Login Successful!", "You are now logged in. 'please Refresh  the page to see the content 😀❤'", "success");
        },
        error(err) {
          swal(err, `Invalid Username or Password`, "error");
        },
      });
  }
  private handleCreateUser(res){
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    this.idToken = res.idToken;
    localStorage.setItem('token', res.idToken);
    console.log(this.idToken);
    this.localid  = res.localId;
    localStorage.setItem('user', this.localid);
    console.log(this.localid);
    const user = new User(res.email, res.localId, res.idToken, expiresIn);
    this.user.next(user);

    // localStorage.setItem('user', JSON.stringify(user));
}

  handleError(err) {
    let errorMessage: string | null = null;
    if (!err.error.error || !err.error) {
      return errorMessage = "unkown error has occured";
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = "The email address is already in use by another account";
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = "Password sign-in is disabled for this project";
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = "Failed";
        break;
    }
    return throwError(() => errorMessage);
  }

  UpdateTask(id: string | undefined, data: task) {
    console.log(id);
    console.log(data);
    this.http.put('https://angularhttp-f2c40-default-rtdb.firebaseio.com/tasks/' + id + '/.json', data,{params:{auth:this.idToken}})
      .pipe(catchError((err) => {
        //Write the logic to log errors
        const errorObj = { statusCode: err.status, errorMessage: err.message, datetime: new Date() }
        return throwError(() => err);
      }))
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        }
      });
  }

  getTaskDetails(id : string | undefined) : Observable<any>{
   return this.http.get('https://angularhttp-f2c40-default-rtdb.firebaseio.com/tasks/'+id+'.json',{params: {auth:this.idToken} })
    .pipe(map((res)=>{
      let task = {};
      task= {...res , id: id};
      return task;
    }))
  }
  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

}

