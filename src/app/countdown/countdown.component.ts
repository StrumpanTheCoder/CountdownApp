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

  private countdownInterval: any

  @ViewChild('titleElement', { static: false }) titleElement!: ElementRef
  @ViewChild('countdownElement', { static: false }) countdownElement!: ElementRef
  @ViewChild('titleInput', { static: false }) titleInput!: ElementRef
  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadSavedData()
    this.startCountdown()
  }

  ngAfterViewInit(): void {
    const now = new Date().getTime()
    const eventDate = new Date(this.eventDate + 'T00:00:00').getTime()
    const timeLeft = eventDate - now

    if (timeLeft <= 0 && this.countdownText === '') {
      this.countdownText = 'The event has started!'
      this.adjustElements()
    }
    if (this.countdownText !== '') {
      this.adjustElements()
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustElements()
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
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime()
      const eventDate = new Date(this.eventDate + 'T00:00:00').getTime()
      const timeLeft = eventDate - now

      if (timeLeft <= 0) {
        this.countdownText = 'The event has started!'
        clearInterval(this.countdownInterval)
        this.saveData()
        this.adjustElements()
        return
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

      this.countdownText = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`

      if (this.countdownText !== '') {
        this.adjustElements()
      }
    }, 1000)
  }

  adjustElements(): void {
    this.adjustElementSize(this.titleElement)
    this.adjustElementSize(this.countdownElement)
    this.adjustMargins()
  }

  adjustElementSize(elementRef: ElementRef): void {
    const element = elementRef.nativeElement
    let fontSize = 10
    element.style.fontSize = `${fontSize}vw`

    while (element.scrollWidth > element.clientWidth && fontSize > 1) {
      fontSize -= 0.1
      element.style.fontSize = `${fontSize}vw`
    }

    while (element.scrollWidth < element.clientWidth && fontSize < 20) {
      fontSize += 0.1
      element.style.fontSize = `${fontSize}vw`
    }

    if (elementRef === this.titleElement) {
      const marginTop = fontSize * 0.5
      this.renderer.setStyle(element, 'margin-top', `${marginTop}vh`)
    }

    if (elementRef === this.titleElement && this.countdownElement) {
      const titleSize = this.titleElement.nativeElement.style.fontSize
      this.countdownElement.nativeElement.style.fontSize = titleSize
    }
  }

  adjustMargins(): void {
    const titleElement = this.titleElement.nativeElement
    const countdownElement = this.countdownElement.nativeElement

    const titleFontSize = parseFloat(window.getComputedStyle(titleElement).fontSize)
    const marginBottom = titleFontSize * 0.1
    const marginTop = titleFontSize * 0.1

    this.renderer.setStyle(titleElement, 'margin-bottom', `${marginBottom}px`)
    this.renderer.setStyle(countdownElement, 'margin-top', `${marginTop}px`)
  }

  updateTitleAndCountdown(): void {
    this.eventTitle = this.tempEventTitle
    this.eventDate = this.tempEventDate
    this.startCountdown()
    this.titleInput.nativeElement.blur()
    this.dateInput.nativeElement.blur()
  }
}
