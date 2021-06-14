import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
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

  constructor(private eventService: EventService) { }

  tasks: any;

  xD: any;

  ngOnInit(): void {
    this.selected = new Date();
    this.eventService.getAllEvents().subscribe(data => {
      this.tasks = ((data as []));
    })
    
  }

  datesToHighlight:string[] = [];

  selected: Date|any;


  getDayEvents(){

    console.log(this.selected._i)
    console.log(new Date(this.tasks[1].eventDate).getDate())
  }


  populateCalendar() {

    this.tasks.forEach((task: { eventDate: string; }) => {
      this.datesToHighlight.push(task.eventDate)
    });

    return (date: Date): MatCalendarCellCssClasses => {
      var highlightDate = this.datesToHighlight
        .map(strDate => new Date(strDate))
        .some(
          d =>{
            console.log(d.getDate())
            return d.getDate() === new Date(date).getDate() &&
            d.getMonth() === new Date(date).getMonth() &&
            d.getFullYear() === new Date(date).getFullYear()
          }
        );      
      return highlightDate ? 'special-date' : '';
    };
  }


}
