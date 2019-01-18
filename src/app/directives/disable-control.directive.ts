import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input('disableControl') set setDisabled ( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    console.log('condition:');
    console.log(condition);
    console.log('action:');
    console.log(action);
    console.log(this.ngControl.disabled)
    this.ngControl.control[action]();
    console.log(this.ngControl.disabled)
  }

  constructor( private ngControl : NgControl ) {
  }
}
