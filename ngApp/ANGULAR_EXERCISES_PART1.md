// ...existing code...
# Angular Exercises — Part 1 (1–25)

Each exercise follows:
- Goal  
- Steps (point wise)  
- Best example (short, focused)  
- Brief explanation (why it matters)  
- Complete working code (copy-paste ready)  
- Learning tips (beginner guidance)

---

1) Create app
- Goal: scaffold and run a new Angular app (standalone).
- Steps:
  1. Install Angular CLI if missing: `npm install -g @angular/cli`
  2. Scaffold: `ng new demo --standalone --style=css`
  3. Enter folder: `cd demo`
  4. Serve: `ng serve --open`
- Best example: CLI-created working app.
- Brief explanation: generates app structure and runs dev server.
- Complete working code:
```bash
# filepath: /workspaces/angHub/ngApp/commands.sh
ng new demo --standalone --style=css
cd demo
ng serve --open
```
- Learning tips:
  - Ensure Node.js and npm versions are compatible with Angular CLI.
  - Use --standalone to practice new Angular patterns.
  - If ng serve fails, run ng update or reinstall node_modules.

---

2) Hello world
- Goal: display simple text in root template.
- Steps:
  1. Open `src/app/app.component.html`
  2. Replace content with greeting text
  3. Save and view in browser
- Best example: "Hello Angular".
- Brief explanation: verifies dev server & template system.
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<h1>Hello Angular</h1>
<p>App served from local dev server</p>
```
- Learning tips:
  - Reload the browser if live reload isn't applied.
  - Inspect DOM with DevTools to confirm component rendered.
  - Keep templates small while experimenting.

---

3) Make App standalone
- Goal: convert root component to standalone.
- Steps:
  1. Edit component to include `standalone: true`
  2. Add any used directives/pipes to `imports`
  3. Ensure `main.ts` bootstraps the component using `bootstrapApplication`
- Best example: app component exposing a fruit list and router outlet.
- Brief explanation: standalone components reduce NgModule boilerplate.
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  fruit = ['mango', 'banana', 'grapes'];
}
```
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<h1>Welcome to Demo App</h1>

<h2>Fruit list</h2>
<ul>
  <li *ngFor="let f of fruit; let i = index">{{ i + 1 }}. {{ f }}</li>
</ul>

<router-outlet></router-outlet>
```
- Learning tips:
  - Use standalone components for simpler bootstrapping in new apps.
  - Add only needed CommonModule directives (NgIf, NgFor) to imports.
  - Keep main.ts minimal by bootstrapping a standalone component.

---

4) Create child component
- Goal: make a reusable child component.
- Steps:
  1. Generate: `ng generate component hello --standalone` OR create files manually
  2. Use selector `<app-hello>` in parent
- Best example: greeting component with @Input
- Brief explanation: child encapsulates UI logic.
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/hello.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: `<p>Hello {{ name }}!</p>`,
})
export class HelloComponent {
  @Input() name = 'Guest';
}
```
- Learning tips:
  - Use standalone flag when generating to avoid NgModule edits.
  - Keep child components focused on a single responsibility.
  - Export and reuse components across pages when appropriate.

---

5) Parent → Child (@Input)
- Goal: pass data parent → child.
- Steps:
  1. Add `@Input()` in child
  2. Bind `[name]="value"` in parent template
- Best example: pass `userName` string
- Brief explanation: Input exposes property to parent.
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html (snippet) -->
<app-hello [name]="userName"></app-hello>
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts (snippet)
userName = 'Student';
```
- Learning tips:
  - Validate input types and provide sensible defaults.
  - Prefer immutable inputs to simplify change detection.
  - Use Input aliasing sparingly for clearer APIs.

---

6) Child → Parent (@Output)
- Goal: child emits events to parent.
- Steps:
  1. Create `@Output()` EventEmitter in child
  2. Emit events from child
  3. Parent listens with `(selected)="onSelected($event)"`
- Best example: child sends selected value
- Brief explanation: @Output enables child→parent communication.
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/item.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item',
  standalone: true,
  template: `<button (click)="select('ok')">Select</button>`,
})
export class ItemComponent {
  @Output() selected = new EventEmitter<string>();
  select(value: string) { this.selected.emit(value); }
}
```
```html
<!-- usage in parent template -->
<app-item (selected)="onSelected($event)"></app-item>
```
```typescript
// parent method
onSelected(value: string) { console.log('child emitted', value); }
```
- Learning tips:
  - Unsubscribe when using EventEmitter observables inside components if you subscribe.
  - Keep emitted payloads small and well-typed.
  - Use custom event names to avoid confusion with DOM events.

