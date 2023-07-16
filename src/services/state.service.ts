import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


import { environment } from 'src/environments/environment';
import {
  ElementModel,
  PageModel,
  WebsiteModel,
} from 'src/models/website.model';
import { TyboWebsiteService } from './tybo.website.service';
import { UxService } from './ux.service';
import { StyleService } from './style.service';
import { RenderService } from './render.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  url: string;
  private stateBehaviorSubject?: BehaviorSubject<WebsiteModel>;
  public stateObservable?: Observable<WebsiteModel>;

  // private stylesBehaviorSubject?: BehaviorSubject<any>;
  // public stylesObservable?: Observable<any>;

  constructor(
    private tyboWebsiteService: TyboWebsiteService,
    private uxService: UxService,
    private renderService: RenderService,
    private styleService: StyleService
  ) {
    this.url = environment.API_URL;

    let _website = localStorage.getItem('_website');
    let web = undefined;
    if (_website && _website !== 'undefined') {
      web = JSON.parse(_website);
    }
    this.stateBehaviorSubject = new BehaviorSubject<WebsiteModel>(web);
    this.stateObservable = this.stateBehaviorSubject.asObservable();

    // this.stylesBehaviorSubject = new BehaviorSubject<any>(web);
    // this.stylesObservable = this.stylesBehaviorSubject.asObservable();
  }
  updateWebsiteState(state: WebsiteModel) {
    if (this.stateBehaviorSubject) this.stateBehaviorSubject.next(state);
    this.styleService.creatClass(state);
  }

  // refreshStyles(data: any = {}) {
  //   if (this.stylesBehaviorSubject) this.stylesBehaviorSubject.next(data);
  // }


  public get getWebsiteState() {
    return this.stateBehaviorSubject?.value;
  }

  getWebsite(websiteId: string, pageId: string, itemId?: string) {
    this.uxService.updateUXState({ Loading: true });
    this.tyboWebsiteService.get(websiteId, pageId).subscribe((data) => {
      this.uxService.updateUXState({ Loading: false });
      if (data && data.WebsiteId && data.Page) {
        this.updateWebsiteState(data);
        this.renderService.refresh({ data: true });
      }
    });
  }

}
