import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpRequestService } from '../Services/http-request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode : boolean = true;
  httpService : HttpRequestService = inject(HttpRequestService);
  router : Router = inject(Router);

  convertFromLoginToRegister(){
    this.isLoginMode = !this.isLoginMode;
  }
  onFormSubmit(form: NgForm){
    const email = form.value.email;
    const passowrd = form.value.password;
    if(!this.isLoginMode) {
      this.httpService.signupAuth(email,passowrd);
      this.convertFromLoginToRegister();
      this.router.navigate(['/']);
    } else{
      this.httpService.loginAuth(email,passowrd);
      this.router.navigate(['/']);
    }
    form.reset();
  }
}