---

7) Render list (*ngFor)
- Goal: display array items in template.
- Steps:
  1. Define array in component
  2. Use `*ngFor` with optional `trackBy`
- Best example: fruit list
- Brief explanation: repeats DOM nodes per array item
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html (list snippet) -->
<ul>
  <li *ngFor="let f of fruit; let i = index; trackBy: trackByIndex">
    {{ i + 1 }}. {{ f }}
  </li>
</ul>
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts (snippet)
trackByIndex(index: number, item: string) { return index; }
```
- Learning tips:
  - Use trackBy when rendering large lists to improve performance.
  - Keep templates simple; compute heavy logic in component class.
  - For objects, return a stable id from trackBy, not the index.

---

8) Conditional (*ngIf)
- Goal: toggle UI presence.
- Steps:
  1. Add boolean field in component
  2. Use `*ngIf` or `*ngIf; else` in template
- Best example: toggle panel visibility
- Brief explanation: removes/inserts DOM nodes conditionally
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html (snippet) -->
<button (click)="visible = !visible">Toggle</button>
<div *ngIf="visible; else hiddenTpl">I am visible</div>
<ng-template #hiddenTpl><div>Hidden</div></ng-template>
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts (snippet)
visible = true;
```
- Learning tips:
  - Use *ngIf for structural changes; use CSS for visual toggles to preserve state.
  - Combine with else/template for clear fallbacks.
  - Avoid complex expressions inside the directive — compute booleans in component.

---

9) Property binding
- Goal: bind component data to DOM properties.
- Steps:
  1. Use `[property]="value"` syntax
- Best example: disable button or bind image src
- Brief explanation: updates DOM properties from component state
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html (snippet) -->
<button [disabled]="isDisabled">Submit</button>
<img [src]="imageUrl" alt="photo" />
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts (snippet)
isDisabled = false;
imageUrl = 'assets/photo.jpg';
```
- Learning tips:
  - Prefer property binding over attribute binding when possible.
  - Use safe navigation (?.) for nested object properties to avoid errors.
  - Test bindings in different states (undefined/null) to ensure robustness.

---

10) Event binding
- Goal: respond to DOM events.
- Steps:
  1. Use `(event)="handler($event)"`
- Best example: click handler
- Brief explanation: maps DOM events to methods
- Complete working code:
```html
<button (click)="onClick($event)">Click me</button>
```
```typescript
onClick(e: Event) { console.log('clicked', e); }
```
- Learning tips:
  - Use $event typing (MouseEvent, KeyboardEvent) in handlers for better IntelliSense.
  - Debounce high-frequency events (input, scroll) if needed.
  - Keep handlers small and delegate heavy logic to services.

---

11) Two‑way binding (ngModel)
- Goal: sync input value bidirectionally.
- Steps:
  1. Import `FormsModule` (or NgModel) into component `imports` if standalone
  2. Use `[(ngModel)]="prop"` and include `name` attribute
- Best example: live greeting update
- Brief explanation: keeps model and view in sync
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `<input [(ngModel)]="userName" name="userName" /><p>Hello {{ userName }}</p>`
})
export class AppComponent {
  userName = 'Alice';
}
```
- Learning tips:
  - Use reactive forms for complex validation; ngModel is great for simple cases.
  - Always add a name attribute when using ngModel inside forms.
  - Watch out for two-way binding on objects — consider immutability.

---

12) Template reference variables
- Goal: access element values without a model.
- Steps:
  1. Add `#ref` on element
  2. Use `ref.value` in handler
