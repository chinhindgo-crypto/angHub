# Angular Exercises — Part 2 (26–50)

Each exercise follows:
- Goal  
- Steps (point wise)  
- Best example (short, focused)  
- Brief explanation (why it matters)  
- Complete working code (copy-paste ready)  
- Learning tips (beginner guidance)

---

26) Template-driven forms
- Goal: build simple forms with ngModel and validation.
- Steps:
  1. Import `FormsModule` into component
  2. Add form element with `#form="ngForm"`
  3. Add inputs with `ngModel` and validation attributes
  4. Access form state via `form.valid`, `form.dirty`, etc.
- Best example: login form
- Brief explanation: quick validation without reactive form setup
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
      <div>
        <label>Email</label>
        <input 
          type="email" 
          name="email" 
          ngModel 
          required 
          #email="ngModelControl"
        />
        <span *ngIf="email.invalid && email.touched" class="error">
          Email required
        </span>
      </div>

      <div>
        <label>Password</label>
        <input 
          type="password" 
          name="password" 
          ngModel 
          required 
          minlength="6"
          #password="ngModelControl"
        />
        <span *ngIf="password.invalid && password.touched" class="error">
          Password must be at least 6 chars
        </span>
      </div>

      <button [disabled]="form.invalid">Login</button>
    </form>
  `,
  styles: [`
    .error { color: red; font-size: 0.9em; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class LoginComponent {
  onSubmit(data: any) {
    console.log('Form data:', data);
  }
}
```
- Learning tips:
  - Use ngForm for simple forms with light validation.
  - Always add `name` attribute to form controls for ngModel binding.
  - For complex validation logic, switch to reactive forms.

---

27) Reactive forms (FormGroup)
- Goal: build forms with fine-grained control.
- Steps:
  1. Import `ReactiveFormsModule`
  2. Create `FormGroup` with `FormControl`s
  3. Bind form with `[formGroup]`
  4. Access state via `.get()`, `.invalid`, etc.
- Best example: user registration form
- Brief explanation: powerful form management with observables
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/register.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label>Name</label>
        <input type="text" formControlName="name" />
        <span *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
          Name required
        </span>
      </div>

      <div>
        <label>Email</label>
        <input type="email" formControlName="email" />
        <span *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
          Valid email required
        </span>
      </div>

      <div formGroupName="address">
        <label>Street</label>
        <input type="text" formControlName="street" />
      </div>

      <button [disabled]="form.invalid">Register</button>
    </form>
  `
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    })
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form value:', this.form.value);
    }
  }
}
```
- Learning tips:
  - Use nested FormGroups for complex forms with sections.
  - Access controls via `form.get('controlName')` with safe navigation.
  - Listen to form changes with `form.valueChanges.subscribe(...)`.

---

28) Custom validators
- Goal: validate form fields with custom rules.
- Steps:
  1. Create validator function returning `ValidatorFn`
  2. Pass to `FormControl` constructor or `setValidators()`
  3. Display error messages in template
- Best example: password strength validator
- Brief explanation: extend validation beyond built-in rules
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/password.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    const passwordValid = hasUppercase && hasLowercase && hasNumber;
    return !passwordValid ? { weakPassword: true } : null;
  };
}
```
```typescript
// usage in component
import { passwordStrengthValidator } from './password.validator';

password: new FormControl('', [Validators.required, passwordStrengthValidator()])
```
- Learning tips:
  - Return `null` if validation passes.
  - Return object with error key if validation fails.
  - Test validators independently with unit tests.

---

29) Async validators
- Goal: validate fields via async operations (API call).
- Steps:
  1. Create async validator returning `Promise<ValidationErrors | null>`
  2. Pass to third argument of `FormControl`
  3. Monitor `pending` state while validating
