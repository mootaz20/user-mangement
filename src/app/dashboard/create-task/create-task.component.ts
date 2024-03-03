import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpRequestService } from 'src/app/Services/http-request.service';
import { task } from 'src/app/model/task';
import swal from 'sweetalert2';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements  OnInit{
  
  @ViewChild('taskForm') taskForm : NgForm;
  @Output() close : EventEmitter<boolean> = new EventEmitter<boolean>();
  httpService : HttpRequestService = inject(HttpRequestService);
  @Output() CreateTask : EventEmitter<task> = new EventEmitter<task>(); 
  @Input() editTask : task;
  @Input() isEditMode : boolean;

  ngOnInit(): void {
    setTimeout(() => {
      this.taskForm.setValue({
        title: this.editTask.title,
        descrption: this.editTask.descrption,
        assigndTo: this.editTask.assigndTo,
        createdAt: this.editTask.createdAt,
        status: this.editTask.status,
        priority: this.editTask.priority,
      })
    }, 0);
  }


  closeForm(){
    this.close.emit(true);
  }
  addTask(form: NgForm){
     if(!this.isEditMode){
      this.CreateTask.emit(form.value);
      this.close.emit(true);
      console.log(form);
     }else{
      this.httpService.UpdateTask(this.editTask.key,form.value);
      swal("Update Successful!", "success");
      this.close.emit(true);
      setTimeout(function () { location.reload(); }, 1500);
     }
  }
}
