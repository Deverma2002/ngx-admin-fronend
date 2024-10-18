import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { LineChartComponent } from './line-chart.component';
import { PieChartComponent } from './pie-chart.component';
import { RadarChartComponent } from './radar-chart.component';
import { BarChartComponent } from './bar-chart.component';
import { CommonModule } from '@angular/common';
import $ from 'jquery'; // Default import
import { Lead } from '../lead.model';  // Assuming Lead is the interface for user data

@Component({
  selector: 'app-lead-analytics',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    RouterOutlet,
    CommonModule,
    NbCardModule,
    NbLayoutModule,
    LineChartComponent,
    PieChartComponent,
    RadarChartComponent,
    BarChartComponent
  ],
  templateUrl: './lead-analytics.component.html',
  styleUrls: ['./lead-analytics.component.css'],
})
export class LeadAnalyticsComponent implements OnInit {
  userId: string = ''; 
  lead: Lead | null = null;  // Define a property for Lead
  firstName: string = '';  // Define firstName to store user name

  lineChartData!: { labels: string[], values: number[] };
  pieChartData!: { labels: string[], values: number[], colors: string[], borderColors: string[] };
  radarChartData!: { labels: string[], values: number[] };
  barChartData!: { labels: string[], values: number[] };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!; 
    if (!this.userId) {
      console.error('User ID is undefined or invalid');
      return;
    }
    this.fetchUserName();
    this.fetchChartData();
  }

  fetchUserName() {
    this.http.get<Lead>(`http://localhost:5000/api/users/${this.userId}`)
        .subscribe({
            next: (data) => {
                this.lead = data;  // Assign the fetched data to the 'lead' property
                if (this.lead) {
                  this.firstName = this.lead.name; // Example if you want to display the user's name
                }
            },
            error: (err) => {
                console.error('Error fetching user details:', err);
            }
        });
  }

  animateTitle(): void {
    $('.user-title').hide().fadeIn(1000).css('text-shadow', '2px 2px 5px rgba(0, 0, 0, 0.5)');
  }

  fetchChartData(): void {
    this.http.get(`http://localhost:5000/api/chartdata/${this.userId}`).subscribe(
      (data: any) => {
        console.log('Fetching chart data for userId:', this.userId);
        if (data) {
          if (data.chartData) {
            if (data.chartData.lineData) {
              this.lineChartData = { 
                labels: data.chartData.lineData.labels || [], 
                values: data.chartData.lineData.values || [] 
              };
            }
            if (data.chartData.pieData) {
              this.pieChartData = { 
                labels: data.chartData.pieData.labels || [], 
                values: data.chartData.pieData.values || [], 
                colors: data.chartData.pieData.colors || [], 
                borderColors: data.chartData.pieData.borderColors || [] 
              };
            }
            if (data.chartData.radarData) {
              this.radarChartData = { 
                labels: data.chartData.radarData.labels || [], 
                values: data.chartData.radarData.values || [] 
              };
            }
            if (data.chartData.barData) {
              this.barChartData = { 
                labels: data.chartData.barData.labels || [], 
                values: data.chartData.barData.values || [] 
              };
            }
            this.updateCharts();  
          } else {
            console.error('Chart data not found in the response');
          }
        } else {
          console.error('Fetched data is undefined');
        }
      },
      (error) => {
        console.error('Error fetching chart data:', error);
      }
    );
  }

  updateCharts(): void {
    // Pass the fetched data to the child components (charts)
  }
}
