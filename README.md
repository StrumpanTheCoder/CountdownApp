# Countdown Timer

This project is a countdown timer built with Angular, designed as a Single Page Application (SPA) using Standalone Components.
Users can set a custom title and event date, and the app dynamically displays the time remaining until the event.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v17.3.6 or higher)

## Setup

1. **Clone the repository:**

`git clone <repository-url>`
`cd <repository-directory>`
   

2. **Install dependencies:**

`npm install`

## Running the app

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. 

## Building the app

Run `ng build --configuration production` to build the project. The build artifacts will be stored in the dist/ directory.

## Further help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Further improvements of the app

This app can be considered a Minimum Viable Product (MVP).

Suggested improvements:
- Allow user to customize the date input to adjust the timer's precision, enabling the addition or removal of minutes, seconds, etc.
- Add an event listener for calendar updates, ensuring the countdown text updates without requiring the user to click outside the calendar.
- Set default focus on the Title input, if there is no previous event added by user.
- Automatically move focus to the Date input when the Enter key is pressed, if positioned in the Title input.
- Validate the date input to ensure it represents a real date (e.g., prevent invalid dates like June 31st or February 30th).
- Allow user to add multiple events, each with its own countdown timer.
- Allow user to add an avatar or symbol for each event.
