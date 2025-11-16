# Angular 100 Exercises — Solutions (concise)

This file provides short, practical solutions or code hints for each of the 100 exercises. Use each entry as a starting point; expand into full components/services/modules in your workspace as needed.

1. Create app  
- Solution: `ng new demo --standalone --routing=false --style=css` then `cd demo` and `ng serve --open`.

2. Hello world  
- Solution: edit `src/app/app.component.html` to: `Hello Angular`.

3. Make App standalone  
- Solution: in root component add `standalone: true` to `@Component` and remove NgModule.

4. Create child component  
- Solution: `ng generate component hello --standalone` or:
```ts
@Component({ selector: 'app-hello', standalone: true, template: `<p>Hello</p>` })
export class HelloComponent {}
```

5. Parent → Child (@Input)  
- Solution:
```ts
@Input() name = '';
<!-- parent --> <app-hello [name]="username"></app-hello>
```

6. Child → Parent (@Output)  
- Solution:
```ts
@Output() selected = new EventEmitter<string>();
this.selected.emit(value);
// parent: <app-child (selected)="onSelected($event)"></app-child>
```

7. Render list (*ngFor)  
- Solution:
```html
<ul><li *ngFor="let i of items">{{i}}</li></ul>
```

8. Conditional (*ngIf)  
- Solution:
```html
<div *ngIf="visible; else no">Visible</div><ng-template #no>Hidden</ng-template>
```

9. Property binding  
- Solution:
```html
<button [disabled]="isDisabled">Do</button>
<img [src]="imgUrl" />
```

10. Event binding  
- Solution:
```html
<button (click)="doSomething($event)">Click</button>
```

11. Two‑way binding (ngModel)  
- Solution: import `FormsModule` or `NgModel`, then:
```html
<input [(ngModel)]="name" name="name" />
```

12. Template reference variables  
- Solution:
```html
<input #box /><button (click)="use(box.value)">Go</button>
```

13. Interpolation expressions  
- Solution:
```html
<p>{{ user?.name }} — Total: {{ getTotal() }}</p>
```
- Note: avoid heavy work in `getTotal()`.

14. Built‑in pipes  
- Solution:
```html
{{ dateValue | date:'short' }} {{ name | uppercase }}
```

15. Custom pipe  
- Solution:
```ts
@Pipe({name:'truncate', standalone:true})
export class TruncatePipe implements PipeTransform {
  transform(v:string, len=20){ return v?.length>len? v.slice(0,len)+'...': v; }
}
```

16. Structural directive (*appUnless)  
- Solution: directive using `TemplateRef` and `ViewContainerRef` to show/hide template.

17. Attribute directive (host styling)  
- Solution:
```ts
@Directive({selector:'[appHighlight]'})
export class Highlight { @HostBinding('style.background') bg=''; @Input() set appHighlight(c:string){ this.bg=c; } }
```

18. Lifecycle hooks  
- Solution: implement `OnInit`, `OnDestroy`:
```ts
ngOnInit(){ /* init */ } ngOnDestroy(){ /* cleanup */ }
```

19. ViewChild usage  
- Solution:
```ts
@ViewChild('child') childRef!: ChildComponent;
ngAfterViewInit(){ console.log(this.childRef); }
```

20. ContentChild usage  
- Solution: `<ng-content></ng-content>` and `@ContentChild('slot') slotRef`.

21. Create service & DI  
- Solution:
```ts
@Injectable({providedIn:'root'}) export class ApiService { constructor(private http:HttpClient){} }
```

22. Shared counter service  
- Solution:
```ts
@Injectable({providedIn:'root'}) export class Counter { value=0; inc(){ this.value++; } }
```

23. Provider scope (hierarchical)  
- Solution: add `providers:[MyService]` to component metadata to scope instance.

24. HTTP GET  
- Solution:
```ts
this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts').subscribe(...)
```

