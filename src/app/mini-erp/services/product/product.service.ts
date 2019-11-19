import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { ProductModel } from '../../models/product/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements ApiResource<ProductModel> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: ProductModel[]) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.get<ProductModel[]>('/admin-product/products', params, success, error);
  }
  getById(id: string, success: (resources: ProductModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.get<ProductModel>('/admin-product/products', { 'id': id}, success, error);
  }
  post(resource: ProductModel, success: (newResource: ProductModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.post<ProductModel>('/admin-product/products', resource, success, error);
  }
  put(resource: ProductModel, success: (newResource: ProductModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.put<ProductModel>('/admin-product/products', resource.Code, resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.delete('/admin-product/products', id, success, error);
  }

}
