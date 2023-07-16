import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WI } from '../Constants';
import { WebsiteModel } from 'src/models/website.model';
import { StateService } from 'src/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  website?: WebsiteModel;
  id: any;
  websiteId =WI;
  pageId: any;
  itemId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private stateService: StateService
  ) {
    this.activatedRoute.params.subscribe((r) => {
      this.pageId = r['pageId'];
      this.itemId = r['itemId'];
      if (r['websiteId']) this.websiteId = r['websiteId'];

      this.stateService.getWebsite(this.websiteId, this.pageId,this.itemId);

    });
  }

  ngOnInit(): void {
    this.stateService.stateObservable?.subscribe((data) => {
      if (data && data.Page) {
        this.website = data;
      }
    });
  }

}
