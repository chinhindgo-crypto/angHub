# Angular Exercises — Part 3 (51–75)

Each exercise follows:
- Goal  
- Steps (point wise)  
- Best example (short)  
- Brief explanation  
- Proper code (complete, copy‑pasteable files or snippets)

---

51) Route resolvers
- Goal: fetch data before route activation so component gets data immediately.
- Steps:
  1. Implement `Resolve<T>` in a service.
  2. Return an Observable/Promise from `resolve`.
  3. Attach resolver to route via `resolve` config.
- Best example: load item by id before showing details.
- Brief explanation: ensures component receives required data on init and avoids loading state inside the component.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/item-resolver.service.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ItemResolver implements Resolve<any> {
  constructor(private api: ApiService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id') || '';
    return this.api.getItem(id);
  }
}
```
```typescript
// snippet: route usage in app.routes.ts
{ path: 'item/:id', component: ItemDetailsComponent, resolve: { item: ItemResolver } }
```
```typescript
// snippet: using resolved data in component
// constructor(private route: ActivatedRoute) {}
// ngOnInit() { this.item = this.route.snapshot.data['item']; }
```

---

52) Router animations
- Goal: animate transitions between routes.
- Steps:
  1. Import `BrowserAnimationsModule`.
  2. Define animation triggers and attach to `<router-outlet>` via `@HostBinding` or outlet `@.disabled`.
  3. Provide route data or use activatedRouteData for animation state.
- Best example: simple fade between pages.
- Brief explanation: route animations improve perceived quality.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/route-animations.component.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-shell',
  standalone: true,
  template: `<main [@fadeAnimation]="o?.activatedRouteData?.animation"><router-outlet #o="outlet"></router-outlet></main>`,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))])
    ])
  ]
})
export class ShellComponent {}
```
```typescript
// main.ts ensure BrowserAnimationsModule provided (if using NgModule) or import in bootstrap providers as needed
```

---

53) Component communication patterns
- Goal: know when to use @Input/@Output, services or router for communication.
- Steps:
  1. Use `@Input()` / `@Output()` for parent-child.
  2. Use shared service (with BehaviorSubject/signals) for sibling or distant components.
  3. Use router/query params for navigation‑driven state.
- Best example: parent passes data via @Input, child emits via @Output; separate counter service shared by siblings.
- Brief explanation: choose pattern by coupling and lifetime requirements.
- Proper code:
```typescript
// parent->child: child.component.ts
@Component({ selector: 'app-child', standalone: true, template: `{{title}} <button (click)="done()">Done</button>` })
export class ChildComponent { @Input() title = ''; @Output() doneEvent = new EventEmitter<void>(); done(){ this.doneEvent.emit(); } }
```
```typescript
// sibling communication: simple service
@Injectable({ providedIn: 'root' })
export class SharedService { private _s = new BehaviorSubject<string>(''); s$ = this._s.asObservable(); set(v:string){ this._s.next(v); } }
```

---

54) Content projection (ng-content)
- Goal: allow consumers to inject arbitrary content into component.
- Steps:
  1. Put `<ng-content>` (and optional `select`) in component template.
  2. Consumer places content inside component tags.
- Best example: card component with title slot.
- Brief explanation: projection makes wrapper components flexible.
- Proper code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/card.component.html -->
<div class="card">
  <header><ng-content select="[card-title]"></ng-content></header>
  <section><ng-content></ng-content></section>
</div>
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/card.component.ts
import { Component } from '@angular/core';
@Component({ selector: 'app-card', standalone: true, templateUrl: './card.component.html' })
export class CardComponent {}
```
```html
<!-- usage -->
<app-card>
  <h3 card-title>Title</h3>
  <p>Body content</p>
</app-card>
```

---

55) Dynamic component creation
- Goal: create and insert components at runtime (modals, widgets).
- Steps:
  1. Inject `ViewContainerRef`.
  2. Call `createComponent()` and set inputs on the returned ref.
  3. Destroy when done.
- Best example: simple dynamic alert component.
- Brief explanation: useful for runtime composition and lazy creation.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/dynamic-host.component.ts
import { Component, ViewContainerRef } from '@angular/core';
import { AlertComponent } from './alert.component';

