import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RenderService {
  private renderBS = new BehaviorSubject<any>({});
  public $render = this.renderBS.asObservable();
  constructor() {}
  refresh(data: any = {}) {
    this.renderBS.next(data);
  }
}