- Best example: check username availability
- Brief explanation: validate against server without blocking
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/username.validator.ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export function usernameAvailabilityValidator(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return Promise.resolve(null);
    
    return http.get<{ available: boolean }>(`/api/check-username/${control.value}`)
      .pipe(
        map(res => res.available ? null : { usernameTaken: true })
      ).toPromise();
  };
}
```
```typescript
// usage
constructor(private http: HttpClient) {
  this.form = new FormGroup({
    username: new FormControl('', 
      [Validators.required],
      [usernameAvailabilityValidator(this.http)]
    )
  });
}
```
- Learning tips:
  - Debounce async validators to reduce server calls.
  - Show loading indicator while `control.pending` is true.
  - Cache results to avoid redundant validation calls.

---

30) Form arrays (dynamic fields)
- Goal: add/remove form fields dynamically.
- Steps:
  1. Use `FormArray` to hold dynamic controls
  2. Use `*ngFor` to render controls in template
  3. Call `push()` to add, `removeAt()` to delete
- Best example: add/remove email fields
- Brief explanation: manage variable-length form sections
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/multi-email.component.ts
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div formArrayName="emails">
        <div *ngFor="let email of emails.controls; let i = index" [formGroupName]="i">
          <input type="email" formControlName="email" />
          <button type="button" (click)="emails.removeAt(i)">Remove</button>
        </div>
      </div>

      <button type="button" (click)="addEmail()">Add Email</button>
      <button [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class MultiEmailComponent {
  form: FormGroup;

  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  constructor() {
    this.form = new FormGroup({
      emails: new FormArray([new FormControl('', Validators.email)])
    });
  }

  addEmail() {
    this.emails.push(new FormControl('', Validators.email));
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
```
- Learning tips:
  - Always cast FormArray result for type safety.
  - Use `[formGroupName]="i"` to bind nested groups by index.
  - Keep FormArray logic simple; move complexity to service if needed.

---

31) Form submission & reset
- Goal: handle form submit, clear, and manage submit state.
- Steps:
  1. Handle `(ngSubmit)` on form
  2. Check `form.valid` before processing
  3. Call `form.reset()` to clear after submit
- Best example: contact form with submit button
- Brief explanation: proper form lifecycle management
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/contact.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="text" formControlName="name" placeholder="Name" />
      <textarea formControlName="message" placeholder="Message"></textarea>
      
      <button [disabled]="isSubmitting">
        {{ isSubmitting ? 'Sending...' : 'Send' }}
      </button>
    </form>
    <div *ngIf="successMsg" class="success">{{ successMsg }}</div>
  `,
  styles: [`
    .success { color: green; margin-top: 10px; }
    button:disabled { opacity: 0.5; }
  `]
})
export class ContactComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  isSubmitting = false;
  successMsg = '';

  onSubmit() {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.form.value);
      this.successMsg = 'Message sent!';
      this.form.reset();
      this.isSubmitting = false;
    }, 2000);
  }
}
```
- Learning tips:
  - Disable submit button while processing to prevent double submission.
  - Show loading state to provide user feedback.
  - Reset form after successful submission for reuse.

---

32) Routing setup
- Goal: configure basic routing between pages.
- Steps:
  1. Define routes array with `path` and `component`
  2. Use `provideRouter()` in bootstrap
  3. Add `<router-outlet>` in app component
- Best example: home, about, contact pages
- Brief explanation: Single Page App navigation
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { ContactComponent } from './pages/contact.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent }
];
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
```
- Learning tips:
  - Place wildcard route (`**`) last to catch undefined routes.
  - Use lazy loading for feature modules to improve initial load.
  - Test routing with `ng e2e` or manual navigation.

---

33) RouterLink navigation
- Goal: navigate between routes using links.
- Steps:
  1. Import `RouterLink` in component
  2. Use `[routerLink]="path"` on link elements
  3. Optionally bind active route with `routerLinkActive`
- Best example: navbar with links
- Brief explanation: declarative navigation without manual routing
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/navbar.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        Home
      </a>
      <a routerLink="/about" routerLinkActive="active">
        About
      </a>
      <a routerLink="/contact" routerLinkActive="active">
        Contact
      </a>
    </nav>
  `,
  styles: [`
    nav { display: flex; gap: 20px; }
    a.active { font-weight: bold; color: blue; }
  `]
})
export class NavbarComponent {}
```
- Learning tips:
  - Use `[routerLinkActiveOptions]="{ exact: true }"` to avoid matching parent routes.
  - Combine with `routerLinkActive` to highlight current page.
  - Use absolute paths for clarity.

---

34) Programmatic navigation (Router)
- Goal: navigate from component code using Router service.
- Steps:
  1. Inject `Router` in component
  2. Call `router.navigate([path])` or `navigateByUrl(url)`
  3. Pass route params in array if needed
- Best example: redirect after login
- Brief explanation: imperative navigation for complex flows
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="username" name="username" placeholder="Username" />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" />
      <button>Login</button>
    </form>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.username && this.password) {
      console.log('Logged in:', this.username);
      this.router.navigate(['/dashboard']);
    }
  }
}
```
- Learning tips:
  - Use `navigate()` for relative and absolute paths (pass array).
  - Use `navigateByUrl()` for URL strings (less common).
  - Chain `.then()` to react to navigation completion.

---

