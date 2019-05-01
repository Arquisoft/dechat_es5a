// client/src/app/icons/icons.module.ts

import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Smile } from 'angular-feather/icons';

const icons = {
  Smile,
};

@NgModule({
  imports: [
  FeatherModule.pick(icons)
],
exports: [
  FeatherModule
]
})
export class IconsModule { }
