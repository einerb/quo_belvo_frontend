import { Routes } from "@angular/router";

import { initGuard } from "./core/guards/init.guard";
import { guestGuard } from "./core/guards/guest.guard";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    canActivate: [initGuard],
    children: [],
  },
  {
    path: "auth",
    canActivate: [guestGuard],
    loadChildren: () => import("./auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "dashboard",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./dashboard/dashboard.routes").then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: "**",
    loadChildren: () =>
      import("./not-found/not-found.routes").then((m) => m.NOT_FOUND_ROUTES),
  },
];
