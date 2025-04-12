import { Component, inject, OnInit } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-header",
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private authService = inject(AuthService);

  protected user = this.authService.user;

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(["/dashboard"]);
  }

  logout() {
    localStorage.removeItem("access_token");

    this.router.navigate(["/auth/login"]);
  }
}