35) Route parameters
- Goal: pass and read data in route path.
- Steps:
  1. Define route with `:id` parameter
  2. Use `ActivatedRoute` to read params
  3. Access via `route.snapshot.params` or `route.params` observable
- Best example: product detail page
- Brief explanation: dynamic routes for resources
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts (snippet)
export const routes: Routes = [
  { path: 'product/:id', component: ProductDetailComponent }
];
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Product ID: {{ productId }}</p>`
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Option 1: snapshot (non-reactive)
    this.productId = this.route.snapshot.params['id'];

    // Option 2: observable (reactive)
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
  }
}
```
- Learning tips:
  - Use snapshot for one-time reads at component init.
  - Use observable when same component handles multiple param changes.
  - Always add typed interfaces for params when possible.

---

36) Query parameters
- Goal: pass optional query parameters via URL.
- Steps:
  1. Use `[queryParams]` in RouterLink or `router.navigate(path, {queryParams})`
  2. Read with `route.snapshot.queryParams` or `route.queryParams`
- Best example: search/filter params
- Brief explanation: non-structural parameters for filtering
- Complete working code:
```typescript
// navigation with query params
this.router.navigate(['/search'], { 
  queryParams: { q: 'angular', page: 2 } 
});
// URL: /search?q=angular&page=2
```
```typescript
// reading query params
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  template: `<p>Search: {{ searchQuery }} (page {{ page }})</p>`
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  page = 1;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.searchQuery = this.route.snapshot.queryParams['q'] || '';
    this.page = Number(this.route.snapshot.queryParams['page']) || 1;
  }
}
```
- Learning tips:
  - Query params are optional and don't affect route matching.
  - Use for pagination, sorting, filtering.
  - Preserve query params when navigating with `queryParamsHandling: 'merge'`.

---

37) Child routes (nested)
- Goal: organize routes hierarchically.
- Steps:
  1. Define child routes under parent via `children`
  2. Add `<router-outlet>` in parent component
  3. Navigate to `/parent/child`
- Best example: admin section with settings
- Brief explanation: layout composition for feature areas
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'users', component: UsersComponent }
    ]
  }
];
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="admin-container">
      <aside class="sidebar">Admin Menu</aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {}
```
- Learning tips:
  - Use child routes for feature modules and layout wrapping.
  - Each parent component must have `<router-outlet>` for children.
  - Combine with lazy loading for optimal code splitting.

---

38) Lazy loading routes
- Goal: load feature modules on demand.
- Steps:
  1. Define route with `loadChildren` function
  2. Return `import().then(m => m.Module)`
  3. Module has its own routes
- Best example: admin feature loaded only when accessed
- Brief explanation: split code bundles for faster initial load
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminComponent },
  { path: 'users', component: UsersComponent }
];
```
- Learning tips:
  - Lazy loaded modules are bundled separately by CLI.
  - Monitor chunk sizes with `ng build --stats-json`.
  - Test lazy loading with `ng e2e` or dev tools network tab.

---

39) Route guards (CanActivate)
- Goal: protect routes from unauthorized access.
- Steps:
  1. Create guard implementing `CanActivateFn`
  2. Return boolean or Observable<boolean>
  3. Add to route via `canActivate`
- Best example: protect admin page with auth check
- Brief explanation: prevent navigation to restricted routes
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
```
```typescript
// usage in routes
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] }
];
```
- Learning tips:
  - Guards run before route activation; return false to prevent navigation.
  - Chain multiple guards by passing array to `canActivate`.
  - Store `returnUrl` in queryParams to redirect after login.

---

40) Route resolvers
- Goal: pre-fetch data before route activates.
- Steps:
  1. Create resolver implementing `ResolveFn<T>`
  2. Return observable of data
  3. Add to route via `resolve`
  4. Access resolved data via `route.snapshot.data`
- Best example: load product details before showing page
- Brief explanation: ensure data ready before component renders
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/product.resolver.ts
import { Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from './api.service';

export const productResolver: ResolveFn<any> = (route, state) => {
  const apiService = inject(ApiService);
  const id = route.paramMap.get('id');
  return apiService.getProduct(id!);
};
```
```typescript
// usage in routes
export const routes: Routes = [
  { 
    path: 'product/:id', 
    component: ProductDetailComponent,
    resolve: { product: productResolver }
  }
];
```
```typescript
// access resolved data in component
ngOnInit() {
  this.product = this.route.snapshot.data['product'];
}
```
- Learning tips:
  - Resolvers prevent navigation until data arrives (or errors).
  - Combine with error handling to display 404 if data not found.
  - Use resolvers for critical data; load non-critical data in component.

