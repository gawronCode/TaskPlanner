import { Component, OnInit } from '@angular/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import 'moment/locale/pl';



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

  constructor() { }

  ngOnInit(): void {
    console.log(new Date())
    this.selected = new Date();
  }

  datesToHighlight = ['2021-06-21','2021-06-24','2021-07-3'];

  selected: Date|any;

  printDate(){
    console.log(new Date(this.selected))
    
    console.log(this.selected.format("DD/MM/YYYY"))
  }

  dateClass() {
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