@Component({ selector: 'app-dyn-host', standalone: true, template: `<button (click)="open()">Open Alert</button>` })
export class DynamicHostComponent {
  constructor(private vcr: ViewContainerRef) {}
  open() {
    const ref = this.vcr.createComponent(AlertComponent);
    ref.setInput('message', 'Runtime Alert!');
    // optional cleanup after 3s
    setTimeout(() => ref.destroy(), 3000);
  }
}
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/alert.component.ts
import { Component, Input } from '@angular/core';
@Component({ selector: 'app-alert', standalone: true, template: `<div class="alert">{{ message }}</div>` })
export class AlertComponent { @Input() message = ''; }
```

---

56) HostBinding & HostListener
- Goal: bind properties and events on host element from directive/component.
- Steps:
  1. Use `@HostBinding()` to expose host properties.
  2. Use `@HostListener()` to react to host events.
- Best example: toggle `active` class on click.
- Brief explanation: encapsulate host interaction inside the class.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/toggle.directive.ts
import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appToggle]' })
export class ToggleDirective {
  @HostBinding('class.active') isActive = false;
  @HostListener('click') onClick() { this.isActive = !this.isActive; }
}
```

---

57) ElementRef & Renderer2
- Goal: modify DOM in a platform-safe and secure way.
- Steps:
  1. Inject `ElementRef` and `Renderer2`.
  2. Use `renderer.setStyle`, `setAttribute`, etc.
- Best example: set element color without touching nativeElement directly.
- Brief explanation: Renderer2 is recommended for SSR and security.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/safe-style.directive.ts
import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({ selector: '[appSafeStyle]' })
export class SafeStyleDirective implements OnInit {
  @Input('appSafeStyle') color = 'red';
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit() { this.renderer.setStyle(this.el.nativeElement, 'color', this.color); }
}
```

---

58) Component unit testing
- Goal: unit test component logic and template with TestBed.
- Steps:
  1. Configure TestBed with declarations/imports/providers.
  2. Create component fixture and call `detectChanges()`.
  3. Assert DOM and/or class behavior.
- Best example: expect text content to contain value.
- Brief explanation: small, fast tests for components.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });
  it('renders title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Welcome');
  });
});
```

---

59) Service unit testing
- Goal: test service behavior in isolation.
- Steps:
  1. Configure TestBed with service providers and testing modules as needed.
  2. Inject service and stub collaborators.
  3. Assert outputs and side-effects.
- Best example: test counter service increments value.
- Brief explanation: verifies business logic without UI.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/counter.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CounterService } from './counter.service';

describe('CounterService', () => {
  let svc: CounterService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CounterService] });
    svc = TestBed.inject(CounterService);
  });
  it('increments', () => {
    svc.inc();
    expect(svc.value).toBe(1);
  });
});
```

---

60) HTTP testing (HttpTestingController)
- Goal: mock HttpClient requests in unit tests.
- Steps:
  1. Import `HttpClientTestingModule`.
  2. Inject `HttpTestingController` and service under test.
  3. Use `expectOne()` and `flush()` to simulate responses.
- Best example: test ApiService.getPosts.
- Brief explanation: deterministic HTTP tests without network.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let svc: ApiService; let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [ApiService] });
    svc = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('fetches posts', () => {
    const mock = [{ id:1, title:'t' }];
    svc.getPosts().subscribe(posts => expect(posts).toEqual(mock));
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush(mock);
    httpMock.verify();
  });
});
```

---

61) E2E tests (Playwright/Cypress)
- Goal: validate user flows end-to-end.
- Steps:
  1. Install runner (Playwright recommended).
  2. Write test that launches app, navigates and asserts DOM.
  3. Run tests in CI.
