import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { HttpRequestService } from 'src/app/Services/http-request.service';
import { task } from 'src/app/model/task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  @Output()
  closeDetails : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() taskDetails : task | null = null ; 
  @Input() Id : string | undefined;
  http : HttpRequestService = inject(HttpRequestService);
  isLoading :  boolean= true;

  ngOnInit(): void {
    this.http.getTaskDetails(this.Id).subscribe((data) =>{
      this.taskDetails= data;
      this.isLoading = false;
    })
  }
  
  close(){
    this.closeDetails.emit(true);
  }
}
