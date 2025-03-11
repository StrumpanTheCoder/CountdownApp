import {
  Component, // Defines the component and its metadata. Used in the @Component decorator.
  OnInit, // Lifecycle hook that is called after Angular has initialized all data-bound properties. Implemented in the component class to run initialization logic.
  ElementRef, // Provides a way to access the DOM element associated with a component. Used with @ViewChild to manipulate DOM elements directly.
  ViewChild, // Allows you to access a child component, directive, or DOM element from the parent component. Used to get references to DOM elements or child components.
  AfterViewInit, // Lifecycle hook that is called after Angular has fully initialized a component's view. Implemented in the component class to run logic that depends on the view being fully initialized.
  Renderer2, // Provides a way to manipulate the DOM in a platform-independent way. Used to set styles, attributes, and properties on DOM elements.
  HostListener, // Decorator that allows you to listen to events on the host element of the component. Used to handle events like window resize.
} from '@angular/core'
import { FormsModule } from '@angular/forms' // Provides support for template-driven forms. Imported in the component to use Angular forms features like ngModel.

@Component({
  selector: 'app-countdown', // The CSS selector that identifies this component in a template
  standalone: true, // Indicates that this component is a standalone component
  imports: [FormsModule], // Specifies the modules that this component imports
  templateUrl: './countdown.component.html', // The path to the HTML template file for this component
  styleUrls: ['./countdown.component.scss'], // The path to the CSS/SCSS stylesheets for this component
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
    const timeLeft = eventDate - now // remaining time in milliseconds
    if (timeLeft <= 0 && this.countdownText == '') { //second condition is to avoid redundant updates
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
    // localStorage ligger i dev tools under Application
    localStorage.setItem('eventTitle', this.eventTitle)
    localStorage.setItem('eventDate', this.eventDate)
  }

  startCountdown(): void {
    this.saveData()

    // Set a new interval timer to update the countdown every second
    /*This function is an anonymous arrow function used as a callback inside setInterval(). It runs every second, 
    calculates the time left until the event, updates the countdown text, and stops the timer when the event starts. 
    The arrow function (=>) ensures that this refers to the component instance, avoiding the need for .bind(this).*/
    this.timerInterval = setInterval(() => {
      // Get the current time
      const now = new Date().getTime()

      // Get the event date and time
      // The 'T00:00:00' ensures that the time is set to midnight (00:00:00) on the specified date.
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
      // Modulo Operator % is used to get the remainder of a division operation
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

      // Update the countdown text
      this.countdownText = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`

      // Adjust the sizes and margins of the title and countdown elements/
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

      // The null check here makes sense as this.countdownElement is an object that references 
      // the DOM element with the #countdownElement template reference variable.
    if (elementRef === this.titleElement && this.countdownElement) {
      const titleSize = this.titleElement.nativeElement.style.fontSize
      this.countdownElement.nativeElement.style.fontSize = titleSize
    }
  }

  adjustMargins(): void {
    const titleElement = this.titleElement.nativeElement
    const countdownElement = this.countdownElement.nativeElement

    const titleFontSize = parseFloat(window.getComputedStyle(titleElement).fontSize)
    // Calculate the margins based on the font size of the title element.
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
