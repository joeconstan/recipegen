import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  name;
  email = '';
  issue;
  formSubmitted = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  sendEmail() {
    // send me an email detailing the issue/question
    // this.name,this.issue
    // throttle this api so someone cant just spam me...
    // const email = contactForm.value;
    if (this.name && this.issue) {
      // console.log('sending message: ', this.issue, ' from user: ', this.name)
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http
        .post(
          'https://formspree.io/f/xoqrdzwn',
          {
            name: this.name,
            email: this.email,
            replyto: this.email,
            message: this.issue,
          },
          { headers: headers }
        )
        .subscribe((response) => {
          // console.log(response);
          this.formSubmitted = true;
        });
    }
  }
}
