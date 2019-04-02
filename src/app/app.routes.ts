import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard.service';
import { LoginComponent } from './login/login.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { CardComponent} from './card/card.component';
import { FriendsComponent } from './friends/friends.component';

const APP_ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login-popup', component: LoginPopupComponent },
  { path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard] },
  { path: 'card', component: CardComponent,
    canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'friends', component: FriendsComponent },


];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
