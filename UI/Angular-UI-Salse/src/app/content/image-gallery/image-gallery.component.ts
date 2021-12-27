import { Component, Input, OnInit } from '@angular/core';
import { ProductImage } from '../../shared/modules/images.module';
import { NgbModule, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-image-gallery',
    templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
  
  providers: [NgbCarouselConfig]
})
export class ImageGalleryComponent implements OnInit {
    
  @Input() src:string;
  @Input() alt:string;
  constructor() {
    
  }
  modal:any;
  img:any;
  modalImg:any;
  captionText:any;
  span:any;
  ngOnInit() {
     this.modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
this.img = document.getElementById("myImg");
this.modalImg = document.getElementById("img01");
this.captionText = document.getElementById("caption");


// Get the <span> element that closes the modal
this.span = document.getElementsByClassName("close")[0];
  }

        
// Get the modal


// When the user clicks on <span> (x), close the modal
ondblclick() {
  this.modal.style.display = "none";
}
onclick(src,alt){
  this.modal.style.display = "block";
  this.modalImg.src = src;
  this.captionText.innerHTML = alt;
}

        
        
    
   
}
