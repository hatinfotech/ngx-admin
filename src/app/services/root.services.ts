import { Injectable } from "@angular/core";
import { AdminProductService } from "../modules/admin-product/admin-product.service";

@Injectable({
  providedIn: 'root',
})
export class RootServices {


  constructor(
    public adminProductService: AdminProductService
  ) {
  }
}
