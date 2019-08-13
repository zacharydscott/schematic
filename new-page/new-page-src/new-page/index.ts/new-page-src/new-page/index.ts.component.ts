import { Component, OnInit } from '@angular/core';
import { FormGroupService } from '../form-test-group.service';
import { SuperFormGroup } from '../../common/super-forms';  

@Component({
    selector: 'src/new-page/index.ts-page',
    styleUrls: ['./src/new-page/index.ts-page.component.scss
    ']
})
export class Src/newPage/index.TsPageComponent implements OnInit {

    form: SuperFormGroup;

    constructor(private formGroupService: FormGroupService) {}

    ngOnInit() {
        this.form = this.formTestGroupService.getPageForm(['test-page']);
        this.title = this.form.label;
      }
}