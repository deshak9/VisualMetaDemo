import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AuthenticationService, UserService} from './services';
import {HomeComponent} from './home';
import {WritePostComponent} from "./write-post/write-post.component";
import {PostCardComponent} from "./post-card/post-card.component";
import {PostService} from "./services/post.service";
import {SharedModule} from "./shared/shared.module";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {routing} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

// used to create fake backend

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    BrowserModule,
    routing,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    WritePostComponent,
    PostCardComponent
  ],
  providers: [
    AuthenticationService,
    UserService,
    PostService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}