- Best example: read input value
- Brief explanation: quick lightweight access
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<input #box placeholder="type" />
<button (click)="use(box.value)">Use</button>
```
```typescript
use(value: string) { console.log('value', value); }
```
- Learning tips:
  - Use refs for simple one-off reads to avoid creating form controls.
  - Refs cannot be used to get component class instances unless applied to component selectors.
  - For repeated or validated inputs, prefer forms.

---

13) Interpolation expressions
- Goal: show data and simple computed values.
- Steps:
  1. Use `{{ expression }}` in template (keep simple)
- Best example: show user name & counts
- Brief explanation: template interpolation runs safe expressions
- Complete working code:
```html
<p>{{ user?.name }} — Total: {{ items.length + bonus }}</p>
```
- Learning tips:
  - Keep expressions side-effect free and cheap to compute.
  - For expensive computations, compute in component and bind the result.
  - Use safe navigation operator to avoid errors.

---

14) Built‑in pipes
- Goal: format values for display.
- Steps:
  1. Use `|` with pipe name and optional args
- Best example: date & uppercase
- Brief explanation: synchronous format helpers
- Complete working code:
```html
<p>{{ today | date:'short' }}</p>
<p>{{ title | uppercase }}</p>
```
```typescript
today = new Date();
title = 'welcome';
```
- Learning tips:
  - Prefer pipes for display-only transformations.
  - Create pure pipes for predictable behavior and performance.
  - Remember some pipes (like async) are impure and behave differently.

---

15) Custom pipe
- Goal: implement reusable transform.
- Steps:
  1. Create `@Pipe({standalone:true})` implementing `PipeTransform`
  2. Use pipe in template
- Best example: truncate long text
- Brief explanation: use like built-in pipes
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, len = 20): string | null | undefined {
    if (!value) return value;
    return value.length > len ? value.slice(0, len) + '...' : value;
  }
}
```
```html
<!-- usage -->
<p>{{ longText | truncate:30 }}</p>
```
- Learning tips:
  - Mark pipes pure unless they depend on external state.
  - Write unit tests for pipe logic.
  - Reuse pipes for consistent formatting across the app.

---

16) Structural directive (*appUnless)
- Goal: show template when condition is false (inverse of *ngIf).
- Steps:
  1. Create directive using TemplateRef & ViewContainerRef
  2. Provide input setter that inserts/removes view
- Best example: show login prompt when not logged in
- Brief explanation: control DOM insertion programmatically
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/unless.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appUnless]' })
export class UnlessDirective {
  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}
  @Input() set appUnless(condition: boolean) {
    this.vcr.clear();
    if (!condition) this.vcr.createEmbeddedView(this.tpl);
  }
}
```
- Learning tips:
  - Test structural directives both true and false branches.
  - Avoid complex logic in directive setters — delegate to services when needed.
  - Provide clear naming to indicate behavior.

---

17) Attribute directive (host styling)
- Goal: change element appearance/behavior via directive.
- Steps:
  1. Create directive with `@HostBinding` and `@HostListener`
  2. Accept input to configure
- Best example: highlight on hover
- Brief explanation: add behavior to any element
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/highlight.directive.ts
import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @Input('appHighlight') color = 'yellow';
  @HostBinding('style.background') bg?: string;

  @HostListener('mouseenter') onEnter() { this.bg = this.color; }
  @HostListener('mouseleave') onLeave() { this.bg = undefined; }
}
```
- Learning tips:
  - Keep directives reusable and configuration-driven.
  - Use HostBinding to change classes/styles in a safe way.
  - Prefer CSS classes for complex styling and use directives to toggle them.

---

18) Lifecycle hooks
- Goal: react to init, view init, destroy events.
- Steps:
  1. Implement lifecycle methods: ngOnInit, ngAfterViewInit, ngOnDestroy
  2. Use for setup and cleanup (unsubscribe)
- Best example: subscribe in ngOnInit and cleanup in ngOnDestroy
- Brief explanation: manage component lifecycle resources
- Complete working code:
```typescript
ngOnInit() { console.log('component init'); }
ngAfterViewInit() { console.log('view init'); }
ngOnDestroy() { console.log('component destroyed'); }
```
- Learning tips:
  - Always unsubscribe from subscriptions in ngOnDestroy.
  - Use OnPush change detection with caution and understand lifecycle implications.
  - Use lifecycle hooks for side-effects, not for template logic.

---

19) ViewChild usage
- Goal: access child component/element instance.
- Steps:
  1. Add `#child` in template or query by component type
  2. Use `@ViewChild('child') childRef` and access after view init
- Best example: call child method
- Brief explanation: parent can interact with child API
- Complete working code:
```html
<!-- parent template -->
<app-child #childComp></app-child>
```
```typescript
// parent component
@ViewChild('childComp') childComp!: any;
ngAfterViewInit() { this.childComp.doSomething(); }
```
- Learning tips:
  - Use ViewChild sparingly — prefer Input/Output for loose coupling.
  - Access ViewChild only after view init to avoid undefined references.
  - Type the ViewChild reference for better tooling support.

