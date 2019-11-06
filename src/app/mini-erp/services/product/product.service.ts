import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { Contact } from '../../models/crm/contact';
import { Product } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements ApiResource<Product> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: Product[]) => void, error: (e) => void) {
    this.apiService.get<Product[]>('/admin-product/products', params, success, error);
  }
  getById(id: string, success: (resources: Product) => void, error: (e) => void) {
    this.apiService.get<Product>('/admin-product/products', { 'id': id}, success, error);
  }
  post(resource: Product, success: (newResource: Product) => void, error: (e) => void) {
    this.apiService.post<Product>('/admin-product/products', resource, success, error);
  }
  put(resource: Product, success: (newResource: Product) => void, error: (e) => void) {
    this.apiService.put<Product>('/admin-product/products', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e) => void) {
    this.apiService.delete('/admin-product/products', id, success, error);
  }

}
