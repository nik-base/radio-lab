import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  InputSignalWithTransform,
} from '@angular/core';

@Directive({
  selector: '[radioAutofocus]',
  standalone: true,
})
export class AutofocusDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(
    ElementRef<HTMLElement>
  ) as ElementRef<HTMLElement>;

  readonly radioAutofocus: InputSignalWithTransform<boolean, unknown> = input<
    boolean,
    unknown
  >(true, {
    transform: booleanAttribute,
  });

  constructor() {
    this.effectAutofocus();
  }

  private effectAutofocus(): void {
    effect((): void => {
      if (!this.radioAutofocus()) {
        return;
      }

      return this.triggerFocus();
    });
  }

  private triggerFocus(): void {
    const hostElement: HTMLElement = this.elementRef.nativeElement;

    if (!hostElement) {
      return;
    }

    const tagName: string = hostElement.tagName.toLowerCase();

    const nonInteractiveElements: string[] = [
      'div',
      'span',
      'p',
      'section',
      'article',
      'main',
      'header',
      'footer',
      'nav',
      'aside',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
    ];

    if (
      nonInteractiveElements.includes(tagName) &&
      !hostElement.hasAttribute('tabindex')
    ) {
      hostElement.setAttribute('tabindex', '-1'); // Make it programmatically focusable
    }

    setTimeout(() => {
      if (hostElement && document.body.contains(hostElement)) {
        hostElement.focus();
      }
    }, 0);
  }
}