- Best example: visit home and check title.
- Brief explanation: simulates real user interactions.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/e2e/home.spec.ts
import { test, expect } from '@playwright/test';
test('home shows welcome', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await expect(page.locator('h1')).toHaveText('Welcome to Demo App');
});
```

---

62) Angular CLI schematics
- Goal: scaffold consistent artifacts quickly.
- Steps:
  1. Use `ng generate component name --standalone` (or service/module/library).
  2. Inspect and adjust generated code.
- Best example: `ng generate component hello --standalone`.
- Brief explanation: saves time and keeps conventions.
- Proper code:
```bash
# CLI commands
ng generate component hello --standalone --skip-tests=false
ng generate service api
```

---

63) Linting & formatting (ESLint/Prettier)
- Goal: keep code consistent and catch issues early.
- Steps:
  1. Add ESLint and Prettier configs.
  2. Add npm scripts for lint and format.
  3. Run in CI and pre-commit.
- Best example: npm scripts for lint and format.
- Brief explanation: automated style and static checks improve maintainability.
- Proper code:
```json
// filepath: /workspaces/angHub/ngApp/package.json (snippet)
{
  "scripts": {
    "lint": "eslint \"src/**/*.{ts,js,html}\" --max-warnings=0",
    "format": "prettier --write \"src/**/*.{ts,js,json,css,html,md}\""
  }
}
```
```json
// .eslintrc.json (basic)
{ "root": true, "overrides": [{ "files": ["*.ts"], "parserOptions": { "project": ["tsconfig.json"] } }] }
```

---

64) Environment config
- Goal: maintain separate settings for dev/prod builds.
- Steps:
  1. Define `environment.ts` and `environment.prod.ts`.
  2. Configure `fileReplacements` in `angular.json` for production builds.
- Best example: API base URL changes per environment.
- Brief explanation: build-time config selection for environment-specific values.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/environments/environment.ts
export const environment = { production: false, apiUrl: 'http://localhost:3000' };
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/environments/environment.prod.ts
export const environment = { production: true, apiUrl: 'https://api.example.com' };
```

---

65) i18n basics
- Goal: mark strings for localization and extract messages.
- Steps:
  1. Use Angular i18n attributes (`i18n="..."`) or `$localize`.
  2. Run extraction tooling (`ng extract-i18n`) and provide translations.
- Best example: simple translatable heading.
- Brief explanation: prepares UI strings for translators and builds per locale.
- Proper code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<h1 i18n="site title">Welcome to Demo App</h1>
```
```bash
# extract messages
ng extract-i18n --output-path src/locale
```

---

66) Accessibility basics (a11y)
- Goal: improve keyboard navigation and assistive tech support.
- Steps:
  1. Add semantic HTML, roles, aria-labels.
  2. Ensure focus order and keyboard handlers.
  3. Test with Lighthouse and screen reader.
- Best example: accessible button with aria-label.
- Brief explanation: a11y makes app usable for more people.
- Proper code:
```html
<button aria-label="Close dialog" (keyup.enter)="close()" (click)="close()">✕</button>
```

---

67) i18n pluralization & ICU
- Goal: handle plural forms and complex localized messages.
- Steps:
  1. Use ICU expressions inside i18n blocks.
  2. Provide translations for languages requiring specific plural rules.
- Best example: count-dependent message.
- Brief explanation: ICU syntax supports language-aware pluralization.
- Proper code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/messages.component.html -->
<p i18n>
  {count, plural, =0 {No items} =1 {One item} other {# items}}
</p>
```

---

68) Animations (advanced)
- Goal: create performant multi-step animations.
- Steps:
  1. Use `@angular/animations` triggers and sequence keyframes.
  2. Use `:enter`/`:leave` and state transitions as needed.
- Best example: slide & fade on enter.
- Brief explanation: complex animations enhance UX but keep them performant.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/animated-list.component.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-animated-list',
  standalone: true,
  template: `<div *ngFor="let i of items" @listAnim>{{i}}</div>`,
  animations: [
    trigger('listAnim', [
      transition(':enter', [
        style({ opacity:0, transform:'translateY(-10px)' }),
        animate('250ms ease-out', style({ opacity:1, transform:'none' }))
      ])
    ])
  ]
})
export class AnimatedListComponent { items = ['A','B','C']; }
```

---

69) Lazy images & responsive srcset
- Goal: reduce bandwidth and improve LCP by loading appropriate images.
- Steps:
  1. Provide multiple image sizes and formats (webp/avif).
  2. Use `loading="lazy"` and `srcset`/`sizes`.
- Best example: responsive `<img>` with srcset.
- Brief explanation: browser selects best image for device and viewport.
- Proper code:
```html
<picture>
  <source type="image/webp" srcset="img-400.webp 400w, img-800.webp 800w">
  <img loading="lazy" src="img-800.jpg" srcset="img-400.jpg 400w, img-800.jpg 800w" sizes="(max-width:600px) 400px, 800px" alt="Example">