25. HTTP POST  
- Solution:
```ts
this.http.post(url, payload).subscribe(...)
```

26. HTTP error handling  
- Solution:
```ts
this.http.get(url).pipe(catchError(err=>of([]))).subscribe(...)
```

27. HttpInterceptor  
- Solution: implement `HttpInterceptor.intercept(req, next)` clone the request and `return next.handle(modifiedReq)`; provide via `HTTP_INTERCEPTORS`.

28. Reactive forms basics  
- Solution:
```ts
form = new FormGroup({ name: new FormControl('') });
// template: <form [formGroup]="form"><input formControlName="name"></form>
```

29. Reactive form validation  
- Solution:
```ts
new FormControl('', [Validators.required, Validators.minLength(3)]);
```
Check `control.invalid && control.touched`.

30. Template‑driven form  
- Solution:
```html
<form #f="ngForm" (ngSubmit)="submit(f)">
  <input name="email" ngModel required />
</form>
```

31. Custom synchronous validator  
- Solution:
```ts
function noSpace(control:AbstractControl){ return /\s/.test(control.value) ? {hasSpace:true}:null; }
```

32. Async validator  
- Solution: return `Observable<ValidationErrors|null>` and use with `asyncValidators` or control option.

33. FormArray dynamic controls  
- Solution:
```ts
addresses = new FormArray([new FormControl('')]);
addresses.push(new FormControl(''));
```

34. Debounced search (Reactive)  
- Solution:
```ts
control.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), switchMap(q=>this.search(q))).subscribe(...)
```

35. RxJS basics: Observables  
- Solution:
```ts
of(1,2,3).subscribe(x=>console.log(x));
```

36. RxJS map & filter  
- Solution:
```ts
obs.pipe(filter(x=>x>0), map(x=>x*2)).subscribe(...)
```

37. switchMap vs mergeMap  
- Solution: use `switchMap` for cancelling previous requests (search), `mergeMap` for parallel.

38. combineLatest  
- Solution:
```ts
combineLatest([obs1, obs2]).pipe(map(([a,b])=>...)).subscribe(...)
```

39. Subject & BehaviorSubject  
- Solution:
```ts
const s = new BehaviorSubject(0); s.next(1); s.subscribe(...)
```

40. Signals: intro  
- Solution:
```ts
const count = signal(0); count.set(1); // in template use count()
```

41. Signals: derived/computed  
- Solution:
```ts
const double = computed(()=> count() * 2);
```

42. Signals in services  
- Solution: expose `signal()` from service and update via `signal.set()`/`update()`.

43. Routing basics  
- Solution:
```ts
const routes: Routes=[{path:'',component:Home}];
RouterModule.forRoot(routes);
```

44. RouterLink & navigation  
- Solution:
```html
<a [routerLink]="['/about']">About</a>
// programmatic: this.router.navigate(['/about']);
```

45. Route parameters  
- Solution:
```ts
this.route.paramMap.pipe(map(m=>m.get('id')), switchMap(id=>this.load(id)));
```

46. Query parameters  
- Solution:
```ts
this.router.navigate(['/search'], { queryParams: { q:'term' } });
this.route.queryParamMap.subscribe(m=>m.get('q'));
```

47. Route guards (CanActivate)  
- Solution:
```ts
@Injectable() export class AuthGuard implements CanActivate { canActivate(){ return !!this.auth.user; } }
```

48. Lazy loading modules  
- Solution:
```ts
{ path:'shop', loadChildren:() => import('./shop/shop.module').then(m=>m.ShopModule) }
```

49. Preloading strategies  
- Solution: add `{ preloadingStrategy: PreloadAllModules }` to RouterModule.forRoot.

50. Child routes (nested)  
- Solution: define `children: [...]` on parent route and include `<router-outlet>` in parent component.

51. Route resolvers  
- Solution:
```ts
@Injectable() class MyResolver implements Resolve<Data> { resolve(){ return this.service.getData(); } }
```

