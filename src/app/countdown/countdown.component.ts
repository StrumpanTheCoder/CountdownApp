import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, AfterViewInit {
  eventTitle: string = '';
  eventDate: string = '';
  countdownText: string = '';

  private timerInterval: any;

  // Reference to the title and countdown elements
  @ViewChild('titleElement', { static: false }) titleElement!: ElementRef;
  @ViewChild('countdownElement', { static: false }) countdownElement!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadSavedData();
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    this.adjustTitleAndCountdownSize();
  }

  loadSavedData(): void {
    this.eventTitle = localStorage.getItem('eventTitle') || 'Midsummer Eve';
    this.eventDate = localStorage.getItem('eventDate') || '2025-06-20T00:00:00';
  }

  formatDate(): void {
    if (this.eventDate) {
      const date = new Date(this.eventDate);
      this.eventDate = date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
    }
  } 

  saveData(): void {
    localStorage.setItem('eventTitle', this.eventTitle);
    localStorage.setItem('eventDate', this.eventDate);
  }

  startCountdown(): void {
    this.saveData(); // Save when countdown starts
  
    if (this.timerInterval) clearInterval(this.timerInterval);
  
    this.timerInterval = setInterval(() => {
      const now = new Date(); // Get current local time
      const localNow = now.getTime(); // Ensure local time is used directly
  
      // Convert event date to local time, ensuring it ends at 23:59:59 the day before the event
      const eventDate = new Date(this.eventDate);
      eventDate.setDate(eventDate.getDate() - 1); // Move to the previous day
      eventDate.setHours(23, 59, 59, 999); // Set time to 23:59:59 local time
  
      const targetDate = eventDate.getTime(); // Ensure event date is in local time
      const timeLeft = targetDate - localNow; // Correctly compare local times
  
      if (timeLeft <= 0) {
        this.countdownText = 'The event has started!';
        clearInterval(this.timerInterval);
        return;
      }
  
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
      this.countdownText = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`;
  
      setTimeout(() => {
        this.adjustTitleAndCountdownSize(); // Ensure text resizing still works properly
      }, 50);
    }, 1000);
  }
  

  // Adjusts the title & countdown sizes dynamically to fit within screen width
  adjustTitleAndCountdownSize(): void {
    this.adjustElementSize(this.titleElement, 12); // Adjust title (with "Time to ")
    this.adjustElementSize(this.countdownElement, 12); // Adjust countdown
  }

  // Generic function to adjust element size dynamically
  adjustElementSize(elementRef: ElementRef, maxSize: number): void {
    setTimeout(() => {
      if (elementRef) {
        const element = elementRef.nativeElement;
        let fontSize = maxSize;
        element.style.fontSize = `${fontSize}vw`;
        element.style.whiteSpace = 'nowrap';
        element.style.maxWidth = '90vw'; // Prevents overflowing

        while (element.scrollWidth > element.clientWidth && fontSize > 1) {
          fontSize -= 0.5;
          element.style.fontSize = `${fontSize}vw`;
        }
      }
    }, 100);
  }
}
