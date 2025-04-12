import { Component, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";
import { NotificationService } from "../../shared/services/notification.service";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: "app-register",
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: "./register.page.html",
  styleUrl: "./register.page.scss",
  providers: [AuthService],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  hidePassword = signal(true);
  form = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });
  submitted = false;

  onRegister() {
    if (this.form.valid) {
      const { username, email, password } =
        this.form.getRawValue() as RegisterForm;

      this.authService.register(username, email, password).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            "Usuario creado exitosamente. Será redirigido para que inicie sesión!"
          );

          setTimeout(() => {
            this.router.navigate(["/auth/login"]);
          }, 5500);
        },
        error: (e) => {
          const msg = e?.error?.message || "Error inesperado";
          this.notificationService.showError(msg);
        },
      });

      this.submitted = false;
    } else {
      this.form.markAllAsTouched();
    }
  }
}