52. Router animations  
- Solution: use `@angular/animations` and bind route outlet to animation state.

53. Component communication patterns  
- Solution: use `@Input/@Output` for parent-child, service for non-related components, router for navigation/state.

54. Content projection (ng-content)  
- Solution:
```html
<ng-content select="[title]"></ng-content>
```
Use slot attributes in consumer.

55. Dynamic component creation  
- Solution:
```ts
const ref = vcr.createComponent(MyComp);
ref.instance.input = value;
```

56. HostBinding & HostListener  
- Solution:
```ts
@HostBinding('class.active') isActive=true;
@HostListener('click') onClick(){}
```

57. ElementRef & Renderer2  
- Solution:
```ts
this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
```

58. Component unit testing  
- Solution:
```ts
TestBed.configureTestingModule({declarations:[MyComp]}).compileComponents();
const fixture = TestBed.createComponent(MyComp); fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('...');
```

59. Service unit testing  
- Solution:
```ts
TestBed.configureTestingModule({providers:[MyService]});
const s = TestBed.inject(MyService);
expect(s.method()).toBe(...);
```

60. HTTP testing (HttpTestingController)  
- Solution:
```ts
httpMock.expectOne(url).flush(mockData);
```

61. E2E tests (Playwright/Cypress)  
- Solution: install runner, create test to visit page and assert elements; run with `npx playwright test` or `npx cypress open`.

62. Angular CLI schematics  
- Solution: `ng generate component my-comp --standalone --style=css` and inspect generated files.

63. Linting & formatting (ESLint/Prettier)  
- Solution: add ESLint config, run `npx eslint .` and Prettier formatting rules.

64. Environment config  
- Solution: use `src/environments/environment.ts` and `fileReplacements` in `angular.json`.

65. i18n basics  
- Solution: mark strings with `$localize` or use `i18n` attribute and run `ng extract-i18n`.

66. Accessibility basics (a11y)  
- Solution: add `role`, `aria-*` attributes and keyboard handlers; test with Lighthouse.

67. i18n pluralization & ICU  
- Solution: use ICU syntax inside i18n blocks:
```
{count, plural, =0 {no items} =1 {one item} other {# items}}
```

68. Animations (advanced)  
- Solution: define `trigger`, `state`, `transition`, and animate in component metadata.

69. Lazy images & responsive srcset  
- Solution:
```html
<img loading="lazy" srcset="img-400.jpg 400w, img-800.jpg 800w" sizes="(max-width:600px) 400px, 800px" src="img-800.jpg" />
```

70. Web Workers  
- Solution: `ng generate web-worker` and use `postMessage()`/`onmessage` to offload CPU work.

71. Progressive Web App (PWA)  
- Solution: `ng add @angular/pwa` and configure manifest/ngsw-config.

72. Service Worker caching strategies  
- Solution: edit `ngsw-config.json` dataGroups and assetsGroups with `strategy: performance` or `freshness`.

73. Authentication flow basics  
- Solution: create AuthService with `login()` that stores token (prefer backend HttpOnly cookie) and guard routes.

74. OAuth/OIDC integration  
- Solution: use `angular-oauth2-oidc` and configure issuer, clientId, redirectUri; call `loadDiscoveryDocumentAndTryLogin()`.

75. Role‑based UI  
- Solution: AuthService exposes `hasRole(role)` and use `*ngIf="auth.hasRole('admin')"`; also guard routes.

76. File upload with progress  
- Solution:
```ts
const req = new HttpRequest('POST', url, formData, { reportProgress: true });
this.http.request(req).subscribe(event => { if(event.type===HttpEventType.UploadProgress) { /* percent */ }});
```

77. WebSocket / Realtime updates  
- Solution: `const ws = new WebSocket(url); ws.onmessage = e => { ... }` or `webSocket()` from rxjs/webSocket.

78. NgRx store intro  
- Solution: install `@ngrx/store`, define actions, reducer with `createReducer`, register with `StoreModule.forRoot({})`.

