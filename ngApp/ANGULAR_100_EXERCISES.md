# Angular 100 Exercises — Step‑by‑Step Question Bank

A progressive list of 100 Angular exercises. Each item: Goal → Minimal steps → Quick hint/solution. Work in order. Commit after each exercise.

---

1. Create app  
- Goal: scaffold + serve.  
- Steps: `ng new demo --standalone`, `cd demo`, `ng serve --open`.  
- Hint: follow CLI prompts.

2. Hello world  
- Goal: render "Hello Angular".  
- Steps: edit root template.  
- Hint: add text to `app.component.html`.

3. Make App standalone  
- Goal: standalone root component.  
- Steps: set `standalone: true` in `@Component`.  
- Hint: remove NgModule boilerplate.

4. Create child component  
- Goal: new component.  
- Steps: `ng generate component hello --standalone` or manual `@Component`.  
- Hint: export selector.

5. Parent → Child (@Input)  
- Goal: pass data via `@Input`.  
- Steps: add `@Input() name`, bind `<child [name]="parentName">`.  
- Hint: default value for safety.

6. Child → Parent (@Output)  
- Goal: emit events with `EventEmitter`.  
- Steps: `@Output() select = new EventEmitter<string>()`, `(select)="onSelect($event)"`.  
- Hint: use `emit()`.

7. Render list (*ngFor)  
- Goal: display array.  
- Steps: `*ngFor="let item of items"`.  
- Hint: use `trackBy` for large lists.

8. Conditional (*ngIf)  
- Goal: toggle UI.  
- Steps: `*ngIf="visible"`.  
- Hint: use `else` template for alternate view.

9. Property binding  
- Goal: bind attributes.  
- Steps: `[disabled]="isDisabled"`, `[src]="imgUrl"`.  
- Hint: prefer property binding over string concat.

10. Event binding  
- Goal: handle click, input events.  
- Steps: `(click)="onClick()"`.  
- Hint: use `$event` when needed.

11. Two‑way binding (ngModel)  
- Goal: bind input ↔ model.  
- Steps: import Forms support or `NgModel`, use `[(ngModel)]="value"`.  
- Hint: add `name` attribute for template forms.

12. Template reference variables  
- Goal: access DOM values.  
- Steps: `<input #box> (click)="do(box.value)"`.  
- Hint: good for quick access.

13. Interpolation expressions  
- Goal: display computed values.  
- Steps: `{{ user.name }}`, `{{ getTotal() }}`.  
- Hint: avoid expensive computations in templates.

14. Built‑in pipes  
- Goal: format data.  
- Steps: `{{ date | date }}`, `{{ text | uppercase }}`.  
- Hint: combine pipes.

15. Custom pipe  
- Goal: implement `PipeTransform`.  
- Steps: create `@Pipe({standalone:true})` and `transform()`.  
- Hint: make pure for performance.

16. Structural directive (*appUnless)  
- Goal: custom structural behavior.  
- Steps: directive with `TemplateRef` and `ViewContainerRef`.  
- Hint: mirror `*ngIf` logic.

17. Attribute directive (host styling)  
- Goal: modify host element.  
- Steps: `@Directive`, use `@HostBinding()` and `@HostListener()`.  
- Hint: use input to configure behavior.

18. Lifecycle hooks  
- Goal: implement `OnInit`, `OnDestroy`.  
- Steps: add methods and implement interfaces.  
- Hint: cleanup subscriptions in `ngOnDestroy`.

19. ViewChild usage  
- Goal: access child component/element.  
- Steps: `@ViewChild(ChildComponent) child: ChildComponent;` use in `ngAfterViewInit`.  
- Hint: check `static` when necessary.

20. ContentChild usage  
- Goal: read projected content.  
- Steps: `@ContentChild` with selector, use `<ng-content>`.  
- Hint: useful for wrapper components.

21. Create service & DI  
- Goal: share logic.  
- Steps: `@Injectable({providedIn: 'root'}) export class ApiService {}`.  
- Hint: inject with constructor.

22. Shared counter service  
- Goal: shared state across components.  
- Steps: methods for inc/dec, inject in components.  
- Hint: use BehaviorSubject or signals.

23. Provider scope (hierarchical)  
- Goal: scope service to component.  
- Steps: add `providers: [MyService]` in component.  
- Hint: creates separate instances per provider location.

24. HTTP GET  
- Goal: fetch JSON.  
- Steps: import `HttpClientModule`, `HttpClient.get(url)`.  
- Hint: use interfaces for types.

25. HTTP POST  
- Goal: send data.  
- Steps: `http.post(url, payload)`.  
- Hint: set Content-Type if needed.

26. HTTP error handling  
- Goal: manage API errors.  
- Steps: `.pipe(catchError(...))` or subscribe error callback.  
- Hint: show user-friendly messages.

