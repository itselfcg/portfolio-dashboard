import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
})
export class CaseStudyComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  submitted = false;
  imagePreview: string;
  mode = 'create';
  images: string[] = [];
  insigths:string[]=[];

  constructor() {}
  ngOnInit(): void {
    this.form = new FormGroup({
      language: new FormControl('English', {
        validators: [Validators.required],
      }),
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required]),
    });
  }

  onFileChange(event: Event) {
    var filesAmount = (event.target as HTMLInputElement).files.length;
    for (let i = 0; i < filesAmount; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        console.log(i);
        this.images.push(event.target.result);
        this.form.patchValue({
          fileSource: this.images,
        });
      };
      reader.readAsDataURL((event.target as HTMLInputElement).files[i]);
    }
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      /*  this.projectService.create(
        this.form.value.language,
        this.form.value.name,
        this.form.value.title,
        this.form.value.content,
        this.form.value.git_url,
        this.form.value.preview_url,
        this.form.value.labels,
        this.form.value.picture,
        this.form.value.picture_alt
      ); */
    } else {
      /*  this.projectService.update(
        this.projectId,
        this.form.value.language,
        this.form.value.name,
        this.form.value.title,
        this.form.value.content,
        this.form.value.git_url,
        this.form.value.preview_url,
        this.form.value.labels,
        this.form.value.picture,
        this.form.value.picture_alt
      ); */
    }
  }


  addInsigth(){

  }
}
