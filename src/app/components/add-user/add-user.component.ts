import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  fg: FormGroup;

    constructor() {
      }

    ngOnInit() {
      this.fg = new FormGroup({
        userName: new FormControl(),
        password: new FormControl(),
        password2: new FormControl(),
     });
      }
}

