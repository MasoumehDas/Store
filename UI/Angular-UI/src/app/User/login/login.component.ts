import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../shared/auth.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';//تغییر استایل
import { TranslateService } from '@ngx-translate/core';
import { them } from '../../shared/service/themplate.service';
import { BasicData } from '../../shared/modules/BasicData.module';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    

})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    SelectLang: String = localStorage.getItem('language');
    isSubmitted = false;
    public Language: BasicData[];
    constructor(private router: Router, private formBuilder: FormBuilder, public authService: AuthService, public them: them, private translate: TranslateService ,private sanitizer: DomSanitizer) { }

    ngOnInit() {
        
      this.them.SetLanguage();
      document.body.style.backgroundColor = '#edf1f7';
      document.getElementById('main_css').setAttribute("disabled", "disabled");

      if (this.SelectLang == 'fa') {
        document.getElementById('boot_en').setAttribute("disabled", "disabled");
        document.getElementById('Panel_en').setAttribute("disabled", "disabled");

        document.getElementById('Panel_fa').removeAttribute("disabled");
      }
      else {
        document.getElementById('boot_fa').setAttribute("disabled", "disabled");
        document.getElementById('Panel_fa').setAttribute("disabled", "disabled");

        document.getElementById('Panel_en').removeAttribute("disabled");
      }
      this.authService.onLanguageGet(this.SelectLang.toString());
      //------------------وِیژگی های رنگ و لوگو و بکگراند داخا فانکشن

      this.authService.onGetRestaurantName(this.SelectLang.toString(), window.location.host);
        createCaptcha();
        //https://www.techiediaries.com/angular/angular-9-reactive-forms-validation-tutorial-example/
        this.loginForm = this.formBuilder.group({
            UserName: ['', Validators.required],
            Password: ['', Validators.required],
            Captcha: ['', [this.validateCaptcha && Validators.required]],
            Lang:['']
             
        });

        //document.body.classList.add('bodybg-color');
        // OR you can Add inline style css with the help of code below
       
        
    }

    get formControls() { return this.loginForm.controls; }

    validateCaptcha(formcontrol) {
        if (formcontrol.toUpperCase() == code.toUpperCase()) {
            
            return false
        }
        else
        {
            this.loginForm.controls.Captcha.setErrors({ 'Captcha': true });
            return true;
        }
    }
    onLogin() {
        
        this.isSubmitted = true;
        var dd = this.validateCaptcha(this.loginForm.controls.Captcha.value)
        if (this.loginForm.invalid) {
            return;
        }
        else
        {
            this.authService.signIn(this.loginForm.controls.UserName.value, this.loginForm.controls.Password.value, this.SelectLang.toString())
        }
       

    }
    //-------------ChangeLanguage-------------------------
    useLanguage(language: string) {
        
        this.translate.use(language);
        //this.translate.setDefaultLang(language);
        localStorage.setItem('language', language);
        this.SelectLang = language;
        window.location.reload();
        
    }
    ngOnDestroy() {
        
        document.body.style.backgroundColor = "none";
        
    }
    onCreateCaptcha() {
        createCaptcha();
    }
}
var code;
function createCaptcha() {
    //clear the contents of captcha div first 
    document.getElementById('captcha').innerHTML = "";
    var charsArray =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
        //below code will not allow Repetition of Characters
        var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
        if (captcha.indexOf(charsArray[index]) == -1)
            captcha.push(charsArray[index]);
        else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 200;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "35px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    //storing captcha so that can validate you can save it somewhere else according to your specific requirements
    code = captcha.join("");
    document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
}
//https://www.positronx.io/angular-jwt-user-authentication-tutorial/

