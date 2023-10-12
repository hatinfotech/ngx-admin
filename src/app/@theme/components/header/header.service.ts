import { IdTextModel } from './../../../models/common.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  activeFeature$ = new BehaviorSubject<{
    Module?: { id?: string, text?: string },
    Feature: { id?: string, text?: string },
  }>(null);

  constructor(
  ) {
  }
}