</picture>
```

---

70) Web Workers
- Goal: offload CPU-heavy tasks to background thread.
- Steps:
  1. Generate a worker (`ng generate web-worker <name>`).
  2. Use `postMessage`/`onmessage` exchange.
- Best example: compute-intensive function inside worker.
- Brief explanation: keeps UI thread responsive.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/calc.worker.ts
/// <reference lib="webworker" />
addEventListener('message', ({ data }) => {
  const result = heavyCalc(data);
  postMessage(result);
});
function heavyCalc(n:number){ let s=0; for(let i=0;i<1e6;i++) s+=i; return s + n; }
```
```typescript
// usage in a component
const worker = new Worker(new URL('./calc.worker', import.meta.url));
worker.postMessage(10);
worker.onmessage = ({ data }) => console.log('result', data);
```

---

71) Progressive Web App (PWA)
- Goal: make app installable and available offline.
- Steps:
  1. Run `ng add @angular/pwa`.
  2. Configure `ngsw-config.json` and manifest as needed.
- Best example: enable service worker in production builds.
- Brief explanation: PWA adds offline caching and installability.
- Proper code:
```bash
# run once in project root
ng add @angular/pwa
```

---

72) Service Worker caching strategies
- Goal: tune caching for assets and API data.
- Steps:
  1. Edit `ngsw-config.json` `assetGroups` and `dataGroups`.
  2. Choose `performance` or `freshness` strategies per group.
- Best example: cache images (`performance`) and API responses (`freshness` with maxAge).
- Brief explanation: controls how and when resources are refreshed.
- Proper code:
```json
// filepath: /workspaces/angHub/ngApp/ngsw-config.json (snippet)
{
  "dataGroups": [{
    "name": "api",
    "urls": [ "/api/**" ],
    "cacheConfig": { "strategy": "freshness", "maxSize": 100, "maxAge": "3600s" }
  }]
}
```

---

73) Authentication flow basics
- Goal: basic login, token storage and protected routes.
- Steps:
  1. Implement AuthService with login/logout and token storage (prefer secure cookies).
  2. Implement guard to protect routes.
  3. Use interceptor to attach token to requests.
- Best example: AuthService with login stub.
- Brief explanation: centralize auth logic and protect routes.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/auth.service.ts
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(token:string){ localStorage.setItem('token', token); }
  logout(){ localStorage.removeItem('token'); }
  isLoggedIn() { return !!localStorage.getItem('token'); }
  hasRole(role:string){ return role === 'admin' && this.isLoggedIn(); } // example stub
}
```

---

74) OAuth/OIDC integration
- Goal: integrate third-party identity provider using standard libraries.
- Steps:
  1. Install `angular-oauth2-oidc`.
  2. Configure issuer, clientId and redirect URIs.
  3. Use library helpers to manage login and token refresh.
- Best example: minimal setup to start OIDC login flow.
- Brief explanation: standard OIDC simplifies auth with external IdPs.
- Proper code:
```typescript
// usage snippet (app-init)
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
const authConfig: AuthConfig = { issuer: 'https://accounts.example.com', clientId: 'angular-app', redirectUri: window.location.origin, responseType: 'code' };
// in app init: oauthService.configure(authConfig); oauthService.loadDiscoveryDocumentAndTryLogin();
```

---

75) Role‑based UI
- Goal: show/hide UI based on user roles.
- Steps:
  1. Store user roles in AuthService after login.
  2. Use `*ngIf="auth.hasRole('admin')"` to conditionally render admin UI.
  3. Also protect routes with guard.
- Best example: admin panel link visible only to admins.
- Brief explanation: combine UI checks with route guards for secure behavior.
- Proper code:
```html
<!-- snippet in template -->
<a *ngIf="auth.hasRole('admin')" routerLink="/admin">Admin Panel</a>
```
```typescript
// auth.hasRole implemented in AuthService (see exercise 73)
```

---

End of Part 3 (51–75).

If you want Part 4 (76–100) created and saved in the same complete format, confirm and I will generate it.
```// filepath: /workspaces/angHub/ngApp/ANGULAR_EXERCISES_PART3.md
# Angular Exercises — Part 3 (51–75)

