import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Rutas
import { APP_ROUTING } from './app.routes';

// Componentes
import { AppComponent } from './app.component';
import {LoginPopupComponent} from './login-popup/login-popup.component';
import {LoginComponent} from './login/login.component';
import { CardComponent } from './card/card.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './fragments/navbar/navbar.component';
import { FooterComponent } from './fragments/footer/footer.component';
import { HeaderComponent } from './fragments/header/header.component';
import {FriendsComponent} from './friends/friends.component';
import { RegisterComponent } from './register/register.component';

// Services
import { AuthService } from './services/solid.auth.service';
import { AuthGuard } from './services/auth.guard.service';
import { TTLWriterService } from './services/printers/ttlwriter.service';
import {SparqlService} from './services/query/sparql.service';
import { RdfService } from './services/rdf.service';
import {AboutComponent} from './about/about.component';


import { IconsModule } from './icons/icons.module';
  import { PickerModule } from '@ctrl/ngx-emoji-mart';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPopupComponent,
    DashboardComponent,
    CardComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    FriendsComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    APP_ROUTING,
    RouterModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    IconsModule,
    PickerModule, 
    BrowserAnimationsModule // required for toastr
  ],
  providers: [
    AuthService,
    TTLWriterService,
    SparqlService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
