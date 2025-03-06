import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, HostListener } from '@angular/core';
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

  @ViewChild('titleElement', { static: false }) titleElement!: ElementRef;
  @ViewChild('countdownElement', { static: false }) countdownElement!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadSavedData();
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    this.adjustElementSize(this.titleElement);
    this.adjustElementSize(this.countdownElement);
    this.adjustMargins();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustElementSize(this.titleElement);
    this.adjustElementSize(this.countdownElement);
    this.adjustMargins();
  }

  loadSavedData(): void {
    this.eventTitle = localStorage.getItem('eventTitle') || 'Midsummer Eve';
    this.eventDate = localStorage.getItem('eventDate') || '2025-06-20';
  }

  saveData(): void {
    localStorage.setItem('eventTitle', this.eventTitle);
    localStorage.setItem('eventDate', this.eventDate);
  }

  startCountdown(): void {
    this.saveData();

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(this.eventDate + 'T00:00:00').getTime();
      const timeLeft = eventDate - now;

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

      this.adjustElementSize(this.titleElement);
      this.adjustElementSize(this.countdownElement);
      this.adjustMargins();
    }, 1000);
  }

  adjustElementSize(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;
    let fontSize = 10;
    element.style.fontSize = `${fontSize}vw`;

    while (element.scrollWidth > element.clientWidth && fontSize > 1) {
      fontSize -= 0.5;
      element.style.fontSize = `${fontSize}vw`;
    }
  }

  adjustMargins(): void {
    const titleElement = this.titleElement.nativeElement;
    const countdownElement = this.countdownElement.nativeElement;

    const titleFontSize = parseFloat(window.getComputedStyle(titleElement).fontSize);
    const marginBottom = titleFontSize * 0.1; // Adjust this factor as needed
    const marginTop = titleFontSize * 0.1; // Adjust this factor as needed

    this.renderer.setStyle(titleElement, 'margin-bottom', `${marginBottom}px`);
    this.renderer.setStyle(countdownElement, 'margin-top', `${marginTop}px`);
  }
}
