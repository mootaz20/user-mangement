import { Component, OnInit, inject } from '@angular/core';
import { HttpRequestService } from './Services/http-request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'userMangement';
  http : HttpRequestService = inject(HttpRequestService);

  ngOnInit(): void {
   this.http.idToken = localStorage.getItem('token');
  }

}
