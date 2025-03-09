import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
  HostListener,
} from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, AfterViewInit {
  eventTitle: string = ''
  eventDate: string = ''
  countdownText: string = ''

  tempEventTitle: string = ''
  tempEventDate: string = ''

  // Använd inte any, använd number eller Date
  private timerInterval: any
  private calendarUsed: boolean = false

  @ViewChild('titleElement', { static: false }) titleElement!: ElementRef
  @ViewChild('countdownElement', { static: false }) countdownElement!: ElementRef
  @ViewChild('titleInput', { static: false }) titleInput!: ElementRef
  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef

  constructor(private renderer: Renderer2) {}
// Initialization logic that does not depend on the view.
  ngOnInit(): void {   
    this.loadSavedData()
    this.startCountdown()
  }

  //Initialization logic that depends on the view being fully initialized.
  ngAfterViewInit(): void {
    // Kör bara om countdownText har värde
    const now = new Date().getTime()
    const eventDate = new Date(this.eventDate + 'T00:00:00').getTime()
    const timeLeft = eventDate - now
    if (timeLeft <= 0 && this.countdownText == '') {
      this.countdownText = 'The event has started!'
      this.adjustElementSize(this.titleElement)
      this.adjustElementSize(this.countdownElement)
      this.adjustMargins()
    }
    if (this.countdownText !== '') {
      this.adjustElementSize(this.titleElement)
      this.adjustElementSize(this.countdownElement)
      this.adjustMargins()
    }

    // Add event listeners to detect when the calendar is used
  /*  this.dateInput.nativeElement.addEventListener('focus', () => {
      this.calendarUsed = true
    })
    this.dateInput.nativeElement.addEventListener('blur', () => {
      if (this.calendarUsed) {
        this.updateTitleAndCountdown()
        this.calendarUsed = false
      }
    })*/
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustElementSize(this.titleElement)
    this.adjustElementSize(this.countdownElement)
    this.adjustMargins()
  }

  loadSavedData(): void {
    this.eventTitle = localStorage.getItem('eventTitle') || 'Midsummer Eve'
    this.eventDate = localStorage.getItem('eventDate') || '2025-06-20'
    this.tempEventTitle = this.eventTitle
    this.tempEventDate = this.eventDate
  }

  saveData(): void {
    localStorage.setItem('eventTitle', this.eventTitle)
    localStorage.setItem('eventDate', this.eventDate)
  }

  startCountdown(): void {
    this.saveData()

    // Check if there is an existing interval timer and clear it if it exists
    if (this.timerInterval) clearInterval(this.timerInterval)

    // Set a new interval timer to update the countdown every second
    /*This function is an anonymous arrow function used as a callback inside setInterval(). It runs every second, 
    calculates the time left until the event, updates the countdown text, and stops the timer when the event starts. 
    The arrow function (=>) ensures that this refers to the component instance, avoiding the need for .bind(this).*/
    this.timerInterval = setInterval(() => {
      // Get the current time
      const now = new Date().getTime()

      // Get the event date and time
      const eventDate = new Date(this.eventDate + 'T00:00:00').getTime()

      // Calculate the time left until the event
      const timeLeft = eventDate - now

      // If the event has started, update the countdown text and clear the interval
      if (timeLeft <= 0) {
        this.countdownText = 'The event has started!'
        clearInterval(this.timerInterval)
        this.saveData()
        this.adjustElementSize(this.titleElement)
        this.adjustElementSize(this.countdownElement)
        this.adjustMargins()
        return
      }

      // Calculate the remaining days, hours, minutes, and seconds
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

      // Update the countdown text
      this.countdownText = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`

      // Adjust the sizes and margins of the title and countdown elements
      // Hämta eventDate innan dessa körs alt kör dem bara om eventDate har värde annat än null/''
      if (this.countdownText !== '') {
        this.adjustElementSize(this.titleElement)
        this.adjustElementSize(this.countdownElement)
        this.adjustMargins()
      }
    }, 1000)
  }

  adjustElementSize(elementRef: ElementRef): void {
    const element = elementRef.nativeElement
    // Check first if there is a fontsize of the element - in that case use that I suppose
    let fontSize = 10
    element.style.fontSize = `${fontSize}vw`

    while (element.scrollWidth > element.clientWidth && fontSize > 1) {
      fontSize -= 0.1
      element.style.fontSize = `${fontSize}vw`
    }

    // Ensure the text fills the available space
    while (element.scrollWidth < element.clientWidth && fontSize < 20) {
      fontSize += 0.1
      element.style.fontSize = `${fontSize}vw`
    }

    // Adjust the top margin proportionally
    if (elementRef === this.titleElement) {
      const marginTop = fontSize * 0.5 // Adjust this factor as needed
      this.renderer.setStyle(element, 'margin-top', `${marginTop}vh`)
    }

    // Match countdown size to title size
    /* if (elementRef === this.titleElement && this.countdownElement) {
      this.countdownElement.nativeElement.style.fontSize = element.style.fontSize
    }*/

    if (elementRef === this.titleElement && this.countdownElement) {
      const titleSize = this.titleElement.nativeElement.style.fontSize
      this.countdownElement.nativeElement.style.fontSize = titleSize
    }
  }

  adjustMargins(): void {
    const titleElement = this.titleElement.nativeElement
    const countdownElement = this.countdownElement.nativeElement

    const titleFontSize = parseFloat(window.getComputedStyle(titleElement).fontSize)
    const marginBottom = titleFontSize * 0.1 // Adjust this factor as needed
    const marginTop = titleFontSize * 0.1 // Adjust this factor as needed

    this.renderer.setStyle(titleElement, 'margin-bottom', `${marginBottom}px`)
    this.renderer.setStyle(countdownElement, 'margin-top', `${marginTop}px`)
  }

  updateTitleAndCountdown(): void {
    this.eventTitle = this.tempEventTitle
    this.eventDate = this.tempEventDate
    this.saveData()
    this.startCountdown()
    this.titleInput.nativeElement.blur()
    this.dateInput.nativeElement.blur()
  }
}
