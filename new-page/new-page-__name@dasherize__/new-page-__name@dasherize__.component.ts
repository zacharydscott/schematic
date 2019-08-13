import { Component, OnInit } from '@angular/core';
import { FormGroupService } from '../form-test-group.service';
import { SuperFormGroup } from '../../common/super-forms';  

@Component({
    selector: '<%= dasherize(name) %>-page',
    styleUrls: ['./<%= dasherize(name) %>-page.component.scss
    ']
})
export class <%= classify(name) %>PageComponent implements OnInit {

    form: SuperFormGroup;

    constructor(private formGroupService: FormGroupService) {}

    ngOnInit() {
        this.form = this.formTestGroupService.getPageForm(['test-page']);
        this.title = this.form.label;
      }
}