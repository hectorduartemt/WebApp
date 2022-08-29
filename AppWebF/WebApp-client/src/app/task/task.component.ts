import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '../task.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: any[] = [];
  form: FormGroup = this.fb.group({ //Group recibe un objeto de los controles pra este formulario reactivo
    name: [],
    completed: [false]
  });
  taskInEdition: any;


  constructor(
    private taskService: TaskService, //Inyectamos TareaService que tiene todo para interactuar con la api
    private fb: FormBuilder //FormBuilder me va a ayudar a formar el formulario reactivo
  ) { }

  ngOnInit(): void {
    //Inicializamos tareas
    this.taskService.getAll()
    .subscribe((tasks: any) =>{
      console.log('tareas', tasks);
      this.tasks = tasks._embedded.tareas;
    })  //Nos suscribimos a los cambios, retorna un archivo plano
  }

  getAll(){
    this.taskService.getAll()
    .subscribe((tasks: any) =>{
      console.log('tareas', tasks);
      this.tasks = tasks._embedded.tareas;
  })
}

  save(){ //Creamos esta funcion para cuando se de click en el boton guardar
    const values = this.form.value;
    console.log('values', values);  

    let request;
    
    if(this.taskInEdition){
      request = this.taskService.update(this.taskInEdition._links.self.href, values);
      
    }   
    else{
      request = this.taskService.create(values);
      
    }
    
    request
      .subscribe({
      next:() =>{
        this.getAll();
        this.taskInEdition = null
        this.form.setValue({
          name: '',
          completed: false
        })
      },
      error: () => {
      }
    
  })
}

  update(task: any){
    this.taskInEdition = task;
    this.form.setValue({
      name: task.name,
      completed: task.completed
    })

  }

  delete(task: any){
    const ok = confirm('Esta seguro de Eliminar esta tarea?');
    if(ok){
      this.taskService.delete(task._links.self.href)
      .subscribe(() => {
        this.getAll();
      });
    }
    
  }

}