27. HttpInterceptor  
- Goal: add auth header/logging.  
- Steps: implement `HttpInterceptor`, provide in root.  
- Hint: clone request before modifying.

28. Reactive forms basics  
- Goal: `FormGroup` + controls.  
- Steps: build form in TS, bind with `[formGroup]`.  
- Hint: use `formControlName`.

29. Reactive form validation  
- Goal: required/min length validators.  
- Steps: add `Validators.required`, check `control.invalid`.  
- Hint: show errors only after touched/submitted.

30. Template‑driven form  
- Goal: use `NgForm`.  
- Steps: `#f="ngForm"`, use `ngModel`.  
- Hint: simple forms prefer template-driven.

31. Custom synchronous validator  
- Goal: validate control value.  
- Steps: return `ValidationErrors|null`.  
- Hint: reusable validators as functions.

32. Async validator  
- Goal: server-side validation.  
- Steps: return `Observable<ValidationErrors|null>` and use `asyncValidator`.  
- Hint: debounce server calls.

33. FormArray dynamic controls  
- Goal: add/remove repeated controls.  
- Steps: use `FormArray`, `push`, `removeAt`.  
- Hint: map controls to template with `*ngFor`.

34. Debounced search (Reactive)  
- Goal: debounce input and query API.  
- Steps: `valueChanges.pipe(debounceTime(300), distinctUntilChanged(), switchMap(...))`.  
- Hint: handle empty input.

35. RxJS basics: Observables  
- Goal: create and subscribe.  
- Steps: `of`, `fromEvent`, `subscribe`, unsubscribe.  
- Hint: prefer async pipe in templates.

36. RxJS map & filter  
- Goal: transform streams.  
- Steps: use `map`, `filter` operators in pipe.  
- Hint: keep streams pure.

37. switchMap vs mergeMap  
- Goal: understand cancelling vs parallel.  
- Steps: implement search with each and observe requests.  
- Hint: use `switchMap` for last-result only.

38. combineLatest  
- Goal: combine multiple observables.  
- Steps: `combineLatest([obs1, obs2]).pipe(map(...))`.  
- Hint: emits when all have emitted at least once.

39. Subject & BehaviorSubject  
- Goal: manual stream controller.  
- Steps: create subject, `.next()`, subscribe.  
- Hint: BehaviorSubject holds last value.

40. Signals: intro  
- Goal: use `signal()` and `computed()`.  
- Steps: import from `@angular/core`, use in template.  
- Hint: call signal as fn to read value.

41. Signals: derived/computed  
- Goal: create derived signal.  
- Steps: `const double = computed(()=>count()*2)`.  
- Hint: auto updates listeners.

42. Signals in services  
- Goal: shared reactive state via signals.  
- Steps: expose signals from injectable service.  
- Hint: avoid direct mutation from components.

43. Routing basics  
- Goal: set up simple routes.  
- Steps: define routes, include `RouterModule.forRoot(routes)`, add `<router-outlet>`.  
- Hint: use standalone components in routes.

44. RouterLink & navigation  
- Goal: in-app navigation links and programmatic navigation.  
- Steps: use `routerLink` and `router.navigate(['/path'])`.  
- Hint: use `replaceUrl` or `queryParams`.

45. Route parameters  
- Goal: `/:id` param reading.  
- Steps: use `ActivatedRoute.paramMap` or `snapshot.paramMap`.  
- Hint: use `switchMap` for async fetch on change.

46. Query parameters  
- Goal: read and update query params.  
- Steps: `route.queryParamMap`, navigate with `{ queryParams: { q: 'x' } }`.  
- Hint: use `queryParamsHandling` options.

47. Route guards (CanActivate)  
- Goal: protect routes.  
- Steps: implement `CanActivate`, provide in route `canActivate`.  
- Hint: return `boolean | UrlTree | Observable<boolean|UrlTree>`.

48. Lazy loading modules  
- Goal: reduce initial bundle.  
- Steps: use `loadChildren: () => import(...).then(m=>m.Module)`.  
- Hint: create a feature module or standalone route components.

49. Preloading strategies  
- Goal: preload lazy modules.  
- Steps: configure `PreloadAllModules` or custom strategy in RouterModule.  
- Hint: favors UX vs bandwidth tradeoff.

50. Child routes (nested)  
- Goal: nested routing layout.  
- Steps: configure `children` in routes and add outlet in parent.  
- Hint: useful for tabs or dashboard layouts.

51. Route resolvers  
- Goal: fetch data before activation.  
- Steps: implement `Resolve<T>` and add `resolve` to route.  
- Hint: data available via `route.data`.

52. Router animations  
- Goal: animate transitions.  
- Steps: import `BrowserAnimationsModule`, set animations on host and route change.  
- Hint: use transition states keyed by route.

