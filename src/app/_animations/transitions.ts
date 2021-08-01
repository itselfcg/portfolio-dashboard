import {
  trigger,
  state,
  animate,
  transition,
  style,
} from '@angular/animations';

export const routeTransitionAnimations = trigger('triggerName', [
  transition('*=>*', [
    style({opacity: 0 }),
    animate("500ms  ease-in",style({ opacity: 1,  })),
  ]),
]);
