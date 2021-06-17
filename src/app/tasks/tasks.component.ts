import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatCalendar, MatCalendarBody, MatCalendarCellCssClasses, MatCalendarHeader, MatDatepickerContent } from '@angular/material/datepicker';
import * as moment from 'moment';
import 'moment/locale/pl';
import { forkJoin, Observable } from 'rxjs';
import { EventService } from '../_services/event.service';



@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})


export class TasksComponent implements OnInit {


  datesToHighlight:string[] = [];
  selectedTasks: any[] = [];

  taskSelected: any;
  taskId: any;
  selected: Date|any = new Date();

  tasks: any;

  addTask:boolean=false;
  editTaskb:boolean=false;

  eventContent: any;
  eventTime: any;

  editedTaskDate: any;

  form: any;

  @ViewChild('calendar')  calendar: MatCalendar<Date>;
  selectedDate: any;  


  constructor(private formBuilder: FormBuilder,
    private eventService: EventService) {
      
     }



  toogleAddTask(){
    this.addTask = !this.addTask;
  }

  toogleFlags(){
    this.addTask = false;
    this.editTaskb = false;
    this.form = this.getForm();
  }

  toogleEditTask(){
    this.editTaskb = !this.editTaskb;
  }


  hideEditForm(){
    this.editTaskb = false;
  }


  ngOnInit(): void {
    
    
    this.form = this.getForm();

    this.getUserEvents()
  }

  getUserEvents(){
    return this.eventService.getUserEvents().subscribe(data =>  {
      this.tasks = ((data as []));
      this.tasks.forEach(((element: { eventDate: string | number | Date; }) => {
        if( new Date(element.eventDate).getDate() == new Date(this.selected).getDate() &&
            new Date(element.eventDate).getMonth() == new Date(this.selected).getMonth() &&
            new Date(element.eventDate).getFullYear() == new Date(this.selected).getFullYear()){
              this.selectedTasks.push(element);
            }
      }));
    })
  }

  getForm(){
    return this.formBuilder.group({
      content: ['', {
        validators: [Validators.required]
      }],
      eventDate: ['', {
        validators: [Validators.required]
      }]
    });
  }

  getUserEventsRefresh(){
    return this.eventService.getUserEvents().subscribe(async data =>  {
      this.tasks = ((data as []));
      this.tasks.forEach(((element: { eventDate: string | number | Date; }) => {
        if( new Date(element.eventDate).getDate() == new Date(this.selected).getDate() &&
            new Date(element.eventDate).getMonth() == new Date(this.selected).getMonth() &&
            new Date(element.eventDate).getFullYear() == new Date(this.selected).getFullYear()){
              this.selectedTasks.push(element);
            }
      }));
      await this.onRemove();
    })
  }

  getUserEventsRefreshEdit(){
    return this.eventService.getUserEvents().subscribe(async data =>  {
      this.tasks = ((data as []));
      this.tasks.forEach(((element: { eventDate: string | number | Date; }) => {
        if( new Date(element.eventDate).getDate() == new Date(this.selected).getDate() &&
            new Date(element.eventDate).getMonth() == new Date(this.selected).getMonth() &&
            new Date(element.eventDate).getFullYear() == new Date(this.selected).getFullYear()){
              this.selectedTasks.push(element);
            }
      }));
      this.getDayEvents(this.selected);
    })
  }


  createTask(){    
    const time: string[] = (this.form.value.eventDate as string).split(':')
    const dateTime = new Date(new Date(new Date(this.selected).setHours(parseInt(time[0]))).setMinutes(parseInt(time[1])))
    this.eventService.createEvent({content: this.form.value.content, eventDate: dateTime}).subscribe(data => {
      this.addTask = false;
      this.selectedTasks = [];
      this.ngOnInit();
      this.onSelect(dateTime);
    })
  }

  editTask(){
    const time: string[] = (this.form.value.eventDate as string).split(':')
    const dateTime = new Date(this.editedTaskDate);
    dateTime.setHours(parseInt(time[0]));
    dateTime.setMinutes(parseInt(time[1]));
    var eventId = this.taskId;

    if(eventId == undefined) return;

    this.eventService.updateEvent({id: eventId, content:this.form.value.content, eventDate: dateTime}).subscribe(() => {
      this.selectedTasks = [];
      this.toogleFlags();
      this.getUserEventsRefreshEdit()
    })
  }

  async deleteTask(){
    var eventId = this.taskId;
    this.taskSelected=false;
    this.taskId = undefined;
    
    if (eventId == undefined) return;
    
    this.eventService.deleteEvent({id: eventId, content:"",eventDate: new Date()}).subscribe(async data => {
      this.selectedTasks = [];
      this.getUserEventsRefresh();
    })

  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  onSelect(dateTime: Date){
    dateTime.setHours(10);
    var dateToHighlight = moment(dateTime).format('YYYY-MM-DDTHH:MM:00.000')+'Z'
    this.datesToHighlight.push(dateToHighlight);
    this.calendar.updateTodaysDate();
  }

  async onRemove(){
    this.datesToHighlight = []
    this.tasks.forEach((task: { eventDate: string; }) => {
      this.datesToHighlight.push(task.eventDate)
    });
    this.calendar.updateTodaysDate()
    await this.delay(50).finally(()=> this.calendar.updateTodaysDate());
  }

  setSelectedTaskData(id: number, content: any, date: any){
    if(this.editTaskb || this.addTask) return;
    if(this.taskId == id) {
      this.editedTaskDate = null;
      this.taskId=undefined;
      this.form = this.getForm();
    } else if(this.taskId != id) {
      this.editedTaskDate = date;
      this.taskId = id;
      this.form = this.formBuilder.group({
        content: [content, {
          validators: [Validators.required]
        }],
        eventDate: [moment(date).format('HH:mm'), {
          validators: [Validators.required]
        }]
      });
    }
  }

  getDayEvents(event: any){
    this.toogleFlags();
    this.taskSelected = false;
    this.taskId=undefined;
    this.selected = event;
    this.addTask = false;
    this.selectedTasks = [];
    this.tasks.forEach(((element: { eventDate: string | number | Date; }) => {
      if( new Date(element.eventDate).getDate() == new Date(this.selected).getDate() &&
          new Date(element.eventDate).getMonth() == new Date(this.selected).getMonth() &&
          new Date(element.eventDate).getFullYear() == new Date(this.selected).getFullYear()){
            this.selectedTasks.push(element);
          }
    }));
    this.selectedTasks = this.selectedTasks.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
  }
  

  populateCalendar() {
    this.datesToHighlight = []
    this.tasks.forEach((task: { eventDate: string; }) => {
      this.datesToHighlight.push(task.eventDate)
    });

    return (date: Date): MatCalendarCellCssClasses => {
      var highlightDate = this.datesToHighlight
        .map(strDate => new Date(strDate))
        .some(
          d =>{
            return d.getDate() === new Date(date).getDate() &&
            d.getMonth() === new Date(date).getMonth() &&
            d.getFullYear() === new Date(date).getFullYear()
          }
        );
      
      return highlightDate ? 'special-date' : '';
    };
    

  }


}