79. NgRx Effects  
- Solution: implement effects using `createEffect(() => this.actions.pipe(ofType(load), switchMap(...)))` and register `EffectsModule`.

80. Performance: OnPush change detection  
- Solution: set `changeDetection: ChangeDetectionStrategy.OnPush` and update inputs immutably.

81. TrackBy in *ngFor  
- Solution:
```html
<li *ngFor="let item of items; trackBy: trackById">{{item.name}}</li>
```
```ts
trackById(_, item){ return item.id; }
```

82. Virtual scrolling (CDK)  
- Solution: import `ScrollingModule`, use `<cdk-virtual-scroll-viewport itemSize="50">` with `*cdkVirtualFor`.

83. Bundle analysis  
- Solution: `ng build --configuration production --stats-json` then `npx source-map-explorer dist/.../main.*.js`.

84. Lazy load assets & code splitting  
- Solution: dynamic import:
```ts
const { HeavyModule } = await import('./heavy/heavy.module');
```

85. Server‑Side Rendering (Universal)  
- Solution: `ng add @nguniversal/express-engine`, then `npm run build:ssr` and `npm run serve:ssr`.

86. TransferState (SSR → Client)  
- Solution: use `TransferState` and `makeStateKey` to store server-fetched data and read on client to avoid duplicate requests.

87. SEO basics & Meta service  
- Solution:
```ts
this.title.setTitle('Page'); this.meta.updateTag({name:'description', content:'desc'});
```

88. XSS protection  
- Solution: avoid `innerHTML`; if necessary, sanitize with `DomSanitizer.bypassSecurityTrustHtml()` carefully.

89. Content Security Policy (CSP) basics  
- Solution: set `Content-Security-Policy` headers on server, avoid inline scripts/styles and use hashes or nonces if needed.

90. Dependency updates and migrations  
- Solution: `ng update @angular/cli @angular/core` and follow migration guide; run tests.

91. Create an Angular library  
- Solution: `ng generate library my-lib` then `ng build my-lib` and `npm pack` or `npm link` for local testing.

92. Publish package (npm/GitHub Packages)  
- Solution: set package `name`/`version`, build, then `npm publish` (or configure GH Packages registry and publish).

93. CI with GitHub Actions  
- Solution: add `.github/workflows/ci.yml` to run `npm ci`, `npm run build -- --configuration=production`, `npm test -- --watch=false`.

94. Automated deploy (Netlify/Pages)  
- Solution: configure deploy action or Netlify build command `ng build --configuration production` and publish `dist/` folder.

95. Code splitting & route chunk naming  
- Solution:
```ts
loadChildren: () => import(/* webpackChunkName: "shop" */ './shop/shop.module').then(m=>m.ShopModule)
```

96. Image optimization pipeline  
- Solution: integrate `sharp` or external CDN to generate responsive images and serve optimized formats (webp/avif).

97. Major version upgrade process  
- Solution: run `ng update @angular/cli @angular/core`, follow schematics, fix deprecations and run tests.

98. Debug SSR Node process  
- Solution: run `node --inspect=9229 dist/<app>/server/main.mjs` and attach from VS Code to port 9229.

99. Performance monitoring (web-vitals)  
- Solution: install `web-vitals`, call `getCLS/getFID/getLCP` and send metrics to analytics endpoint.

100. Capstone project  
- Solution: pick a project (e‑commerce/blog), break into features (auth, routing, forms, HTTP, state), implement iteratively, add tests/CI/SSR and deploy.

---

Usage notes
- Each solution is intentionally concise; expand into full files in your project.
- To open official docs or tools from the dev container use `"$BROWSER" <url>`, e.g. `"$BROWSER" https://angular.io/tutorial`.

If you want, I can:
- create the full scaffolding for a selected subset (specify numbers), or  
- open a new branch and commit this file to Git for you.
