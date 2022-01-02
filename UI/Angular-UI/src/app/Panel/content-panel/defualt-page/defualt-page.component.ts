
import { Component, OnInit } from '@angular/core';
import { VisitedHistory } from '../../../shared/modules/VisitedHistory.module';
import { them } from '../../../shared/service/themplate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../shared/service/api.service';
import Chart from 'chart.js';
@Component({
  selector: 'app-defualt-page',
  templateUrl: './defualt-page.component.html',
  styleUrls: ['./defualt-page.component.css']
})
export class DefualtPageComponent implements OnInit {

  constructor(public them: them, public router: Router, public api: ConfigService) { }
  VisitedHistory: VisitedHistory[] = [];
  frontime: string = '';
  totime: string = '';
  TodayVisited: string = '';
  Date: string = '';
  ngOnInit() {
    
   

    this.api.Fetch_FilterVisitedHistoryGet(this.them.CompanyID,'0').subscribe(data => {
      
      this.TodayVisited = data[0].CountVisited.toString();
      

    });
    this.api.Fetch_FilterVisitedHistoryGet(this.them.CompanyID,'30').subscribe(data => {
      this.VisitedHistory = data;
      
      if (this.them.Lang == 'fa') {
       
        this.Date = data[0].Date_Shamsi;
      }
      else {
        
        this.Date = data[0].Date_Miladi.toLocaleString();
      }
      
      var date_list = [];
      var vitedlist = [];
      for (let item of this.VisitedHistory) {
        debugger;
        if (this.them.Lang == 'fa') {
          date_list.push(item.Date_Shamsi);
        }
        else {
          date_list.push(item.Date_Miladi);
        }
        vitedlist.push(item.CountVisited);
      }

      var ctx = document.getElementById('myChart');
      var myChart = new Chart(ctx, {
        // The type of chart we want to create
        //type: 'line',
        type: 'bar',
        // The data for our dataset
        data: {
          labels: date_list,
          datasets: [{
            label: 'بازدید سایت  یک ماه گذشته',
            backgroundColor: '#17a2b8',
            borderColor: 'rgb(255, 99, 132)',
            data: vitedlist
          }]
        },

        // Configuration options go here
        options: {
          //responsive: true,
         
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

    });
  }
  


  
}