Each exercise follows:
- Goal  
- Steps (point wise)  
- Best example (short)  
- Brief explanation  
- Proper code (complete, copy‑pasteable files or snippets)

---

51) Route resolvers
- Goal: fetch data before route activation so component gets data immediately.
- Steps:
  1. Implement `Resolve<T>` in a service.
  2. Return an Observable/Promise from `resolve`.
  3. Attach resolver to route via `resolve` config.
- Best example: load item by id before showing details.
- Brief explanation: ensures component receives required data on init and avoids loading state inside the component.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/item-resolver.service.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ItemResolver implements Resolve<any> {
  constructor(private api: ApiService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id') || '';
    return this.api.getItem(id);
  }
}
```
```typescript
// snippet: route usage in app.routes.ts
{ path: 'item/:id', component: ItemDetailsComponent, resolve: { item: ItemResolver } }
```
```typescript
// snippet: using resolved data in component
// constructor(private route: ActivatedRoute) {}
// ngOnInit() { this.item = this.route.snapshot.data['item']; }
```

---

52) Router animations
- Goal: animate transitions between routes.
- Steps:
  1. Import `BrowserAnimationsModule`.
  2. Define animation triggers and attach to `<router-outlet>` via `@HostBinding` or outlet `@.disabled`.
  3. Provide route data or use activatedRouteData for animation state.
- Best example: simple fade between pages.
- Brief explanation: route animations improve perceived quality.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/route-animations.component.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-shell',
  standalone: true,
  template: `<main [@fadeAnimation]="o?.activatedRouteData?.animation"><router-outlet #o="outlet"></router-outlet></main>`,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))])
    ])
  ]
})
export class ShellComponent {}
```
```typescript
// main.ts ensure BrowserAnimationsModule provided (if using NgModule) or import in bootstrap providers as needed
```

---

53) Component communication patterns
- Goal: know when to use @Input/@Output, services or router for communication.
- Steps:
  1. Use `@Input()` / `@Output()` for parent-child.
  2. Use shared service (with BehaviorSubject/signals) for sibling or distant components.
  3. Use router/query params for navigation‑driven state.
- Best example: parent passes data via @Input, child emits via @Output; separate counter service shared by siblings.
- Brief explanation: choose pattern by coupling and lifetime requirements.
- Proper code:
```typescript
// parent->child: child.component.ts
@Component({ selector: 'app-child', standalone: true, template: `{{title}} <button (click)="done()">Done</button>` })
export class ChildComponent { @Input() title = ''; @Output() doneEvent = new EventEmitter<void>(); done(){ this.doneEvent.emit(); } }
```
```typescript
// sibling communication: simple service
@Injectable({ providedIn: 'root' })
export class SharedService { private _s = new BehaviorSubject<string>(''); s$ = this._s.asObservable(); set(v:string){ this._s.next(v); } }
```

---

54) Content projection (ng-content)
- Goal: allow consumers to inject arbitrary content into component.
- Steps:
  1. Put `<ng-content>` (and optional `select`) in component template.
  2. Consumer places content inside component tags.
- Best example: card component with title slot.
- Brief explanation: projection makes wrapper components flexible.
- Proper code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/card.component.html -->
<div class="card">
  <header><ng-content select="[card-title]"></ng-content></header>
  <section><ng-content></ng-content></section>
</div>
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/card.component.ts
import { Component } from '@angular/core';
@Component({ selector: 'app-card', standalone: true, templateUrl: './card.component.html' })
export class CardComponent {}
```
```html
<!-- usage -->
<app-card>
  <h3 card-title>Title</h3>
  <p>Body content</p>
</app-card>
```

---

55) Dynamic component creation
- Goal: create and insert components at runtime (modals, widgets).
- Steps:
  1. Inject `ViewContainerRef`.
  2. Call `createComponent()` and set inputs on the returned ref.
  3. Destroy when done.
- Best example: simple dynamic alert component.
- Brief explanation: useful for runtime composition and lazy creation.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/dynamic-host.component.ts
import { Component, ViewContainerRef } from '@angular/core';
import { AlertComponent } from './alert.component';

