import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { task } from '../model/task';
import { HttpClient } from '@angular/common/http';
import { HttpRequestService } from '../Services/http-request.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showCreateTask: boolean = false;
  http : HttpClient =  inject(HttpClient);
  httpService : HttpRequestService = inject(HttpRequestService);
  tasks : task[] = [];
  isloading : boolean = true;
  editTaskToCreate : task ;
  isEditMode : boolean = false;
  showTaskDetails :boolean = false;
  // taskDetails : task | null = null ;
  currentId : string | undefined;
  ngOnInit(): void {
    this.httpService.GetAllTask().subscribe((res)=>{
      this.tasks= res;
      this.isloading = false
      console.log(this.tasks);
    });
  }


  closeForm(){
    this.showCreateTask=false;
  }
  showCreateTaskMethod(){
    this.showCreateTask=true;
  }
  CreateNewTask(data: task){
    this.httpService.CreateNewTask(data);
    alert("Task Created Successfully");
    location.reload();
  }
  deleteTask(id: string | undefined) {
    console.log(id);
    const confirmDelete = window.confirm('Are you sure to delete the Task?');
    if (confirmDelete === true) {
      this.httpService.deleteTask(id);
      alert("Task Deleted Successfully");
      location.reload();
    }
  }
  ClearAllTask(){
    this.httpService.ClearAllTask();
    location.reload();
  }
  updateTask(item: task){
    this.showCreateTask =  true;
    this.isEditMode = true;
    this.editTaskToCreate = item;
  }
  showDetails(id : string | undefined){
    this.showTaskDetails = true;
    this.currentId = id;
  }
  close(){
    this.showTaskDetails = false;
  }
}
