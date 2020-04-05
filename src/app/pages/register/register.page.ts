import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: String = "";
  password: String = "";

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.username, this.password);
  }
}