@Component({ selector: 'app-dyn-host', standalone: true, template: `<button (click)="open()">Open Alert</button>` })
export class DynamicHostComponent {
  constructor(private vcr: ViewContainerRef) {}
  open() {
    const ref = this.vcr.createComponent(AlertComponent);
    ref.setInput('message', 'Runtime Alert!');
    // optional cleanup after 3s
    setTimeout(() => ref.destroy(), 3000);
  }
}
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/alert.component.ts
import { Component, Input } from '@angular/core';
@Component({ selector: 'app-alert', standalone: true, template: `<div class="alert">{{ message }}</div>` })
export class AlertComponent { @Input() message = ''; }
```

---

56) HostBinding & HostListener
- Goal: bind properties and events on host element from directive/component.
- Steps:
  1. Use `@HostBinding()` to expose host properties.
  2. Use `@HostListener()` to react to host events.
- Best example: toggle `active` class on click.
- Brief explanation: encapsulate host interaction inside the class.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/toggle.directive.ts
import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appToggle]' })
export class ToggleDirective {
  @HostBinding('class.active') isActive = false;
  @HostListener('click') onClick() { this.isActive = !this.isActive; }
}
```

---

57) ElementRef & Renderer2
- Goal: modify DOM in a platform-safe and secure way.
- Steps:
  1. Inject `ElementRef` and `Renderer2`.
  2. Use `renderer.setStyle`, `setAttribute`, etc.
- Best example: set element color without touching nativeElement directly.
- Brief explanation: Renderer2 is recommended for SSR and security.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/safe-style.directive.ts
import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({ selector: '[appSafeStyle]' })
export class SafeStyleDirective implements OnInit {
  @Input('appSafeStyle') color = 'red';
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit() { this.renderer.setStyle(this.el.nativeElement, 'color', this.color); }
}
```

---

58) Component unit testing
- Goal: unit test component logic and template with TestBed.
- Steps:
  1. Configure TestBed with declarations/imports/providers.
  2. Create component fixture and call `detectChanges()`.
  3. Assert DOM and/or class behavior.
- Best example: expect text content to contain value.
- Brief explanation: small, fast tests for components.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });
  it('renders title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Welcome');
  });
});
```

---

59) Service unit testing
- Goal: test service behavior in isolation.
- Steps:
  1. Configure TestBed with service providers and testing modules as needed.
  2. Inject service and stub collaborators.
  3. Assert outputs and side-effects.
- Best example: test counter service increments value.
- Brief explanation: verifies business logic without UI.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/counter.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CounterService } from './counter.service';

describe('CounterService', () => {
  let svc: CounterService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CounterService] });
    svc = TestBed.inject(CounterService);
  });
  it('increments', () => {
    svc.inc();
    expect(svc.value).toBe(1);
  });
});
```

---

60) HTTP testing (HttpTestingController)
- Goal: mock HttpClient requests in unit tests.
- Steps:
  1. Import `HttpClientTestingModule`.
  2. Inject `HttpTestingController` and service under test.
  3. Use `expectOne()` and `flush()` to simulate responses.
- Best example: test ApiService.getPosts.
- Brief explanation: deterministic HTTP tests without network.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let svc: ApiService; let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [ApiService] });
    svc = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('fetches posts', () => {
    const mock = [{ id:1, title:'t' }];
    svc.getPosts().subscribe(posts => expect(posts).toEqual(mock));
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    req.flush(mock);
    httpMock.verify();
  });
});
```

---

61) E2E tests (Playwright/Cypress)
- Goal: validate user flows end-to-end.
- Steps:
  1. Install runner (Playwright recommended).
  2. Write test that launches app, navigates and asserts DOM.
  3. Run tests in CI.
