// This file is not needed in the current version of the project, 
// but it is useful for understanding the structure of Angular applications,
//  and might be used in future versions of the Application.
import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
}