---

41) HTTP interceptors
- Goal: globally intercept and modify HTTP requests/responses.
- Steps:
  1. Create function with HttpInterceptorFn signature
  2. Modify request or response as needed
  3. Provide in bootstrap with `provideHttpClient(withInterceptors(...))`
- Best example: add auth token to requests and handle 401
- Brief explanation: centralized HTTP middleware
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Add token to request
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // Handle response
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        console.log('Session expired');
      }
      return throwError(() => error);
    })
  );
};
```
```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
});
```
- Learning tips:
  - Chain multiple interceptors via `withInterceptors([interceptor1, interceptor2])`.
  - Use interceptors for auth tokens, logging, error handling.
  - Avoid complex logic in interceptors; keep them lightweight.

---

42) Error handling in HTTP
- Goal: gracefully handle HTTP errors.
- Steps:
  1. Use `catchError` in service with error handling
  2. Show user-friendly messages
  3. Optionally retry failed requests
- Best example: API call with fallback
- Brief explanation: robustness against network/server failures
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('/api/data').pipe(
      retry(1),
      catchError(error => {
        let message = 'An error occurred';
        if (error.status === 404) {
          message = 'Resource not found';
        } else if (error.status === 500) {
          message = 'Server error. Please try again later.';
        }
        console.error(message, error);
        return throwError(() => new Error(message));
      })
    );
  }
}
```
```typescript
// usage in component
ngOnInit() {
  this.service.getData().subscribe({
    next: data => { this.data = data; },
    error: err => { this.errorMsg = err.message; }
  });
}
```
- Learning tips:
  - Use `retry()` for transient failures.
  - Map error codes to user-friendly messages.
  - Log errors for debugging without exposing to users.

---

43) RxJS Subject & Observable
- Goal: understand reactive patterns with Subjects.
- Steps:
  1. Create Subject in service
  2. Components emit values via `next()`
  3. Other components subscribe to changes
- Best example: event bus for component communication
- Brief explanation: pub-sub pattern for loosely coupled components
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/event.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private itemSelected = new Subject<string>();
  itemSelected$ = this.itemSelected.asObservable();

  selectItem(id: string) {
    this.itemSelected.next(id);
  }
}
```
```typescript
// component A (emitter)
constructor(private events: EventService) {}
onSelectItem(id: string) {
  this.events.selectItem(id);
}

// component B (subscriber)
ngOnInit() {
  this.events.itemSelected$.subscribe(id => {
    console.log('Item selected:', id);
  });
}
```
- Learning tips:
  - Use Subject for event buses; BehaviorSubject for state.
  - Unsubscribe in ngOnDestroy to prevent memory leaks.
  - Use async pipe in templates to auto-subscribe/unsubscribe.

---

44) BehaviorSubject for state
- Goal: maintain and share state across components.
- Steps:
  1. Create BehaviorSubject with initial value
  2. Call `next()` to update state
  3. Subscribe for reactive updates
- Best example: user authentication state
- Brief explanation: stateful service with current value
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  login(email: string, password: string) {
    // Mock login
    const user = { id: 1, email };
    this.userSubject.next(user);
  }

  logout() {
    this.userSubject.next(null);
  }

  getCurrentUser() {
    return this.userSubject.value;
  }
}
```
```typescript
// usage
constructor(private auth: AuthService) {}

ngOnInit() {
  this.auth.user$.subscribe(user => {
    this.isLoggedIn = !!user;
  });
}
```
- Learning tips:
  - BehaviorSubject emits last value to new subscribers.
  - Combine multiple BehaviorSubjects with `combineLatest()`.
  - Use `.value` to synchronously get current state.

---

45) Operators: map, filter, switchMap
- Goal: transform and filter observable streams.
- Steps:
  1. Chain operators with `pipe()`
  2. Use `map` to transform values
  3. Use `filter` to conditionally pass values
  4. Use `switchMap` to flatten nested observables
- Best example: search input filtering
- Brief explanation: composable data transformations
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/search.component.ts
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, filter, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search'
})
export class SearchComponent {
  searchControl = new FormControl('');
  results: any[] = [];

