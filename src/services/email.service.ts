import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email } from 'src/models/email.model';
import { UxService } from './ux.service';
import { IEventParam } from 'src/models/website.model';
import { formatEmail } from './helper';
import { findEventParam } from './event-helper';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  url: string;

  constructor(private http: HttpClient, private uxService: UxService) {
    this.url = environment.API_URL;
  }

  sendGeneralTextEmail(data: Email): Observable<any> {
    return this.http.post<any>(`${this.url}/email/general-email.php`, data);
  }
  sendEmail(
    FromEmail: string,
    FromName: string,
    FromPhone: string,
    ToEmail: string,
    ToName: string,
    Subject: string,
    Message: string,
  ) {
    const emailToSend: Email = {
      FromEmail: FromEmail,
      FromName: FromName,
      FromPhone: FromPhone,
      ToEmail: ToEmail,
      ToName: ToName,
      Subject: Subject,
      Message: Message,
    };
    emailToSend.Message = formatEmail(emailToSend);
    this.sendGeneralTextEmail(emailToSend).subscribe((response) => {
      if (response > 0) {
        // this.uxService.updateUXState({
        //   Loading: false,
        //   Toast: {
        //     Title: 'Message sent!',
        //     Message:
        //       'Thank you for contacting us we will reply as soon as possible',
        //     Classes: ['_success'],
        //   },
        // });
        //Thank you for contacting us we will reply as soon as possible
      }
    });
  }


  sendStyledEmail(
    Message: string,
    FromEmail: string,
    FromName: string,
    FromPhone: string,
    Subject: string,
    ToEmail: string,
    ToName: string = 'New Vision'
  ) {
    let msg = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Template</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333;">${Subject}</h1>
       
        ${Message}
            </div>
    </body>
    </html>
    
       `;
    const emailToSend: Email = {
      FromEmail: FromEmail,
      FromName: FromName,
      FromPhone: FromPhone,
      ToEmail: ToEmail,
      ToName: ToName,
      Subject: Subject,
      Message: msg,
    };
    return this.sendGeneralTextEmail(emailToSend);
  }


  
  sendStyledEmailEvent(
  meta: IEventParam[]
  ) {
    const Message: string = findEventParam(meta,'message')
    const FromEmail: string= findEventParam(meta,'sender-email')
    const FromName: string= findEventParam(meta,'sender-name')
    const FromPhone= ''
    const Subject: string =findEventParam(meta,'email-subject')
    const ToEmail: string= findEventParam(meta,'recipient-email')
    const ToName: string = findEventParam(meta,'recipient-name')
    let msg = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Template</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333;">${Subject}</h1>
       
        ${Message}
            </div>
    </body>
    </html>
    
       `;
    const emailToSend: Email = {
      FromEmail: FromEmail,
      FromName: FromName,
      FromPhone: FromPhone,
      ToEmail: ToEmail,
      ToName: ToName,
      Subject: Subject,
      Message: msg,
    };
    return this.sendGeneralTextEmail(emailToSend);
  }
}
