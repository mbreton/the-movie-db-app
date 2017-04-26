import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MovieDbService } from './movie-db-service/movie-db.service';
import { APP_CONFIG, config }     from './app.config';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    MovieDbService,
    { provide: APP_CONFIG, useValue: config  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
