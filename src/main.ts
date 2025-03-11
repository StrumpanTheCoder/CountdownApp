// The app is initiated from this file
// The bootstrapApplication function in Angular is used to bootstrap (initialize) an Angular application with a standalone component. This function sets up the application environment and starts the Angular application by creating and rendering the root component.
// AppComponent: The root component to bootstrap
import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
