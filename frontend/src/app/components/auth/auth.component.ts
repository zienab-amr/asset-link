import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

loginForm!: FormGroup;
constructor(private fb:FormBuilder){}

ngOnInit(): void {
  this.createForm()
}

createForm(){
  this.loginForm = this.fb.group({
    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
  })
}

Login():void{
  console.log(this.loginForm.value)
}
}
