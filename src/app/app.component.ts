// This is the root component of the application.
// The AppComponent class is decorated with the @Component decorator,
// which provides metadata about the component to define the main UI structure.
// Imports CountdownComponent to use inside this component.
import { Component } from '@angular/core';
import { CountdownComponent } from './countdown/countdown.component'; // Import the countdown component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountdownComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent { }

