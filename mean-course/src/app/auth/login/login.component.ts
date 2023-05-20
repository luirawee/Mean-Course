import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }
  onLogin() {
    if (this.form.invalid) return;

    let userData: IUser = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.login(userData).subscribe(
      (res) => {
        this.authService.setToken(res.token);
        this.authService.setDataTimeOut(res.expiresIn);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + res.expiresIn * 1000);
        this.authService.saveAuthData(res.token, expirationDate);
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
