import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonModule } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { Router } from "@angular/router";

import { BelvoService } from "../../core/services/belvo.service";
import { IBank } from "../../core/models/bank.model";
import { NotificationService } from "../../shared/services/notification.service";
import { ILinkBankData } from "../../core/models/link.model";

@Component({
  selector: "app-bank-list",
  imports: [
    MatCardModule,
    MatGridListModule,
    CommonModule,
    NgxSpinnerModule,
    MatDividerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./bank-list.page.html",
  styleUrl: "./bank-list.page.scss",
})
export class BankListPage implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private belvoService = inject(BelvoService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  banks = signal<IBank[]>([]);

  ngOnInit() {
    this.spinner.show();

    this.loadBanks();
  }

  goToDetail(name: string) {
    this.spinner.show();

    this.belvoService.getLinkBank(name).subscribe({
      next: (res) => {
        const linkId = res.data.link_id;
        if (linkId !== null) {
          this.router.navigate(["/dashboard/banks/details/", linkId]);
        } else {
          const data: ILinkBankData = {
            institution: name,
            credentials: {
              username: "user123",
              password: "123",
              token: "123456",
            },
          };
          this.belvoService.createLinkBank(data).subscribe({
            next: (res) => {
              this.spinner.hide();

              this.router.navigate(["/dashboard/banks/details/", res.id]);
            },
            error: (e) => {
              if (e.error.message === "Unexpected error") {
                this.notificationService.showError(
                  "Institución bancaria NO DISPONIBLE"
                );
              } else {
                const msg =
                  e?.error?.message || "Error inesperado vuelva a intentarlo!";
                this.notificationService.showError(msg);
              }

              this.spinner.hide();
            },
          });
        }
      },
      error: (e) => {
        const msg =
          e?.error?.message || "Error inesperado vuelva a intentarlo!";
        this.notificationService.showError(msg);

        this.spinner.hide();
      },
    });
  }

  private loadBanks() {
    this.belvoService.getBanks().subscribe({
      next: (res) => {
        this.banks.set(res.institutions);

        this.spinner.hide();
      },
      error: (e) => {
        const msg = e?.error?.message || "Error inesperado";
        this.notificationService.showError(msg);

        this.spinner.hide();
      },
    });
  }
}
