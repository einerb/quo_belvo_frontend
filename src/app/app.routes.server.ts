import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
  {
    path: "dashboard/banks/details/:linkId",
    renderMode: RenderMode.Client,
  },
  {
    path: "dashboard/banks/details/:linkId/balance/:accountId",
    renderMode: RenderMode.Client,
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
