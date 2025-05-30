import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string, duration = 5000): void {
    this.snackBar.open(message, "Cerrar", {
      duration,
      panelClass: ["snackbar-error"],
    });
  }

  showSuccess(message: string, duration = 5000): void {
    this.snackBar.open(message, "OK", {
      duration,
      panelClass: ["snackbar-success"],
    });
  }
}
