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

@Component({
  selector: "app-login",
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: "./login.page.html",
  styleUrl: "./login.page.scss",
  providers: [AuthService],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  hidePassword = signal(true);
  form = this.fb.group({
    username: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });
  submitted = false;

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append("username", this.form.value.username!);
      formData.append("password", this.form.value.password!);

      this.authService.login(formData).subscribe({
        next: () => {
          this.router.navigate(["/dashboard"]);
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
