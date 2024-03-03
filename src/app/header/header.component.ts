import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpRequestService } from '../Services/http-request.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggoed: boolean = false;
  httpService: HttpRequestService = inject(HttpRequestService);
  unsub: Subscription;
  router: Router = inject(Router);
  loginToken : string;
  ngOnInit(): void {
    this.loginToken = this.httpService.idToken || localStorage.getItem('token');
    console.log(this.loginToken);
    if (this.loginToken != null) {
        this.isLoggoed=true;
      } else{
        this.isLoggoed=false;
      }
   
  }
  Logout(){
    this.httpService.logout();
    this.isLoggoed=false;
    this.router.navigate(['/login&signup'])
  }
  ngOnDestroy(): void {
    this.unsub.unsubscribe();
  }


}
