import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  form!: FormGroup;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(8),
          // this.checkPasswords,
        ],
      }),
    });
  }
  onSignup() {
    if (this.form.invalid) return;

    let userData: IUser = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.createUser(userData).subscribe(
      () => {
        // this.form.reset();
        // this.router.navigate(['/']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  checkPasswords: ValidatorFn = (): ValidationErrors | null => {
    let pass = this.form.value.email;
    let confirmPass = this.form.value.password;
    if (pass !== confirmPass) return { confirmedValidator: true };

    return null;
  };
}
