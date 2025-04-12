import { Routes } from "@angular/router";

import { BankListPage } from "./bank-list/bank-list.page";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "banks",
    pathMatch: "full",
  },
  { path: "banks", component: BankListPage },
  {
    path: "banks/details/:linkId",
    loadComponent: () =>
      import("./bank-details/bank-details.page").then((m) => m.BankDetailsPage),
    data: { renderMode: "disabled" },
  },
  {
    path: "banks/details/:linkId/balance/:accountId",
    loadComponent: () =>
      import("./account-details/account-details.page").then(
        (m) => m.AccountDetailsPage
      ),
    data: { renderMode: "disabled" },
  },
];
