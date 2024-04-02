import { Routes } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { MktPromotionProgramListComponent } from "./promotion-program/promotion-program-list/promotion-program-list.component";
import { MktMemberCardListComponent } from "./member-card/member-card-list/member-card-list.component";

export const marketingRoutes: Routes = [

  // Member card
  {
    path: 'marketing/member-card/list',
    canActivate: [AuthGuardService],
    component: MktMemberCardListComponent,
    data: {
      reuse: true,
    },
  },
  // Promotion program
  {
    path: 'marketing/promotion-program/list',
    canActivate: [AuthGuardService],
    component: MktPromotionProgramListComponent,
    data: {
      reuse: true,
    },
  },
];