  constructor(private api: ApiService) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(q => q ? q.length >= 2 : false),
        switchMap(q => this.api.search(q)),
        map(response => response.items)
      )
      .subscribe(items => this.results = items);
  }
}
```
- Learning tips:
  - Use `debounceTime` to reduce API calls on user input.
  - Use `distinctUntilChanged` to skip duplicate values.
  - Use `switchMap` to cancel previous requests when new ones come in.

---

46) Unsubscribe pattern
- Goal: prevent memory leaks by unsubscribing.
- Steps:
  1. Store subscription in property
  2. Unsubscribe in ngOnDestroy
  3. OR use async pipe in template
- Best example: cleanup subscriptions
- Brief explanation: Angular doesn't auto-unsubscribe
- Complete working code:
```typescript
// pattern 1: manual unsubscribe
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({...})
export class MyComponent implements OnDestroy {
  private subscriptions = new Subscription();

  constructor(private service: MyService) {
    const sub = this.service.getData().subscribe(data => {
      console.log(data);
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
```
```typescript
// pattern 2: async pipe (recommended)
@Component({
  template: `<div>{{ data$ | async }}</div>`
})
export class MyComponent {
  data$ = this.service.getData();

  constructor(private service: MyService) {}
  // no ngOnDestroy needed; async pipe handles it
}
```
- Learning tips:
  - Use async pipe whenever possible for automatic unsubscribe.
  - Group related subscriptions in a Subscription object.
  - Use takeUntil for convenience when multiple subscriptions.

---

47) takeUntil operator
- Goal: automatically unsubscribe when component destroys.
- Steps:
  1. Create destroy$ Subject in component
  2. Use `takeUntil(destroy$)` on subscriptions
  3. Emit destroy$ value in ngOnDestroy
- Best example: multiple subscriptions cleanup
- Brief explanation: elegant pattern for component cleanup
- Complete working code:
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my',
  template: `...`
})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private service: MyService) {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => console.log(data));

    this.service.getUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => console.log(update));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```
- Learning tips:
  - Create destroy$ at component level and reuse for all subscriptions.
  - Call both `next()` and `complete()` on destroy$ for cleanup.
  - Combine with error handling to ensure destruction happens.

---

48) Testing components with TestBed
- Goal: unit test component logic.
- Steps:
  1. Set up TestBed with component and dependencies
  2. Create fixture and component instance
  3. Write tests using Jasmine matchers
- Best example: form validation test
- Brief explanation: verify component behavior before deployment
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button if form invalid', () => {
    const submitBtn = fixture.nativeElement.querySelector('button');
    expect(submitBtn.disabled).toBe(true);
  });

  it('should enable submit button when form valid', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button');
    expect(submitBtn.disabled).toBe(false);
  });
});
```
- Learning tips:
  - Import all required modules in TestBed ConfigureTestingModule.
  - Call `fixture.detectChanges()` after setup to trigger change detection.
  - Use `fixture.nativeElement` to query DOM.

---

49) Testing services with HttpTestingController
- Goal: test HTTP requests without real backend.
- Steps:
  1. Inject HttpTestingController in test
  2. Call service method
  3. Verify request with `.expectOne()`
  4. Mock response with `.flush()`
- Best example: test API service
- Brief explanation: isolated service testing with mocked HTTP
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/src/app/api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Assert no outstanding requests
  });

  it('should fetch posts', () => {
    const mockPosts = [{ id: 1, title: 'Post 1' }];

    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('/api/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should handle errors', () => {
    service.getPosts().subscribe({
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('/api/posts');
    req.error(new ErrorEvent('Network error'), { status: 500 });
  });
});
```
- Learning tips:
  - Always call `httpMock.verify()` in afterEach to catch unexpected requests.
  - Use `.flush()` for successful responses and `.error()` for failures.
  - Test both success and error paths.

---

50) E2E testing with Cypress/Playwright
- Goal: test full app workflows from user perspective.
- Steps:
  1. Create test file in `e2e/` folder
  2. Describe user flows (navigation, form submission)
  3. Use selectors to interact and verify
  4. Run `ng e2e` or `cypress open`
- Best example: login flow test
- Brief explanation: end-to-end validation of user experience
- Complete working code:
```typescript
// filepath: /workspaces/angHub/ngApp/e2e/login.spec.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should display login form', () => {
    cy.get('form').should('be.visible');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
  });

  it('should show validation errors for empty form', () => {
    cy.get('button').click();
    cy.get('.error').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').click();

    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Dashboard');
  });

  it('should display error for invalid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button').click();

    cy.get('.error-msg').should('contain', 'Invalid credentials');
  });
});
```
- Learning tips:
  - Start E2E tests with fresh/known state.
  - Test real user workflows, not implementation details.
  - Use data attributes for reliable element selection: `cy.get('[data-testid="login-btn"]')`.

---

End of Part 2 (26–50).

**Progress: 50 exercises complete! Continue to Part 3 for advanced features (51–75).**