- Best example: visit home and check title.
- Brief explanation: simulates real user interactions.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/e2e/home.spec.ts
import { test, expect } from '@playwright/test';
test('home shows welcome', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await expect(page.locator('h1')).toHaveText('Welcome to Demo App');
});
```

---

62) Angular CLI schematics
- Goal: scaffold consistent artifacts quickly.
- Steps:
  1. Use `ng generate component name --standalone` (or service/module/library).
  2. Inspect and adjust generated code.
- Best example: `ng generate component hello --standalone`.
- Brief explanation: saves time and keeps conventions.
- Proper code:
```bash
# CLI commands
ng generate component hello --standalone --skip-tests=false
ng generate service api
```

---

63) Linting & formatting (ESLint/Prettier)
- Goal: keep code consistent and catch issues early.
- Steps:
  1. Add ESLint and Prettier configs.
  2. Add npm scripts for lint and format.
  3. Run in CI and pre-commit.
- Best example: npm scripts for lint and format.
- Brief explanation: automated style and static checks improve maintainability.
- Proper code:
```json
// filepath: /workspaces/angHub/ngApp/package.json (snippet)
{
  "scripts": {
    "lint": "eslint \"src/**/*.{ts,js,html}\" --max-warnings=0",
    "format": "prettier --write \"src/**/*.{ts,js,json,css,html,md}\""
  }
}
```
```json
// .eslintrc.json (basic)
{ "root": true, "overrides": [{ "files": ["*.ts"], "parserOptions": { "project": ["tsconfig.json"] } }] }
```

---

64) Environment config
- Goal: maintain separate settings for dev/prod builds.
- Steps:
  1. Define `environment.ts` and `environment.prod.ts`.
  2. Configure `fileReplacements` in `angular.json` for production builds.
- Best example: API base URL changes per environment.
- Brief explanation: build-time config selection for environment-specific values.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/environments/environment.ts
export const environment = { production: false, apiUrl: 'http://localhost:3000' };
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/environments/environment.prod.ts
export const environment = { production: true, apiUrl: 'https://api.example.com' };
```

---

65) i18n basics
- Goal: mark strings for localization and extract messages.
- Steps:
  1. Use Angular i18n attributes (`i18n="..."`) or `$localize`.
  2. Run extraction tooling (`ng extract-i18n`) and provide translations.
- Best example: simple translatable heading.
- Brief explanation: prepares UI strings for translators and builds per locale.
- Proper code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<h1 i18n="site title">Welcome to Demo App</h1>
```
```bash
# extract messages
ng extract-i18n --output-path src/locale
```

---

66) Accessibility basics (a11y)
- Goal: improve keyboard navigation and assistive tech support.
- Steps:
  1. Add semantic HTML, roles, aria-labels.
  2. Ensure focus order and keyboard handlers.
  3. Test with Lighthouse and screen reader.
- Best example: accessible button with aria-label.
- Brief explanation: a11y makes app usable for more people.
- Proper code:
```html
<button aria-label="Close dialog" (keyup.enter)="close()" (click)="close()">✕</button>
```

---

67) i18n pluralization & ICU
- Goal: handle plural forms and complex localized messages.
- Steps:
  1. Use ICU expressions inside i18n blocks.
  2. Provide translations for languages requiring specific plural rules.
- Best example: count-dependent message.
- Brief explanation: ICU syntax supports language-aware pluralization.
- Proper code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/messages.component.html -->
<p i18n>
  {count, plural, =0 {No items} =1 {One item} other {# items}}
</p>
```

---

68) Animations (advanced)
- Goal: create performant multi-step animations.
- Steps:
  1. Use `@angular/animations` triggers and sequence keyframes.
  2. Use `:enter`/`:leave` and state transitions as needed.
- Best example: slide & fade on enter.
- Brief explanation: complex animations enhance UX but keep them performant.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/animated-list.component.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-animated-list',
  standalone: true,
  template: `<div *ngFor="let i of items" @listAnim>{{i}}</div>`,
  animations: [
    trigger('listAnim', [
      transition(':enter', [
        style({ opacity:0, transform:'translateY(-10px)' }),
        animate('250ms ease-out', style({ opacity:1, transform:'none' }))
      ])
    ])
  ]
})
export class AnimatedListComponent { items = ['A','B','C']; }
```

---

69) Lazy images & responsive srcset
- Goal: reduce bandwidth and improve LCP by loading appropriate images.
- Steps:
  1. Provide multiple image sizes and formats (webp/avif).
  2. Use `loading="lazy"` and `srcset`/`sizes`.
- Best example: responsive `<img>` with srcset.
- Brief explanation: browser selects best image for device and viewport.
- Proper code:
```html
<picture>
  <source type="image/webp" srcset="img-400.webp 400w, img-800.webp 800w">
  <img loading="lazy" src="img-800.jpg" srcset="img-400.jpg 400w, img-800.jpg 800w" sizes="(max-width:600px) 400px, 800px" alt="Example">