53. Component communication patterns  
- Goal: review communication approaches.  
- Steps: implement `@Input/@Output`, service, shared state, router.  
- Hint: pick based on coupling.

54. Content projection (ng-content)  
- Goal: transclude content.  
- Steps: use `<ng-content>` and `select` for slots.  
- Hint: supports reusable wrapper components.

55. Dynamic component creation  
- Goal: instantiate at runtime.  
- Steps: get `ViewContainerRef`, call `createComponent()`.  
- Hint: pass inputs after creation.

56. HostBinding & HostListener  
- Goal: interact with host element.  
- Steps: `@HostBinding('class.active') active`, `@HostListener('click')`.  
- Hint: keeps logic in directive/class.

57. ElementRef & Renderer2  
- Goal: safe DOM updates.  
- Steps: inject `Renderer2` and use `setStyle`, `setProperty`.  
- Hint: avoid direct `nativeElement` access for SSR/security.

58. Component unit testing  
- Goal: basic component spec.  
- Steps: use `TestBed`, `createComponent`, `fixture.detectChanges()`.  
- Hint: test inputs, outputs, and DOM.

59. Service unit testing  
- Goal: test injectable logic.  
- Steps: `TestBed.configureTestingModule({})`, `TestBed.inject(Service)`.  
- Hint: use spies for dependencies.

60. HTTP testing (HttpTestingController)  
- Goal: mock HTTP requests.  
- Steps: import `HttpClientTestingModule`, use `HttpTestingController.expectOne()`.  
- Hint: flush mocked response.

61. E2E tests (Playwright/Cypress)  
- Goal: end-to-end flow validation.  
- Steps: install runner, write basic navigation test, run.  
- Hint: prefer Playwright for modern setups.

62. Angular CLI schematics  
- Goal: use generators.  
- Steps: `ng generate component name`.  
- Hint: customize schematic options.

63. Linting & formatting (ESLint/Prettier)  
- Goal: consistent code style.  
- Steps: add configs, run `ng lint`/`eslint`.  
- Hint: integrate with pre-commit hooks.

64. Environment config  
- Goal: different envs for build.  
- Steps: use `environment.ts` and `fileReplacements`.  
- Hint: inject env values via `import { environment }`.

65. i18n basics  
- Goal: localize strings.  
- Steps: use `$localize` or Angular i18n extraction.  
- Hint: extract messages and build per locale.

66. Accessibility basics (a11y)  
- Goal: improve keyboard & ARIA support.  
- Steps: add roles, aria-labels, focus management.  
- Hint: test with screen reader and Lighthouse.

67. i18n pluralization & ICU  
- Goal: plural handling in templates.  
- Steps: use ICU syntax in i18n messages.  
- Hint: test translations for edge cases.

68. Animations (advanced)  
- Goal: fine-grained animated states.  
- Steps: define triggers, states, transitions, use `animate()`.  
- Hint: keep animations performant.

69. Lazy images & responsive srcset  
- Goal: optimize images.  
- Steps: use `loading="lazy"`, `<picture>` and `srcset`.  
- Hint: reduce initial load.

70. Web Workers  
- Goal: offload heavy computation.  
- Steps: `ng generate web-worker`, use `postMessage`.  
- Hint: worker cannot access DOM.

71. Progressive Web App (PWA)  
- Goal: add offline support.  
- Steps: `ng add @angular/pwa`.  
- Hint: configure `ngsw-config.json`.

72. Service Worker caching strategies  
- Goal: tune caching.  
- Steps: edit `ngsw-config.json` asset/dataGroups.  
- Hint: pick freshness vs cache-first.

73. Authentication flow basics  
- Goal: login + guard skeleton.  
- Steps: auth service, token storage, `CanActivate` guard.  
- Hint: store tokens securely (e.g., HttpOnly cookies via backend).

74. OAuth/OIDC integration  
- Goal: external auth (e.g., Google).  
- Steps: use `angular-oauth2-oidc` or similar, configure redirect URIs.  
- Hint: handle token refresh.

75. Role‑based UI  
- Goal: show/hide by roles.  
- Steps: auth service stores roles, use `*ngIf="auth.hasRole('admin')"` .  
- Hint: guard routes as well.

76. File upload with progress  
- Goal: upload files and show progress.  
- Steps: `FormData`, `HttpClient.post` with `{reportProgress: true, observe: 'events'}`.  
- Hint: handle `HttpEventType.UploadProgress`.

77. WebSocket / Realtime updates  
- Goal: receive live updates.  
- Steps: use native `WebSocket` or `rxjs/webSocket`.  
- Hint: manage reconnect logic.

78. NgRx store intro  
- Goal: central state management.  
- Steps: install `@ngrx/store`, create actions, reducer, selectors.  
- Hint: start small (cart or todos).

