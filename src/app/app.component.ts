import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  protected authService = inject(AuthService);
}