</picture>
```

---

70) Web Workers
- Goal: offload CPU-heavy tasks to background thread.
- Steps:
  1. Generate a worker (`ng generate web-worker <name>`).
  2. Use `postMessage`/`onmessage` exchange.
- Best example: compute-intensive function inside worker.
- Brief explanation: keeps UI thread responsive.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/calc.worker.ts
/// <reference lib="webworker" />
addEventListener('message', ({ data }) => {
  const result = heavyCalc(data);
  postMessage(result);
});
function heavyCalc(n:number){ let s=0; for(let i=0;i<1e6;i++) s+=i; return s + n; }
```
```typescript
// usage in a component
const worker = new Worker(new URL('./calc.worker', import.meta.url));
worker.postMessage(10);
worker.onmessage = ({ data }) => console.log('result', data);
```

---

71) Progressive Web App (PWA)
- Goal: make app installable and available offline.
- Steps:
  1. Run `ng add @angular/pwa`.
  2. Configure `ngsw-config.json` and manifest as needed.
- Best example: enable service worker in production builds.
- Brief explanation: PWA adds offline caching and installability.
- Proper code:
```bash
# run once in project root
ng add @angular/pwa
```

---

72) Service Worker caching strategies
- Goal: tune caching for assets and API data.
- Steps:
  1. Edit `ngsw-config.json` `assetGroups` and `dataGroups`.
  2. Choose `performance` or `freshness` strategies per group.
- Best example: cache images (`performance`) and API responses (`freshness` with maxAge).
- Brief explanation: controls how and when resources are refreshed.
- Proper code:
```json
// filepath: /workspaces/angHub/ngApp/ngsw-config.json (snippet)
{
  "dataGroups": [{
    "name": "api",
    "urls": [ "/api/**" ],
    "cacheConfig": { "strategy": "freshness", "maxSize": 100, "maxAge": "3600s" }
  }]
}
```

---

73) Authentication flow basics
- Goal: basic login, token storage and protected routes.
- Steps:
  1. Implement AuthService with login/logout and token storage (prefer secure cookies).
  2. Implement guard to protect routes.
  3. Use interceptor to attach token to requests.
- Best example: AuthService with login stub.
- Brief explanation: centralize auth logic and protect routes.
- Proper code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/auth.service.ts
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(token:string){ localStorage.setItem('token', token); }
  logout(){ localStorage.removeItem('token'); }
  isLoggedIn() { return !!localStorage.getItem('token'); }
  hasRole(role:string){ return role === 'admin' && this.isLoggedIn(); } // example stub
}
```

---

74) OAuth/OIDC integration
- Goal: integrate third-party identity provider using standard libraries.
- Steps:
  1. Install `angular-oauth2-oidc`.
  2. Configure issuer, clientId and redirect URIs.
  3. Use library helpers to manage login and token refresh.
- Best example: minimal setup to start OIDC login flow.
- Brief explanation: standard OIDC simplifies auth with external IdPs.
- Proper code:
```typescript
// usage snippet (app-init)
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
const authConfig: AuthConfig = { issuer: 'https://accounts.example.com', clientId: 'angular-app', redirectUri: window.location.origin, responseType: 'code' };
// in app init: oauthService.configure(authConfig); oauthService.loadDiscoveryDocumentAndTryLogin();
```

---

75) Role‑based UI
- Goal: show/hide UI based on user roles.
- Steps:
  1. Store user roles in AuthService after login.
  2. Use `*ngIf="auth.hasRole('admin')"` to conditionally render admin UI.
  3. Also protect routes with guard.
- Best example: admin panel link visible only to admins.
- Brief explanation: combine UI checks with route guards for secure behavior.
- Proper code:
```html
<!-- snippet in template -->
<a *ngIf="auth.hasRole('admin')" routerLink="/admin">Admin Panel</a>
```
```typescript
// auth.hasRole implemented in AuthService (see exercise 73)
```

---

End of Part 3 (51–75).