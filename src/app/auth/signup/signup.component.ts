import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {
    // console.log(form)
    if(form.invalid) {
      return
    }

    this.authService.createUser(form.value.email, form.value.password)
  }
}
