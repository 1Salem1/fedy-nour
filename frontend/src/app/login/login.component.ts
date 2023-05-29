import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string ="";

  constructor(public auth : AuthenticationService , private router: Router,) { }

  ngOnInit(): void {
    this.email = '';
    this.password = '';
  }

  login(): void {
    // Create a request body with the email and password
    const body = {
      email: this.email,
      password: this.password
    };

    console.log(body)
  
    this.auth.login(this.email , this.password).subscribe(
      (response) => {
        // Handle the successful login response
        console.log(response); // You can log the response or perform any other actions
  
        // Redirect to the dashboard or perform any other navigation
        // Example:
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Handle the login error
        console.log(error); // You can log the error or perform any other error handling
      }
    );
  }
}
