// Application entry point
// The bootstrapApplication bootstraps (loads) the root Angular module with a standalone component (AppComponent). 
// Bootstraps AppComponent as the root component of the application.
import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