---

20) ContentChild usage
- Goal: access projected content inside a wrapper component.
- Steps:
  1. Use `<ng-content>` in wrapper
  2. Query projected node with `@ContentChild`
- Best example: card reading title slot
- Brief explanation: access elements consumers project into your component
- Complete working code:
```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/card.component.html -->
<div class="card">
  <div class="card-title"><ng-content select="[card-title]"></ng-content></div>
  <div class="card-body"><ng-content></ng-content></div>
</div>
```
```html
<!-- usage -->
<app-card>
  <h3 card-title>Title</h3>
  <p>Body</p>
</app-card>
```
- Learning tips:
  - Use content projection for flexible component APIs.
  - Query projected content in ngAfterContentInit for safety.
  - Combine with ContentChildren for multiple projected elements.

---

21) Create service & DI
- Goal: centralize logic via injectable service.
- Steps:
  1. Create service annotated `@Injectable({providedIn:'root'})`
  2. Inject into components via constructor
- Best example: simple ApiService wrapping HttpClient
- Brief explanation: services share logic/data across app
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  getPosts(): Observable<any[]> { return this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts'); }
  postItem(payload: any) { return this.http.post('/api/items', payload); }
}
```
- Learning tips:
  - Keep services stateless when possible; use Subjects for state.
  - Inject HttpClient only in services, not in many components.
  - Write unit tests for service logic using HttpTestingController.

---

22) Shared counter service
- Goal: share mutable state between components.
- Steps:
  1. Create service with state and methods
  2. Inject the same service into multiple components
- Best example: counter with inc/dec
- Brief explanation: service instance provided in root is shared
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/counter.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  value = 0;
  inc() { this.value++; }
  dec() { this.value--; }
}
```
- Learning tips:
  - For UI updates use BehaviorSubject instead of raw properties.
  - Avoid direct mutation across components; expose methods.
  - Consider persistence (localStorage) for longer-lived state.

---

23) Provider scope (hierarchical)
- Goal: scope service to component subtree.
- Steps:
  1. Add `providers: [Service]` to a component decorator
  2. Child components get the scoped instance
- Best example: per-widget service
- Brief explanation: Angular injector hierarchy allows multiple instances
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/widget.component.ts
import { Component } from '@angular/core';
import { WidgetService } from './widget.service';

@Component({
  selector: 'app-widget',
  template: `<p>Widget</p>`,
  providers: [WidgetService]
})
export class WidgetComponent {}
```
- Learning tips:
  - Use scoped providers when you need isolated state per component tree.
  - Understand difference between providedIn: 'root' and component providers.
  - Beware memory leaks when creating many provider instances.

---

24) HTTP GET
- Goal: fetch JSON data from API.
- Steps:
  1. Ensure `HttpClientModule` imported in app bootstrap
  2. Inject `HttpClient` in service/component
  3. Call `http.get<T>(url)` and subscribe or return observable
- Best example: fetch posts
- Brief explanation: HttpClient returns Observables
- Complete working code:
```typescript
// usage in ApiService (see file above)
this.api.getPosts().subscribe(posts => { this.posts = posts; });
```
- Learning tips:
  - Use typed interfaces for API responses for safety.
  - Handle errors with catchError and show user-friendly messages.
  - Prefer returning Observables from services and subscribe in components.

---

25) HTTP POST
- Goal: send data to server endpoint.
- Steps:
  1. Build payload object
  2. Call `http.post(url, payload)`
  3. Handle response and errors
- Best example: create new item
- Brief explanation: POST typically returns created resource or status
- Complete working code:
```typescript
// usage in ApiService.postItem()
const payload = { title: 'New item', body: '...' };
this.api.postItem(payload).subscribe(resp => console.log('created', resp));
```
- Learning tips:
  - Validate and sanitize payload on the client side before sending.
  - Use optimistic UI updates carefully and roll back on failure.
  - Secure endpoints; never store sensitive tokens in plain localStorage.

---

End of Part 1 (1–25).

If you want Part 2–4 formatted the same way with complete code snippets saved to their respective files, confirm and I will generate and save them.