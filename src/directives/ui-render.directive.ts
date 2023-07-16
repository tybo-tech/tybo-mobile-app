import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ParamMapper } from 'src/classes/ParamMapper';
import { initCMSSearchModel } from 'src/models/cms.model';

import { Email } from 'src/models/email.model';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { IMoving } from 'src/models/ux.model';
import {
  WebsiteModel,
  ElementModel,
  EventModel,
} from 'src/models/website.model';
import { CmsService } from 'src/services/cms.service';
import { loadSession, COMPANY_EMIAL } from 'src/services/constants';
import { EmailService } from 'src/services/email.service';
import { EVENT_OUTCOMES, EVENT_TYPES, EVENT_VALUE_SOURCE } from 'src/services/event-helper';
import { ELEMENT_TYPES, isText, renderIcons, isFormInput, getInputType, getElementById, getFormElements, formatEmail, getElementDOMType } from 'src/services/helper';
import { StateService } from 'src/services/state.service';
import { TyboWebsiteService } from 'src/services/tybo.website.service';
import { UserService } from 'src/services/user.service';
import { UxService } from 'src/services/ux.service';

@Directive({
  selector: '[appUiRender]',
})
export class UiRenderDirective implements OnInit {
  @Input() pagePrefix?: string = 'home';
  moving?: IMoving;
  website?: WebsiteModel;
  user?: User;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uxService: UxService,
    private stateService: StateService,
    private tyboWebsiteService: TyboWebsiteService,
    private cmsService: CmsService,
    private router: Router,
    private userService: UserService,
    private emailService: EmailService
  ) {}
  ngOnInit() {
    this.stateService.stateObservable?.subscribe((data) => {
      this.website = data;
      if (this.website) {
        this.loadBodyUI();
      }
    });
    // this.renderer.addClass('', '');
    this.uxService.uxObservable.subscribe((data) => {
      this.moving = data?.Moving;
    });

    this.userService.userObservable?.subscribe((user) => {
      if (user && user.UserId) {
        this.user = user;
      }
    });
  }

  loadBodyUI = () => {
    if (
      this.website &&
      this.website.Page &&
      this.website.Page.Body.Children.length
    ) {
      this.renderBody(this.website.Page.Body);
    }
  };

  renderSectionBetta(el: ElementModel, parentId: string) {
    if (el.Type === ELEMENT_TYPES.section) {
      const section = document.createElement('section');
      this.addEvent(section, el);
      if (el.SelectorName.length) section.className = el.SelectorName[0];
      section.id = el.ElementId || '';
      const body = document.getElementById(parentId);
      if (body && this.renderer && section)
        this.renderer.appendChild(body, section);

      if (el.Children.length) {
        el.Children.forEach((child) => this.renderElementBetta(child, section));
      }
    }
  }

  renderBody(el: ElementModel) {
    // console.log({ betta: el });
    if (el.Type === ELEMENT_TYPES.body) {
      this.elementRef.nativeElement.childNodes.forEach((node: any) => {
        this.renderer.removeChild(this.elementRef.nativeElement, node);
      });
      setTimeout(() => {
        const body = this.renderer.createElement('main');
        if (el.SelectorName.length) body.className = el.SelectorName[0];
        body.id = el.ElementId || '';
        this.renderer.appendChild(this.elementRef.nativeElement, body);
        if (el.Children.length) {
          el.Children.forEach((child) => {
            this.renderSectionBetta(child, body.id);
          });
        }
      }, 1);
    }
  }

  renderElementBetta(el: ElementModel, parent: Element) {
    if (
      el.Type === ELEMENT_TYPES.container ||
      el.Type === ELEMENT_TYPES.centerContainer ||
      el.Type === ELEMENT_TYPES.Component ||
      el.Type === ELEMENT_TYPES.form ||
      el.Type === ELEMENT_TYPES.dataList ||
      el.Type === ELEMENT_TYPES.dataItem ||
      el.Type === ELEMENT_TYPES.grid
    ) {
      const container = document.createElement('div');
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => container.classList.add(x));
      }
      container.id = el.ElementId || '';
      if (parent) this.renderer.appendChild(parent, container);

      if (el.Children.length) {
        el.Children.forEach((child) =>
          this.renderElementBetta(child, container)
        );
      }
    }

    if (isText(el.Type)) {
      const element = document.createElement(el.Type);
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => element.classList.add(x));
      }
      element.id = el.ElementId || '';
      element.innerHTML = el.Data;
      // if (el.Metadata?.Data?.length) {
      //   let d = '';
      //   el.Metadata.Data.forEach((data) => {
      //     d += `${data.Value} `;
      //   });
      //   element.innerHTML = d;
      // }
      // if (el.Metadata?.Format === 'currency') {
      //   const formater = new Intl.NumberFormat('en-US');
      //   element.innerHTML = 'R' + formater.format(el.Data);
      // }
      renderIcons(el, element);

      this.addEvent(element, el);
      if (parent) this.renderer.appendChild(parent, element);
    }
    if (isFormInput(el.Type)) {
      const t = getElementDOMType(el.Type);
      const element = document.createElement(t);
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => element.classList.add(x));
      }
      element.id = el.ElementId || '';
      if (el.Type !== ELEMENT_TYPES.inputTextarea)
        element.type = getInputType(el.Type);
      element.value = el.Data;

      this.addEvent(element, el);
      if (parent) this.renderer.appendChild(parent, element);
    }
    if (el.Type === ELEMENT_TYPES.button) {
      const element = document.createElement(el.Type);
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => element.classList.add(x));
      }
      element.id = el.ElementId || '';
      element.innerHTML = el.Data;
      this.addEvent(element, el);
      if (parent) this.renderer.appendChild(parent, element);
    }
    if (el.Type === ELEMENT_TYPES.img) {
      const element = document.createElement('img');
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => element.classList.add(x));
      }
      element.id = el.ElementId || '';
      element.src = el.Data;

      if (parent) this.renderer.appendChild(parent, element);
    }

    if (el.Type === ELEMENT_TYPES.icon) {
      const element = document.createElement('i');
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => element.classList.add(x));
        // element.className = el.SelectorName[0];
        this.addEvent(element, el);
      }
      element.id = el.ElementId || '';
      element.innerHTML = el.Data;
      if (parent) parent.appendChild(element);
    }

    if (el.Type === ELEMENT_TYPES.video) {
      const element: HTMLVideoElement = this.renderer.createElement('video');
      element.controls = false;
      element.muted = true;
      element.loop = true;
      element.autoplay = true;
      if (el.SelectorName.length) {
        el.SelectorName.forEach((x) => element.classList.add(x));
      }
      element.id = el.ElementId || '';
      element.src = el.Data;
      this.addEvent(element, el);
      if (parent) parent.appendChild(element);
    }
  }
  addEvent(htmlElement: HTMLElement, element: ElementModel) {
    htmlElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.buttonClick(element, 0, htmlElement);
    });
    // htmlElement.setAttribute(
    //   'href',
    //   `/${this.pagePrefix}/${this.website?.WebsiteId}/`
    // );
    if (element.Type === ELEMENT_TYPES.a && element.Events?.length) {
      const e = element.Events.find(
        (x) => x.Type === EVENT_TYPES.NavigateToPage.Id
      );
      if (e) {
        const page = this.website?.Pages.find((x) => x.PageId === e.TargetId);
        if (page) {
          // htmlElement.setAttribute(
          //   'href',
          //   `/${this.pagePrefix}/${this.website?.WebsiteId}${page.Url}`
          // );
        }
      }
    }
  }

  // Events

  buttonClick(element: ElementModel, index: number, htmlElement?: HTMLElement) {
    const event = element?.Events[index];
    if (!event) return;
 
    if (event.Type === EVENT_TYPES.GetCollectionItem.Id) {
      this.getCmsItem(event, element);
      return;
    }
    if (event.Type === EVENT_TYPES.CreateCollectionItem.Id) {
      this.addCmsItem(event, element);
      return;
    }
    if (event.Type === EVENT_TYPES.UpdateCollectionItem.Id) {
      this.updateCmsItem(event, element);
      return;
    }
    if (event.Type === EVENT_TYPES.DeleteCollectionItem.Id) {
      this.deleteCmsItem(event, element);
      return;
    }

    if (event.Type === EVENT_TYPES.SendEmail.Id) {
      this.sendEmailEvent(element, event, index);
      return;
    }
    if (event.Type === EVENT_TYPES.Togle.Id) {
      this.toggle(element, index);
      return;
    }
    if (event.DbLink) {
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = event.DbLink;
      a.click();
      return;
    }

    if (
      event.Type === EVENT_TYPES.Show.Id ||
      event.Type === EVENT_TYPES.Hide.Id
    ) {
      this.showElemet(element, index, event);
      return;
    }
    if (event.Type === EVENT_TYPES.NavigateToPage.Id) {
      this.navigateToPage(event, element);
      return;
    }
    if (event.Type === EVENT_TYPES.OpenLink.Id) {
      this.openLink(event, index, element);
      return;
    }

    const data = this.getFormValues(element);
    if (!data) return;
    if (data.Email && data.Password) {
      this.login(data);
    }
    if (data.WhatsAppNumber) {
      this.subcribeWhatsAppNumber(data['WhatsAppNumber']);
    }
    if (data.Email && data.Phone && data.Name && data.Message) {
      this.sendEmail(data);
    }
  }

  nextEvent(element: ElementModel, event: EventModel) {
    if (!event) return;

    if (event.Type === EVENT_TYPES.GetCollectionItem.Id) {
      this.getCmsItem(event, element);
      return;
    }
    if (event.Type === EVENT_TYPES.CreateCollectionItem.Id) {
      this.addCmsItem(event, element);
      return;
    }
    if (event.Type === EVENT_TYPES.NavigateToPage.Id) {
      this.navigateToPage(event, element);
      return;
    }
  }
  navigateToPage(event: EventModel, element: ElementModel) {
    console.log(event);
    if (event.TargetId && this.website) {
      const page = this.website.Pages.find((x) => x.PageId === event.TargetId);
      if (page) {
        if (!element.TempData) element.TempData = '';
        if (this.pagePrefix === 'preview')
          this.router.navigate([
            `/${this.pagePrefix}/${this.website?.WebsiteId}/${event.TargetId}/${element.TempData}`,
          ]);
        if (this.pagePrefix === 'template')
          this.router.navigate([
            `/${this.pagePrefix}/${this.website?.WebsiteId}/${event.TargetId}`,
          ]);

        if (this.pagePrefix === 'home')
          this.router.navigate([`/${this.pagePrefix}${page.Url}`]);
      }
    }
  }
  openLink(event: EventModel, index: number, element: ElementModel) {
    if (event.Params?.length) {
      const params = event.Params[0];
      location.href = params.Value;
      window.open(params.Value, '_blank', 'noopener');
    }
    this.buttonClick(element, Number(index) + 1);
  }
  showElemet(element: ElementModel, index: number, event: EventModel) {
    if (!this.website) return;
    if (element && element.Events?.length && this.website) {
      const htmlElement = document.getElementById(event.TargetId);
      if (event.Type === EVENT_TYPES.Hide.Id && htmlElement) {
        htmlElement.style.display = 'none';
        return;
      }
      if (event.Type === EVENT_TYPES.Show.Id && htmlElement) {
        htmlElement.style.display = 'flex';
        return;
      }
      this.buttonClick(element, Number(index) + 1);
    }
  }

  toggle(element: ElementModel, index: number) {
    if (!this.website) return;
    if (element && element.Events?.length && this.website) {
      let target = getElementById(
        element.Events[index].TargetId,
        this.website.Sections
      );
      if (!target && this.website.Page)
        target = getElementById(
          element.Events[index].TargetId,
          this.website.Page.Body.Children
        );
      if (target && target.PcStyles && target.PcStyles['display'] === 'flex')
        target.PcStyles['display'] = 'none';

      if (target && target.PcStyles && target.PcStyles['display'] === 'none')
        target.PcStyles['display'] = 'flex';

      if (target && target.TabStyles && target.TabStyles['display'] === 'flex')
        target.TabStyles['display'] = 'none';

      if (target && target.TabStyles && target.TabStyles['display'] === 'none')
        target.TabStyles['display'] = 'flex';

      if (
        target &&
        target.PhoneStyles &&
        target.PhoneStyles['display'] === 'flex'
      )
        target.PhoneStyles['display'] = 'none';

      if (
        target &&
        target.PhoneStyles &&
        target.PhoneStyles['display'] === 'none'
      )
        target.PhoneStyles['display'] = 'flex';

      this.stateService.updateWebsiteState(this.website);
      this.buttonClick(element, Number(index) + 1);
    }
  }
  sendEmailEvent(element: ElementModel, event: EventModel, index: number) {
    if (!this.website || !event) return;
    if (element && element.Events?.length && this.website) {
      // alert(event.Params?[0]?.Value)
      if (event.Params) {
        event.Params.forEach((param) => {
          if (
            param.GetValueFrom === EVENT_VALUE_SOURCE.FormInput &&
            this.website?.Page?.Body.Children
          ) {
            // const element = getElementById(param.Value,this.website?.Page?.Sections)
            const element: any = document.getElementById(param.Value);
            if (element) {
              param.Value = element.value || '';
            }
          }
        });
        console.log(event);
        this.emailService
          .sendStyledEmailEvent(event.Params)
          .subscribe((data) => {
            this.buttonClick(element, Number(index) + 1);
          });
      }
    }
  }
  addCmsItem(event: EventModel, element: ElementModel) {
    if (!this.website || !element.Events.length) return;
    if (event.Params?.length) {
      const table = this.website.CMSCollections?.find(
        (x) => x.Id === event.TableId
      );
      if (!table) return;
      const records = this.cmsService.initData(table);
      records?.forEach((recordItem) => {
        const check = event.Params?.find(
          (x) => x.Name === recordItem.ColumnName
        );
        recordItem.Value = check?.Value || '';
        if (check && check.GetValueFrom === EVENT_VALUE_SOURCE.Manually) {
          recordItem.Value = check.Value || '';
        }
        if (
          check &&
          (check.GetValueFrom === EVENT_VALUE_SOURCE.FormInput ||
            check.GetValueFrom === EVENT_VALUE_SOURCE.PageElement)
        ) {
          const element = getElementById(
            check.Value,
            this.website?.Page?.Body.Children || []
          );
          recordItem.Value = element?.Data || '';
        }
      });
      records?.map((x) => (x.CurrentUserId = loadSession().CurrentUserId));
      if (records?.length)
        this.cmsService.saveRange(records).subscribe((data) => {
          if (data) {
            const found = event.OutComes?.find(
              (x) => x.Id === EVENT_OUTCOMES.created
            );
            if (found && found.Event && table) {
              const dataParams =
                found.Event.Params?.filter(
                  (x) => x.GetValueFrom === `From ${table.Name}`
                ) || [];
              const output: any = data;
              dataParams.map((x) => (x.Value = output[x.Value] || ''));
              this.nextEvent(element, found.Event);
            }
          }
        });
    }
  }
  deleteCmsItem(event: EventModel, element: ElementModel) {
    if (
      !this.website ||
      !element.Events.length ||
      !element.DataItem ||
      !element.DataItem.RecordId
    )
      return;
    console.log(element);
    this.cmsService.delete(element.DataItem.RecordId).subscribe((data) => {});

    // console.log( event);
  }
  updateCmsItem(event: EventModel, element: ElementModel) {
    if (!this.website || !element.Events.length) return;
    const filedsToUpdate =
      event.Params?.filter((x) => x.SelectedForUpdate === 'yes') || [];
    if (!filedsToUpdate.length) return;
    const table = this.website.CMSCollections?.find(
      (x) => x.Id === event.TableId
    );
    if (!table) return;
    const paramMapper = new ParamMapper(
      filedsToUpdate,
      table,
      this.website,
      event
    );
    if (paramMapper.Records.length)
      this.cmsService.saveRange(paramMapper.Records).subscribe((data) => {
        if (data) {
          const found = event.OutComes?.find(
            (x) => x.Id === EVENT_OUTCOMES.created
          );
          if (found && found.Event && table) {
            const dataParams =
              found.Event.Params?.filter(
                (x) => x.GetValueFrom === `From ${table.Name}`
              ) || [];
            const output: any = data;
            dataParams.map((x) => (x.Value = output[x.Value] || ''));
            this.nextEvent(element, found.Event);
          }
        }
      });
  }
  getCmsItem(event: EventModel, element: ElementModel) {
    if (!this.website || !element.Events.length) return;
    const table = this.website.CMSCollections?.find(
      (x) => x.Id === event.TableId
    );
    if (!table) return;
    const se = event.Filters?.find((x) => x.Value === 'Current session');
    if (se) se.Value = loadSession().CurrentUserId;
    const searchModel = initCMSSearchModel(table.Id, table.WebsiteId, []);
    searchModel.Filters = event.Filters || [];
    this.cmsService.searchOne(table).subscribe((data) => {
      if (data && data.RecordId) {
        // Found
        const found = event.OutComes?.find(
          (x) => x.Id === EVENT_OUTCOMES.found
        );
        if (found && found.Event && table) {
          const dataParams =
            found.Event.Params?.filter(
              (x) => x.GetValueFrom === `From ${table.Name}`
            ) || [];
          const output: any = data;
          dataParams.map((x) => (x.Value = output[x.Value] || ''));
          this.nextEvent(element, found.Event);
        }
      } else {
        const notFound = event.OutComes?.find(
          (x) => x.Id === EVENT_OUTCOMES.notFound
        );
        if (notFound && notFound.Event) {
          this.nextEvent(element, notFound.Event);
        }
      }
      //  this.buttonClick(element, Number(index) + 1);
    });
  }



  login(value: any) {
    this.userService.login(value).subscribe((user) => {
      if (user && user.UserId) {
        this.userService.updateUserState(user);
        if (user && user.Role === 'Admin') {
          this.router.navigate(['admin']);
        }
      }
    });
  }

  getFormValues(element: ElementModel) {
    if (
      element &&
      element.FormId &&
      this.website &&
      this.website.Page?.Body.Children
    ) {
      const formElemnts = getFormElements(
        element?.FormId,
        this.website.Page.Body.Children
      );
      if (formElemnts && formElemnts.length) {
        const data: any = {};
        formElemnts.forEach((e) => {
          data[e.Name] = e.Data;
        });
        return data;
      }
    }
  }
  sendEmail(data: any) {
    const emailToSend: Email = {
      FromEmail: data.Email,
      FromName: data.Name,
      FromPhone: data.Phone,
      ToEmail: COMPANY_EMIAL,
      ToName: 'Admin',
      Subject: data.Name + ' Enquiry',
      Message: data.Message,
    };
    emailToSend.Message = formatEmail(
      emailToSend,
      'https://sizakhelelogistics.co.za/assets/sizakhelelogistics/logo.jpg'
    );
    this.uxService.updateUXState({ Loading: true });
    this.emailService
      .sendGeneralTextEmail(emailToSend)
      .subscribe((response) => {
        if (response > 0) {
          this.uxService.updateUXState({
            Loading: false,
            Toast: {
              Title: 'Message sent!',
              Message:
                'Thank you for contacting us we will reply as soon as possible',
              Classes: ['_success'],
            },
          });
          this.router.navigate(['/']);
          //Thank you for contacting us we will reply as soon as possible
        }
      });
  }

  subcribeWhatsAppNumber(number_: string) {
    const emailToSend: Email = {
      FromEmail: 'system@mattressandco.co.za',
      FromName: '',
      FromPhone: '',
      ToEmail: COMPANY_EMIAL,
      ToName: 'Admin',
      Subject: 'New whatsapp number subscriber',
      Message: number_,
    };
    emailToSend.Message = formatEmail(emailToSend);
    this.uxService.updateUXState({ Loading: true });
    this.emailService
      .sendGeneralTextEmail(emailToSend)
      .subscribe((response) => {
        if (response > 0) {
          this.uxService.updateUXState({
            Loading: false,
            Toast: {
              Title: 'You are subscribed!',
              Message: `Thank you for subscribing, you won't miss out anymore`,
              Classes: ['_success'],
            },
          });
          this.router.navigate(['/']);
          //Thank you for contacting us we will reply as soon as possible
        }
      });
  }
}
