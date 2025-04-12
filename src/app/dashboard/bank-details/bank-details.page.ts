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
import { Router, ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

import { BelvoService } from "../../core/services/belvo.service";
import { NotificationService } from "../../shared/services/notification.service";
import { IAccount } from "../../core/models/account.model";
import { FormatCategoryPipe } from "../../shared/format-category.pipe";

@Component({
  selector: "app-bank-details",
  imports: [
    MatCardModule,
    MatGridListModule,
    CommonModule,
    NgxSpinnerModule,
    MatDividerModule,
    FormatCategoryPipe,
    MatButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./bank-details.page.html",
  styleUrl: "./bank-details.page.scss",
})
export class BankDetailsPage implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private belvoService = inject(BelvoService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  accounts = signal<IAccount[]>([]);
  linkId = "";

  ngOnInit() {
    this.linkId = this.route.snapshot.paramMap.get("linkId") ?? "";

    this.spinner.show();

    this.loadAccounts(this.linkId);
  }

  goToBanks() {
    this.router.navigate(["/dashboard/banks"]);
  }

  goToTransacctions(id: string, linkId: string) {
    this.router.navigate([
      "/dashboard/banks/details",
      linkId,
      "balance",
      id,
    ]);
  }

  private loadAccounts(linkId: string) {
    this.belvoService.getAccounts(linkId).subscribe({
      next: (res) => {
        this.accounts.set(res.data);

        this.spinner.hide();
      },
      error: (e) => {
        const msg =
          e?.error?.message || "Error inesperado vuelva a intentarlo!";
        this.notificationService.showError(msg);

        this.spinner.hide();
      },
    });
  }
}
