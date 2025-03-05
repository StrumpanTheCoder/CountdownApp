import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})

export class CountdownComponent implements OnInit {
  eventTitle: string = '';
  eventDate: string = '';
  countdownText: string = '';

  private timerInterval: any;

  ngOnInit(): void {
    this.loadSavedData();
    this.startCountdown();
  }

  loadSavedData(): void {
    this.eventTitle = localStorage.getItem('eventTitle') || 'Midsummer Eve';
    this.eventDate = localStorage.getItem('eventDate') || '2025-06-20T00:00:00';
  }

  saveData(): void {
    localStorage.setItem('eventTitle', this.eventTitle);
    localStorage.setItem('eventDate', this.eventDate);
  }

  startCountdown(): void {
    this.saveData(); // Save when countdown starts

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(this.eventDate).getTime();
      const timeLeft = targetDate - now;

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
    }, 1000);
  }
}