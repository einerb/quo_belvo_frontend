import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonModule, CurrencyPipe, Location } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { Chart, registerables } from "chart.js";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

import { BelvoService } from "../../core/services/belvo.service";
import { NotificationService } from "../../shared/services/notification.service";
import { DynamicCurrencyPipe } from "../../shared/currency.pipe";
import { IBalance } from "../../core/models/balance.model";
import { ITransaction } from "../../core/models/transaction.model";

@Component({
  selector: "app-account-details",
  standalone: true,
  imports: [
    MatCardModule,
    MatGridListModule,
    CommonModule,
    NgxSpinnerModule,
    MatDividerModule,
    MatButtonModule,
    DynamicCurrencyPipe,
    MatTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./account-details.page.html",
  styleUrl: "./account-details.page.scss",
})
export class AccountDetailsPage implements OnInit, AfterViewInit {
  private spinner = inject(NgxSpinnerService);
  private belvoService = inject(BelvoService);
  private notificationService = inject(NotificationService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  donutChartLabels = ["Ingresos", "Egresos"];
  donutChartData = [0, 0];
  donutChart: Chart | undefined;
  balance = 0;
  isNegative = false;
  income = 0;
  expenses = 0;
  currency = "BRL";
  transactions: ITransaction[] = [];
  linkId = "";
  accountId = "";
  displayedColumns: string[] = [
    "reference",
    "category",
    "type",
    "description",
    "amount",
    "balance",
    "status"
  ];
  dataSource = new MatTableDataSource<ITransaction>([]);

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.linkId = this.route.snapshot.paramMap.get("linkId") ?? "";
    this.accountId = this.route.snapshot.paramMap.get("accountId") ?? "";

    this.spinner.show();

    const today = new Date().toISOString().split("T")[0];
    this.loadBalanceTransaction(this.accountId, this.linkId, today, today);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createDonutChart();
    }, 100);
  }

  goToBankDetails() {
    this.location.back();
  }

  createDonutChart(): void {
    const canvas = document.getElementById("donutChart") as HTMLCanvasElement;
    if (canvas) {
      if (this.donutChart) {
        this.donutChart.destroy();
      }

      this.donutChart = new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: this.donutChartLabels,
          datasets: [
            {
              data: this.donutChartData,
              backgroundColor: ["#4caf50", "#f44336"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    } else {
      console.error("Canvas element 'donutChart' not found");
    }
  }

  updateChartWithData(data: IBalance): void {
    this.income = data.income || 0;
    this.expenses = data.expenses || 0;
    this.balance = data.balance || 0;
    this.currency = data.currency;

    this.donutChartData = [this.income, this.expenses];

    if (this.donutChart) {
      this.donutChart.data.datasets[0].data = this.donutChartData;
      this.donutChart.update();
    } else {
      this.createDonutChart();
    }
  }

  formatCurrency(value: number): string {
    const currencyPipe = new CurrencyPipe("en-US");
    return currencyPipe.transform(value, this.currency) || "";
  }

  private loadBalanceTransaction(
    id: string,
    linkId: string,
    dateFrom: string,
    dateTo: string
  ) {
    this.belvoService
      .getBalanceTransactions(id, linkId, dateFrom, dateTo)
      .subscribe({
        next: (res) => {
          this.transactions = res.transactions || [];
          this.dataSource.data = this.transactions; 

          this.updateChartWithData(res);

          this.spinner.hide();
        },
        error: (e) => {
          console.error("API error:", e);
          const msg =
            e?.error?.message || "Error inesperado vuelva a intentarlo!";
          this.notificationService.showError(msg);

          this.spinner.hide();
        },
      });
  }
}
