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
import 'moment/locale/pl';
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

  constructor(private formBuilder: FormBuilder,
    private eventService: EventService) { }

  tasks: any;

  addTask:boolean=false;

  toogleAddTask(){
    this.addTask = !this.addTask;
  }

  eventContent: any;
  eventTime: any;

  form: any;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      content: ['', {
        validators: [Validators.required]
      }],
      eventDate: ['', {
        validators: [Validators.required]
      }]
    });
    this.eventService.getAllEvents().subscribe(data => {
      this.tasks = ((data as []));
      this.tasks.forEach(((element: { eventDate: string | number | Date; }) => {
        if( new Date(element.eventDate).getDate() == new Date(this.selected).getDate() &&
            new Date(element.eventDate).getMonth() == new Date(this.selected).getMonth() &&
            new Date(element.eventDate).getFullYear() == new Date(this.selected).getFullYear()){
              this.selectedTasks.push(element);
            }
      }));
      this.tasks.forEach((task: { eventDate: string; }) => {
        this.datesToHighlight.push(task.eventDate)
      });
    })
  }


  createTask(){    
    const time: string[] = (this.form.value.eventDate as string).split(':')
    const dateTime = new Date(new Date(new Date(this.selected).setHours(parseInt(time[0]))).setMinutes(parseInt(time[1])))

    this.eventService.createEvent({content: this.form.value.content, eventDate: dateTime}).subscribe(data => {
      this.addTask = false;
      this.selectedTasks = [];
      this.ngOnInit();
      this.onSelect()
    })
  }



  datesToHighlight:string[] = [];
  selectedTasks: any[] = [];


  selected: Date|any = new Date();

  getDayEvents(event: any){

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

  @ViewChild('calendar')  calendar: MatCalendar<Date>;
  selectedDate: any;  

  onSelect(){
    var dateToHighlight = this.selected.format('YYYY-MM-DDTHH:MM:00.000')+'Z'
    this.datesToHighlight.push(dateToHighlight);
    this.calendar.updateTodaysDate();
  }

  populateCalendar() {
    
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