79. NgRx Effects  
- Goal: handle side effects (HTTP).  
- Steps: add `@ngrx/effects`, define effect with `createEffect()`.  
- Hint: keep components free of side effects.

80. Performance: OnPush change detection  
- Goal: optimize change detection.  
- Steps: `changeDetection: ChangeDetectionStrategy.OnPush` and immutable inputs.  
- Hint: use `markForCheck()` when needed.

81. TrackBy in *ngFor  
- Goal: optimize list re-rendering.  
- Steps: add `trackBy` function returning unique id.  
- Hint: improves performance on updates.

82. Virtual scrolling (CDK)  
- Goal: render large lists efficiently.  
- Steps: install `@angular/cdk`, use `cdk-virtual-scroll-viewport`.  
- Hint: tune itemSize.

83. Bundle analysis  
- Goal: inspect bundle size.  
- Steps: `ng build --stats-json`, analyze with `source-map-explorer` or `webpack-bundle-analyzer`.  
- Hint: identify large libs for lazy loading.

84. Lazy load assets & code splitting  
- Goal: defer non-critical code.  
- Steps: dynamic imports `import('./heavy').then(m=>...)`.  
- Hint: lazy images + fonts too.

85. Server‑Side Rendering (Universal)  
- Goal: SSR for SEO and perf.  
- Steps: `ng add @nguniversal/express-engine`, build server bundle.  
- Hint: handle browser-only APIs with `isPlatformBrowser`.

86. TransferState (SSR → Client)  
- Goal: hydrate SSR-fetched data.  
- Steps: use `TransferState` with `makeStateKey`.  
- Hint: reduces duplicate HTTP calls.

87. SEO basics & Meta service  
- Goal: set meta tags and titles.  
- Steps: inject `Title`, `Meta`, update per route.  
- Hint: use SSR or prerender for crawlers.

88. XSS protection  
- Goal: avoid unsafe HTML.  
- Steps: use interpolation/template binding, avoid `innerHTML` unless sanitized.  
- Hint: use `DomSanitizer` only when necessary.

89. Content Security Policy (CSP) basics  
- Goal: reduce injection risks.  
- Steps: set CSP headers on server, avoid inline scripts/styles.  
- Hint: test with browser devtools.

90. Dependency updates and migrations  
- Goal: keep project current.  
- Steps: `ng update @angular/cli @angular/core`, follow changelogs.  
- Hint: run tests after upgrade.

91. Create an Angular library  
- Goal: share code across apps.  
- Steps: `ng generate library my-lib`, build and link.  
- Hint: maintain clear public API.

92. Publish package (npm/GitHub Packages)  
- Goal: publish library.  
- Steps: build, set `package.json`, `npm publish` or use GH Packages.  
- Hint: use semantic versioning.

93. CI with GitHub Actions  
- Goal: automate build & tests.  
- Steps: add `.github/workflows/ci.yml` to run `npm install`, `ng build`, `ng test`.  
- Hint: cache node_modules for speed.

94. Automated deploy (Netlify/Pages)  
- Goal: deploy on push.  
- Steps: configure deploy pipeline or action to build and push to host.  
- Hint: use `ng deploy` adapter where available.

95. Code splitting & route chunk naming  
- Goal: better caching & debugging.  
- Steps: name lazy chunks with webpack magic comments.  
- Hint: ensure small initial payload.

96. Image optimization pipeline  
- Goal: optimize production assets.  
- Steps: use tools like `sharp` in build pipeline or external image CDN.  
- Hint: generate multiple sizes and use `srcset`.

97. Major version upgrade process  
- Goal: migrate across major Angular versions.  
- Steps: read changelog, `ng update`, fix breaking changes.  
- Hint: upgrade CLI first.

98. Debug SSR Node process  
- Goal: attach debugger to server bundle.  
- Steps: run `node --inspect=9229 dist/server/main.js`, attach from VS Code.  
- Hint: set source maps for easier debugging.

99. Performance monitoring (web-vitals)  
- Goal: capture real user metrics.  
- Steps: integrate `web-vitals` and send to analytics.  
- Hint: measure LCP, FID, CLS.

100. Capstone project  
- Goal: build a full-featured app combining multiple topics.  
- Steps: pick project (e‑commerce/blog/dashboard), implement routing, forms, HTTP, state, tests, SSR, CI, deploy.  
- Hint: break into small milestones; commit frequently.

---

Usage suggestions
- Do one exercise per commit.  
- Use StackBlitz for quick prototypes: "$BROWSER" https://stackblitz.com  
- Reference official docs: "$BROWSER" https://angular.io/tutorial

If you want a 4‑week schedule splitting these 100 exercises or scaffolds for specific exercises (numbers), request the subset number(s).