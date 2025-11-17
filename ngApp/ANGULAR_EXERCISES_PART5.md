# Angular Exercises — Part 4 (76–100) — Complete Enhanced Version

Each exercise includes:
- Goal (what you'll build)
- Steps (detailed point-by-point)
- Best example (short, focused)
- Brief explanation (why it matters)
- Complete working code (copy-paste ready)
- Learning tips (beginner guidance)

---

81) TrackBy in *ngFor
- Goal: optimize large list rendering by telling Angular which items are the same.
- Steps:
  1. Create a trackBy function that returns a unique identifier (usually id)
  2. Add `trackBy: trackByFunction` to *ngFor directive
  3. Function receives (index, item) and returns unique value
  4. Angular reuses DOM nodes when identity matches
- Best example: list of 1000 users; update one → only that DOM node changes.
- Brief explanation: Without trackBy, Angular destroys/recreates all DOM nodes on list change.
- Learning tips:
  - Always use trackBy for performance-critical lists
  - Return `item.id` or `item._id` (whatever uniquely identifies item)
  - Never return array index as trackBy value (defeats purpose)
  - Use with `ChangeDetectionStrategy.OnPush` for maximum benefit
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/performance/trackby.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-trackby-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>TrackBy Optimization Demo</h2>
      
      <div class="controls">
        <button (click)="generateUsers()">Generate 100 Users</button>
        <button (click)="updateFirstUser()">Update First User</button>
        <button (click)="shuffleList()">Shuffle List</button>
      </div>

      <div class="stats">
        <p>Total Users: {{ users.length }}</p>
        <p>Re-renders (with trackBy): {{ renderCount }}</p>
      </div>

      <h3>Users List (with TrackBy)</h3>
      <ul class="user-list">
        <li *ngFor="let user of users; trackBy: trackByUserId" class="user-item">
          <span class="id">ID: {{ user.id }}</span>
          <span class="name">{{ user.name }}</span>
          <span class="email">{{ user.email }}</span>
          <span class="timestamp">{{ getCurrentTime() }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 20px auto; padding: 20px; }
    .controls { margin: 20px 0; display: flex; gap: 10px; }
    button { padding: 10px 15px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px; }
    button:hover { background: #1565c0; }
    .stats { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .user-list { list-style: none; padding: 0; max-height: 400px; overflow-y: auto; }
    .user-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px; 
      background: #f9f9f9; 
      margin: 5px 0; 
      border-radius: 4px;
      border-left: 4px solid #1976d2;
    }
    .timestamp { color: #999; font-size: 0.9em; }
  `]
})
export class TrackbyDemoComponent {
  users: User[] = [];
  renderCount = 0;

  trackByUserId(index: number, user: User): number {
    // Return unique identifier for each user
    this.renderCount++;
    return user.id;
  }

  generateUsers() {
    this.users = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`
    }));
  }

  updateFirstUser() {
    if (this.users.length > 0) {
      // Create new object to trigger change (immutability)
      this.users[0] = {
        ...this.users[0],
        name: `User 1 - Updated at ${new Date().toLocaleTimeString()}`
      };
      // Trigger array change detection
      this.users = [...this.users];
    }
  }

  shuffleList() {
    // Fisher-Yates shuffle
    const shuffled = [...this.users];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.users = shuffled;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
}
```

---

82) Virtual scrolling (CDK)
- Goal: render only visible list items for massive lists (10k+ items).
- Steps:
  1. Install @angular/cdk: `npm install @angular/cdk`
  2. Import `ScrollingModule` from '@angular/cdk/scrolling'
  3. Use `<cdk-virtual-scroll-viewport>` container
  4. Set `itemSize="<height>"` (height of each item in pixels)
  5. Use `*cdkVirtualFor` instead of `*ngFor`
  6. Set viewport height (CSS)
- Best example: 10,000 item list rendering 20 visible at a time.
- Brief explanation: Virtual scroll only renders visible + buffer items; massive performance gain.
- Learning tips:
  - `itemSize` must match CSS height of item
  - Use with TrackBy for optimal performance
  - Virtual scroll works with observables via `async` pipe
  - Buffer items added above/below visible area by default
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/performance/virtual-scroll.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface Item {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-virtual-scroll-demo',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  template: `
    <div class="container">
      <h2>Virtual Scrolling Demo</h2>
      
      <div class="stats">
        <p>Total Items: {{ items.length }}</p>
        <p>Currently Visible: ~20 items</p>
        <p>Memory Efficient: Only renders what you see</p>
      </div>

      <cdk-virtual-scroll-viewport itemSize="60" class="viewport">
        <div *cdkVirtualFor="let item of items; trackBy: trackById" class="item">
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 20px auto; }
    .stats { background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .viewport { height: 600px; border: 2px solid #1976d2; border-radius: 4px; }
    .item { 
      padding: 15px; 
      border-bottom: 1px solid #ddd; 
      display: flex; 
      flex-direction: column; 
      height: 60px;
      justify-content: center;
    }
    .item:hover { background: #f5f5f5; }
    .item strong { color: #1976d2; }
    .item p { margin: 5px 0 0 0; font-size: 0.9em; color: #666; }
  `]
})
export class VirtualScrollDemoComponent implements OnInit {
  items: Item[] = [];

  ngOnInit() {
    this.generateItems();
  }

  generateItems() {
    this.items = Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      title: `Item #${i + 1}`,
      description: `Description for item ${i + 1}. This is a sample item in virtual scroll.`
    }));
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }
}
```

---

83) Bundle analysis
- Goal: identify large dependencies and optimize bundle size.
- Steps:
  1. Build with stats: `ng build --configuration production --stats-json`
  2. Check output in `dist/<app-name>/stats.json`
  3. Install analyzer: `npm install -g source-map-explorer`
  4. Analyze: `source-map-explorer dist/<app-name>/browser/main.*.js`
  5. Look for large chunks and consider lazy loading
  6. Replace heavy libraries with lighter alternatives
- Best example: find moment.js is 70KB, replace with date-fns or day.js.
- Brief explanation: visual analysis reveals which dependencies consume most bytes.
- Learning tips:
  - Run analysis regularly in CI/CD
  - Set bundle size budget in angular.json
  - Lazy load feature modules, not core
  - Use tree-shaking: avoid default exports
- Complete working code (commands):

```bash
# filepath: /workspaces/angHub/ngApp/bundle-analysis.sh
#!/bin/bash

echo "🔍 Starting Bundle Analysis..."

# Build with stats
echo "📦 Building with stats..."
ng build --configuration production --stats-json

# Install analyzer if not present
if ! command -v source-map-explorer &> /dev/null; then
  echo "📥 Installing source-map-explorer..."
  npm install -g source-map-explorer
fi

# Analyze the bundle
STATS_FILE="dist/*/stats.json"
MAIN_FILE=$(find dist -name "main.*.js" | head -1)

if [ -f "$MAIN_FILE" ]; then
  echo "📊 Analyzing: $MAIN_FILE"
  source-map-explorer "$MAIN_FILE"
else
  echo "❌ Could not find main bundle file"
fi

echo ""
echo "💡 Tips:"
echo "  - Look for files > 100KB (candidates for code splitting)"
echo "  - Check for duplicate dependencies in node_modules"
echo "  - Consider lazy loading for large feature modules"
echo "  - Use dynamic imports: () => import('./module')"
```

---

84) Lazy load assets & code splitting
- Goal: defer loading of heavy code/assets until needed.
- Steps:
  1. Use dynamic imports with webpack comment for chunk naming
  2. Apply to large feature modules via lazy routes
  3. Load images with `loading="lazy"` attribute
  4. Serve different image formats/sizes with `srcset`
  5. Preload critical assets in head
- Best example: admin dashboard lazy-loaded on route change.
- Brief explanation: reduces initial bundle; user gets faster first paint.
- Learning tips:
  - Name chunks for easier debugging: `/* webpackChunkName: "admin" */`
  - Preload with `<link rel="preload">` for anticipated navigation
  - Monitor chunk sizes with `ng build --stats-json`
  - Use `preloadingStrategy: PreloadAllModules` for non-critical routes
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Lazy-loaded admin module with named chunk
  {
    path: 'admin',
    loadChildren: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin.module')
      .then(m => m.AdminModule)
  },

  // Lazy-loaded reports module
  {
    path: 'reports',
    loadChildren: () => import(/* webpackChunkName: "reports" */ './modules/reports/reports.module')
      .then(m => m.ReportsModule)
  },

  // Lazy-loaded analytics module
  {
    path: 'analytics',
    loadChildren: () => import(/* webpackChunkName: "analytics" */ './modules/analytics/analytics.module')
      .then(m => m.AnalyticsModule)
  }
];
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // Router with preloading strategy
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
});
```

```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<!-- Preload critical assets -->
<link rel="preload" href="assets/fonts/primary.woff2" as="font" type="font/woff2" crossorigin>

<!-- Image with lazy loading and srcset -->
<img 
  src="assets/images/hero-800.jpg"
  srcset="assets/images/hero-400.jpg 400w, assets/images/hero-800.jpg 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"
  alt="Hero Banner"
>

<router-outlet></router-outlet>
```

---

85) Server-Side Rendering (SSR)
- Goal: pre-render HTML on server for SEO and faster first paint.
- Steps:
  1. Add Universal: `ng add @nguniversal/express-engine`
  2. Build SSR: `npm run build:ssr`
  3. Run server: `npm run serve:ssr`
  4. Use `isPlatformBrowser` / `isPlatformServer` guards for browser-only APIs
  5. Avoid window, document, localStorage in components without guards
- Best example: blog site with SEO-friendly pre-rendered pages.
- Brief explanation: SSR renders on Node; browser hydrates; improves SEO and First Paint.
- Learning tips:
  - Browser APIs (window, document) not available on server
  - Use `PLATFORM_ID` injection to check execution environment
  - Async operations block server render; use reasonable timeouts
  - Test both `ng serve` (client-only) and `npm run serve:ssr` (full)
- Complete working code:

```bash
# filepath: /workspaces/angHub/ngApp/ssr-setup.sh
#!/bin/bash

echo "🚀 Setting up Server-Side Rendering..."

# Add Universal
ng add @nguniversal/express-engine

echo ""
echo "✅ Universal added!"
echo ""
echo "📝 npm scripts generated:"
echo "  - npm run build:ssr   : Build for SSR"
echo "  - npm run serve:ssr   : Run SSR server"
echo ""
echo "🔗 Visit: http://localhost:4000"
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/safe-browser-only.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-safe-browser',
  standalone: true,
  template: `
    <div>
      <p>Platform: {{ platform }}</p>
      <p *ngIf="isBrowser">✅ Browser APIs available</p>
      <p *ngIf="!isBrowser">⚠️ Running on server (no browser APIs)</p>
      <button *ngIf="isBrowser" (click)="testLocalStorage()">Test LocalStorage</button>
    </div>
  `
})
export class SafeBrowserComponent implements OnInit {
  isBrowser = false;
  platform = 'Unknown';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.platform = this.isBrowser ? 'Browser' : 'Server';
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Safe: only runs in browser
      const stored = localStorage.getItem('key');
      console.log('From localStorage:', stored);
    }
  }

  testLocalStorage() {
    if (this.isBrowser) {
      localStorage.setItem('test-key', 'test-value');
      alert('Saved to localStorage: ' + localStorage.getItem('test-key'));
    }
  }
}
```

---

86) TransferState (SSR → Client)
- Goal: avoid duplicate HTTP calls between server render and client hydration.
- Steps:
  1. On server: fetch data and store in TransferState
  2. On client: read from TransferState first, skip HTTP if present
  3. After read, remove from cache to free memory
  4. Fall back to HTTP for subsequent navigations
- Best example: prefetch user profile on SSR.
- Brief explanation: eliminates redundant requests; faster hydration.
- Learning tips:
  - Use `makeStateKey()` to create type-safe keys
  - `set()` on server, `get()` on client
  - Always clean up state after reading
  - Wrap in platform checks
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/user.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const USER_KEY = makeStateKey<any>('user');

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUser(id: string): Observable<any> {
    // Check if data already transferred from server
    const storedUser = this.transferState.get(USER_KEY, null);
    if (storedUser) {
      this.transferState.remove(USER_KEY);
      return new Observable(observer => {
        observer.next(storedUser);
        observer.complete();
      });
    }

    // Fetch from API
    return this.http.get(`/api/user/${id}`).pipe(
      tap(user => {
        // Store on server (no-op on client)
        if (!isPlatformBrowser(this.platformId)) {
          this.transferState.set(USER_KEY, user);
        }
      })
    );
  }
}
```

---

87) SEO basics & Meta service
- Goal: set page titles and meta tags for search result snippets.
- Steps:
  1. Inject `Title` and `Meta` services
  2. In component or resolver, call `setTitle()`
  3. Use `updateTag()` to set description, og:image, etc.
  4. Consider using router events to update on navigation
  5. Use SSR for crawlers to see rendered content
- Best example: product page with dynamic title and description.
- Brief explanation: search engines and social media read meta tags.
- Learning tips:
  - Set defaults in index.html
  - Update in route resolver or component ngOnInit
  - Use `updateTag` not `addTag` to avoid duplicates
  - Test with OpenGraph debugger and Google Search Console
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/seo.service.ts
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private titleService: Title, private metaService: Meta) {}

  setPageMeta(meta: PageMeta) {
    // Set page title
    this.titleService.setTitle(`${meta.title} | My App`);

    // Set description
    this.metaService.updateTag({ name: 'description', content: meta.description });

    // Open Graph meta tags (for social sharing)
    this.metaService.updateTag({ property: 'og:title', content: meta.title });
    this.metaService.updateTag({ property: 'og:description', content: meta.description });
    if (meta.image) {
      this.metaService.updateTag({ property: 'og:image', content: meta.image });
    }

    // Twitter card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: meta.title });
    this.metaService.updateTag({ name: 'twitter:description', content: meta.description });

    // Canonical URL
    if (meta.url) {
      this.metaService.updateTag({ rel: 'canonical', href: meta.url });
    }
  }

  setProductMeta(product: { name: string; description: string; price: number; image: string }) {
    this.setPageMeta({
      title: product.name,
      description: product.description,
      image: product.image,
      url: window.location.href
    });

    // Add structured data (Schema.org)
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price
      }
    };
    this.metaService.updateTag({
      name: 'structured-data',
      content: JSON.stringify(schema)
    });
  }
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `
    <div class="product">
      <h1>{{ product?.name }}</h1>
      <img [src]="product?.image" [alt]="product?.name">
      <p>{{ product?.description }}</p>
      <p class="price">${{ product?.price }}</p>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Fetch product (simplified)
    this.product = {
      name: 'Premium Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      image: 'assets/headphones.jpg'
    };

    // Update SEO
    this.seoService.setProductMeta(this.product);
  }
}
```

---

88) XSS protection & sanitization
- Goal: prevent malicious scripts from being injected via user input.
- Steps:
  1. Use interpolation `{{ value }}` (automatically escaped)
  2. Avoid innerHTML; use [textContent] for text
  3. If HTML needed, sanitize with DomSanitizer
  4. Only use `bypassSecurityTrustHtml` for fully trusted content
  5. Use Content-Security-Policy headers on server
- Best example: display user comment safely.
- Brief explanation: Angular escapes interpolated values; explicit sanitization needed only for trusted HTML.
- Learning tips:
  - Never trust user input; always sanitize
  - Use `sanitizer.sanitize(SecurityContext.HTML, value)`
  - `bypassSecurityTrust*` should be rare (trusted CMS content only)
  - Test with malicious input: `<img src=x onerror="alert('xss')">`
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/security/sanitization.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sanitization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>XSS Protection Demo</h2>

      <div class="section">
        <h3>❌ Unsafe (DO NOT USE)</h3>
        <p>User input with script tag:</p>
        <input [(ngModel)]="userInput" placeholder="Try: <img src=x onerror='alert(1)'>">
        <!-- THIS WOULD BE UNSAFE - DON'T DO THIS -->
        <!-- <div [innerHTML]="userInput"></div> -->
        <p class="warning">⚠️ [innerHTML] would execute scripts!</p>
      </div>

      <div class="section">
        <h3>✅ Safe - Escaped (Recommended)</h3>
        <p>Safe interpolation (automatically escaped):</p>
        <div class="output">{{ userInput }}</div>
        <p>Script tags displayed as text, not executed</p>
      </div>

      <div class="section">
        <h3>✅ Safe - Using textContent</h3>
        <div class="output" [textContent]="userInput"></div>
        <p>Also safe for text content</p>
      </div>

      <div class="section">
        <h3>⚠️ Sanitized HTML (Trusted Source Only)</h3>
        <p>Example: Blog post from database (trusted source)</p>
        <div class="output" [innerHTML]="trustedHtml"></div>
        <p>Only use for content you control or trust completely</p>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 20px auto; padding: 20px; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px; }
    .section h3 { margin-top: 0; }
    input { width: 100%; padding: 8px; margin: 10px 0; }
    .output { 
      padding: 15px; 
      background: white; 
      border: 1px solid #ddd; 
      border-radius: 4px;
      word-break: break-all;
      font-family: monospace;
      min-height: 50px;
    }
    .warning { color: #d32f2f; font-weight: bold; }
  `]
})
export class SanitizationComponent {
  userInput = '<img src=x onerror="alert(\'XSS\')">';
  trustedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    // Example: sanitizing trusted content from CMS
    const blogContent = '<p>Safe blog content with <strong>bold</strong> text</p>';
    this.trustedHtml = this.sanitizer.sanitize(1, blogContent) as any;
  }

  // Method to safely sanitize user input (if HTML needed)
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(1, html) as any;
  }
}
```

---

89) Content Security Policy (CSP)
- Goal: harden app against XSS by controlling allowed script/style sources.
- Steps:
  1. Configure server to send CSP header (or <meta> tag)
  2. Start permissive, then gradually restrict
  3. Use `nonce` or `hash` for inline scripts/styles
  4. Monitor CSP violations with report-uri
  5. Test with browser DevTools (Security tab)
- Best example: restrict scripts to same-origin only.
- Brief explanation: CSP prevents inline scripts and limits where code can load from.
- Learning tips:
  - `default-src 'self'` restricts to same origin
  - `script-src 'self' https://cdn.example.com` allows specific domains
  - Use nonce for inline scripts: `<script nonce="xyz">...</script>`
  - Test violations in DevTools Network tab
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/csp-example.ts
// Example CSP headers to set on server (e.g., Express middleware)

export const cspMiddleware = (req: any, res: any, next: any) => {
  // Strict CSP (recommended for production)
  res.setHeader('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'nonce-${generateNonce()}';
    style-src 'self' 'nonce-${generateNonce()}' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    report-uri /csp-report;
  `);
  
  // Report-Only mode (for testing without blocking)
  // res.setHeader('Content-Security-Policy-Report-Only', '...');
  
  next();
};

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15);
}
```

```html
<!-- Meta CSP tag (less effective than header, but better than nothing) -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
">
```

---

90) Dependency updates & migrations
- Goal: safely upgrade Angular and libraries with automatic migrations.
- Steps:
  1. Check current versions: `npm outdated`
  2. Update Angular CLI: `npm install -g @angular/cli@latest`
  3. Run ng update: `ng update @angular/cli @angular/core`
  4. Follow migration guides and prompts
  5. Update other libraries: `ng update`
  6. Run tests and lint: `npm run lint && npm test`
  7. Commit to git before and after
- Best example: migrate from Angular 15 to 16.
- Brief explanation: ng update automates breaking changes; manual fixes sometimes needed.
- Learning tips:
  - Always commit before updating
  - Read migration guide before running update
  - Test on separate branch first
  - Update one major version at a time
- Complete working code (commands):

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/update-angular.sh

set -e

echo "🔄 Angular Update Script"
echo ""

# Backup current state
echo "📦 Checking git status..."
if [[ $(git status --porcelain) ]]; then
  echo "❌ Uncommitted changes detected. Please commit first."
  exit 1
fi

echo "✅ Git clean. Proceeding with update."
echo ""

# Check outdated packages
echo "📋 Checking outdated packages..."
npm outdated

echo ""
read -p "Continue with update? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 1
fi

# Update CLI globally
echo "🔧 Updating Angular CLI globally..."
npm install -g @angular/cli@latest

# Update project
echo "📥 Updating Angular in project..."
ng update @angular/cli @angular/core

echo ""
echo "🧹 Updating other dependencies..."
ng update

echo ""
echo "🧪 Running lint and tests..."
npm run lint
npm run test -- --watch=false

echo ""
echo "✅ Update complete!"
echo "   - Review changes"
echo "   - Test the app manually"
echo "   - Commit the changes"
```

---

91) Create Angular library
- Goal: author reusable Angular library publishable to npm.
- Steps:
  1. Generate library: `ng generate library my-lib`
  2. Develop components/services in `projects/my-lib`
  3. Export public API via `public-api.ts`
  4. Build: `ng build my-lib`
  5. Test: `npm link` locally or build and publish
  6. Use in apps: `npm install @your-org/my-lib`
- Best example: shared button component library.
- Brief explanation: libraries allow code reuse across multiple projects/teams.
- Learning tips:
  - Keep public API minimal (export only what consumers need)
  - Use `ng-packagr` for optimized builds
  - Document with README and inline comments
  - Include peer dependencies in package.json
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/create-library.sh

echo "📚 Creating Angular Library..."

# Generate library
ng generate library ui-components --prefix="app"

echo ""
echo "✅ Library created at: projects/ui-components"
echo ""
echo "Next steps:"
echo "  1. cd projects/ui-components/src/lib"
echo "  2. Create components: ng generate component button --project ui-components"
echo "  3. Export in public-api.ts"
echo "  4. Build: ng build ui-components"
echo "  5. Publish: npm publish dist/ui-components"
```

```typescript
// filepath: /workspaces/angHub/ngApp/projects/ui-components/src/public-api.ts
// Export all public APIs of your library

export * from './lib/button/button.component';
export * from './lib/card/card.component';
export * from './lib/badge/badge.component';
// More exports...
```

---

92) Publish to npm
- Goal: publish library to npm for world-wide use.
- Steps:
  1. Create npm account if needed
  2. Bump version in package.json following semver
  3. Authenticate: `npm login`
  4. Build distribution: `ng build my-lib`
  5. Publish: `npm publish dist/my-lib`
  6. Verify on npmjs.com
- Best example: publish @myorg/ui-button with v1.0.0.
- Brief explanation: npm registry allows others to install your library.
- Learning tips:
  - Use scoped names for organizations: `@myorg/package`
  - Update CHANGELOG.md before publishing
  - Use semantic versioning: MAJOR.MINOR.PATCH
  - Publish from CI/CD for automatic releases
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/publish-library.sh

set -e

echo "📦 Publishing Library to npm"
echo ""

# Check npm login
npm whoami > /dev/null 2>&1 || npm login

# Build library
echo "🔨 Building library..."
ng build ui-components --configuration production

# Bump version
echo "📝 Current package version:"
cat dist/ui-components/package.json | grep '"version"'

echo ""
read -p "Enter new version (e.g., 1.0.1): " NEW_VERSION

# Update package.json
cd dist/ui-components
npm version $NEW_VERSION --no-git-tag-v
cd ../../

# Publish
echo "🚀 Publishing to npm..."
npm publish dist/ui-components --access public

echo ""
echo "✅ Published successfully!"
echo "📦 Package URL: https://www.npmjs.com/package/ui-components"
```

---

93) CI with GitHub Actions
- Goal: automate build, test, lint on every push/PR.
- Steps:
  1. Create `.github/workflows/ci.yml`
  2. Configure Node.js, npm install, build, test, lint
  3. Cache node_modules for speed
  4. Set up success/failure notifications
  5. Optionally run E2E tests
- Best example: PR requires all checks passing before merge.
- Brief explanation: CI catches bugs early; ensures code quality standards.
- Learning tips:
  - Cache `node_modules` to avoid reinstall each run
  - Run lint and tests in parallel for speed
  - Set matrix to test on multiple Node versions
  - Use workflow_dispatch for manual triggers
- Complete working code:

```yaml
# filepath: /workspaces/angHub/ngApp/.github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-test-lint:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [ 18.x, 20.x ]

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🔍 Lint code
        run: npm run lint -- --max-warnings=0

      - name: 🏗️ Build production bundle
        run: npm run build -- --configuration production

      - name: 🧪 Run unit tests
        run: npm run test -- --watch=false --code-coverage

      - name: 📊 Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🎭 Run E2E tests
        run: npm run e2e

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔒 Security audit
        run: npm audit --audit-level=moderate

      - name: 📝 Dependency check
        run: npm outdated || true
```

---

94) Automated deployment (Netlify/Vercel)
- Goal: automatically deploy app on git push to production.
- Steps:
  1. Connect repository to Netlify/Vercel
  2. Configure build command: `ng build --configuration production`
  3. Set publish directory: `dist/<app-name>`
  4. Add environment variables if needed (API keys, etc.)
  5. Enable auto-deploy on main branch
  6. Set up branch previews for PRs
- Best example: every push to main → automatic production deploy.
- Brief explanation: CI/CD reduces manual steps; app always reflects latest code.
- Learning tips:
  - Use preview deployments for PR testing
  - Set environment variables securely (not in code)
  - Monitor deploys with Netlify/Vercel dashboards
  - Set up Slack notifications for deployment status
- Complete working code:

```yaml
# filepath: /workspaces/angHub/ngApp/netlify.toml
[build]
  command = "npm run build -- --configuration production"
  publish = "dist/angular-app"
  functions = "functions"

[build.environment]
  NODE_VERSION = "20.9.0"
  NPM_VERSION = "10.1.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  command = "npm run build -- --configuration production"

[context.deploy-preview]
  command = "npm run build -- --configuration staging"

[context.branch-deploy]
  command = "npm run build -- --configuration development"
```

```yaml
# filepath: /workspaces/angHub/ngApp/.github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🏗️ Build production
        run: npm run build -- --configuration production

      - name: 🚀 Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist/angular-app

      - name: 📢 Notify Slack
        if: always()
        run: echo "Deployment complete"
```

---

95) Code splitting & chunk naming
- Goal: produce readable, cacheable bundle chunks with predictable names.
- Steps:
  1. Use webpack comments for chunk names: `/* webpackChunkName: "feature" */`
  2. Lazy-load feature modules
  3. Configure `optimization.runtimeChunk` in angular.json
  4. Inspect chunks in `ng build --stats-json`
  5. Use separate vendor chunk for node_modules
- Best example: admin panel loads only when user navigates there.
- Brief explanation: readable chunk names aid debugging and caching strategy.
- Learning tips:
  - Chunk names appear in Network tab of DevTools
  - Use CamelCase for consistency
  - Main + polyfills always load; others lazy
  - Monitor chunk sizes with budget in angular.json
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Lazy-load admin with named chunk
  {
    path: 'admin',
    loadChildren: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin.module')
      .then(m => m.AdminModule),
    canActivate: [adminGuard]
  },

  // Lazy-load reports
  {
    path: 'reports',
    loadChildren: () => import(/* webpackChunkName: "reports" */ './modules/reports/reports.module')
      .then(m => m.ReportsModule)
  },

  // Lazy-load settings
  {
    path: 'settings',
    loadChildren: () => import(/* webpackChunkName: "settings" */ './modules/settings/settings.module')
      .then(m => m.SettingsModule)
  }
];
```

```json
// filepath: /workspaces/angHub/ngApp/angular.json (snippet)
{
  "projects": {
    "angular-app": {
      "architect": {
        "build": {
          "options": {
            "optimization": {
              "scripts": true,
              "styles": true,
              "fonts": true
            },
            "vendorChunk": true,
            "runtimeChunk": "single"
          },
          "budgets": [
            {
              "type": "bundle",
              "name": "main",
              "baseline": "500kb",
              "warning": "450kb",
              "error": "550kb"
            }
          ]
        }
      }
    }
  }
}
```

---

96) Image optimization pipeline
- Goal: serve appropriately sized and formatted images for performance.
- Steps:
  1. Generate multiple sizes (400w, 800w, 1600w) for responsive images
  2. Convert to modern formats (WebP, AVIF) alongside JPEG/PNG
  3. Use `<picture>` element with `srcset` for browser choice
  4. Add `loading="lazy"` for below-fold images
  5. Integrate image optimization in build process (CI/CD)
- Best example: hero image serves AVIF/WebP/JPEG based on browser support.
- Brief explanation: smaller images = faster LCP and reduced bandwidth.
- Learning tips:
  - Use ImageMagick or Sharp.js for conversion
  - AVIF is smaller but less supported; provide fallbacks
  - Preload above-fold images: `<link rel="preload" as="image" href="hero.jpg">`
  - Test with Lighthouse (PageSpeed Insights)
- Complete working code:

```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/image-optimization-example.html -->
<!-- Example: Optimized hero image with multiple formats and sizes -->

<picture>
  <!-- AVIF format (smallest, best compression) -->
  <source 
    type="image/avif" 
    srcset="
      assets/images/hero-400.avif 400w,
      assets/images/hero-800.avif 800w,
      assets/images/hero-1600.avif 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
  >
  
  <!-- WebP format (good compression, wide support) -->
  <source 
    type="image/webp" 
    srcset="
      assets/images/hero-400.webp 400w,
      assets/images/hero-800.webp 800w,
      assets/images/hero-1600.webp 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
  >
  
  <!-- JPEG fallback (universal support) -->
  <img 
    src="assets/images/hero-800.jpg"
    srcset="
      assets/images/hero-400.jpg 400w,
      assets/images/hero-800.jpg 800w,
      assets/images/hero-1600.jpg 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
    alt="Hero Banner"
    loading="lazy"
    width="1600"
    height="800"
  >
</picture>
```

```typescript
// filepath: /workspaces/angHub/ngApp/scripts/optimize-images.js
/**
 * Image Optimization Script using Sharp.js
 * Converts images to multiple formats and sizes
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = 'src/assets/images-raw';
const OUTPUT_DIR = 'src/assets/images';
const SIZES = [400, 800, 1600];
const FORMATS = ['avif', 'webp', 'jpeg'];

async function optimizeImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(jpg|png)$/i.test(f));

  for (const file of files) {
    const input = path.join(INPUT_DIR, file);
    const name = path.parse(file).name;

    console.log(`📷 Processing ${file}...`);

    for (const size of SIZES) {
      for (const format of FORMATS) {
        const output = path.join(OUTPUT_DIR, `${name}-${size}.${format}`);
        
        try {
          await sharp(input)
            .resize(size, Math.ceil(size * 0.5), { withoutEnlargement: true })
            [format]({ quality: 80, progressive: true })
            .toFile(output);
          
          console.log(`  ✅ ${name}-${size}.${format}`);
        } catch (err) {
          console.error(`  ❌ Error: ${err.message}`);
        }
      }
    }
  }

  console.log('✅ Image optimization complete!');
}

optimizeImages().catch(console.error);
```

---

97) Major version upgrade
- Goal: safely upgrade to next major Angular version.
- Steps:
  1. Read Angular update guide: https://update.angular.io
  2. Create feature branch: `git checkout -b upgrade/angular-vX`
  3. Run: `ng update @angular/cli@next @angular/core@next`
  4. Follow automatic migrations and manual steps from guide
  5. Fix TypeScript errors and deprecations
  6. Run tests and lint
  7. Test manually in browser
  8. Create PR for review
- Best example: upgrade from Angular 16 to 17.
- Brief explanation: major upgrades require careful planning; Angular provides migration guides.
- Learning tips:
  - Always backup or commit before upgrading
  - Read breaking changes in CHANGELOG
  - Test on staging environment first
  - Update supporting libraries (RxJS, NgRx, etc.)
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/major-upgrade.sh

set -e

echo "🚀 Major Angular Version Upgrade"
echo ""

# Get current version
CURRENT_VERSION=$(cat package.json | grep '"@angular/core"' | head -1 | sed 's/.*"@angular\/core": "^\([0-9]*\).*/\1/')
echo "Current Angular version: $CURRENT_VERSION"

# Commit current state
echo ""
echo "📝 Committing current state..."
git add -A
git commit -m "backup: before major version upgrade"

# Create upgrade branch
UPGRADE_BRANCH="upgrade/angular-v$((CURRENT_VERSION + 1))"
echo "🌿 Creating branch: $UPGRADE_BRANCH"
git checkout -b "$UPGRADE_BRANCH"

# Run update
echo ""
echo "📥 Running ng update..."
ng update @angular/cli@next @angular/core@next

echo ""
echo "🧹 Running lint and tests..."
npm run lint -- --fix
npm run test -- --watch=false

echo ""
echo "✅ Upgrade complete!"
echo ""
echo "Manual steps:"
echo "  1. Review all changes: git diff main"
echo "  2. Test the app manually: npm start"
echo "  3. Read Angular CHANGELOG for breaking changes"
echo "  4. Verify all tests pass"
echo "  5. Create PR: git push -u origin $UPGRADE_BRANCH"
```

---

98) Debug SSR & server processes
- Goal: debug Node.js SSR server with breakpoints and DevTools.
- Steps:
  1. Start server with `--inspect`: `node --inspect=9229 dist/server/main.js`
  2. Open Chrome DevTools or VS Code debugger
  3. Set breakpoints in server code
  4. Step through render logic
  5. Inspect variables and call stack
- Best example: debug why page title not updating on server render.
- Brief explanation: server-side rendering can be tricky; debugger helps diagnose hydration issues.
- Learning tips:
  - Port 9229 is default; change with `--inspect=HOST:PORT`
  - Use `debugger` statements in code
  - Source maps make debugging readable
  - Test both server and client render
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/debug-ssr.sh

echo "🐛 Debugging SSR Server"
echo ""

# Build SSR
echo "🏗️ Building SSR bundle..."
npm run build:ssr

echo ""
echo "📍 Starting server with debugger on port 9229..."
echo "   Open Chrome: chrome://inspect"
echo "   OR attach VS Code debugger to port 9229"
echo ""

node --inspect=0.0.0.0:9229 dist/server/main.js
```

```typescript
// filepath: /workspaces/angHub/ngApp/server.ts (example with debug points)
import 'zone.js/dist/zone-node';
import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './app/app.server.module';

export default async function render(document: string, req: any) {
  try {
    // Debug point: check request URL
    console.log('🔍 Rendering:', req.url);
    debugger; // Debugger will pause here

    const html = await renderModule(AppServerModule, {
      document,
      url: req.url,
      extraProviders: []
    });

    console.log('✅ Render complete');
    return html;
  } catch (err) {
    console.error('❌ Render failed:', err);
    debugger; // Pause on error
    throw err;
  }
}
```

```json
// .vscode/launch.json (attach debugger in VS Code)
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach SSR Debugger",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

99) Performance monitoring (web-vitals)
- Goal: collect and track Core Web Vitals (LCP, FID, CLS) from real users.
- Steps:
  1. Install web-vitals: `npm install web-vitals`
  2. Initialize in main.ts or app init
  3. Collect metrics and send to analytics service
  4. Dashboard shows trends over time
  5. Set alerts for regressions
- Best example: track LCP and alert if > 2.5 seconds.
- Brief explanation: real user metrics drive performance decisions better than lab data.
- Learning tips:
  - Web Vitals measured when page becomes inactive (not immediately)
  - Session ID helps group metrics per user
  - Monitor desktop vs mobile separately
  - Set realistic targets based on industry/competitors
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/core/web-vitals.service.ts
import { Injectable } from '@angular/core';
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  sessionId: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  private readonly sessionId = this.generateSessionId();
  private metrics: VitalMetric[] = [];

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals() {
    // Largest Contentful Paint
    getLCP(metric => this.processMetric('LCP', metric));
    
    // First Input Delay
    getFID(metric => this.processMetric('FID', metric));
    
    // Cumulative Layout Shift
    getCLS(metric => this.processMetric('CLS', metric));
    
    // First Contentful Paint
    getFCP(metric => this.processMetric('FCP', metric));
    
    // Time to First Byte
    getTTFB(metric => this.processMetric('TTFB', metric));
  }

  private processMetric(name: string, metric: Metric) {
    const vitalMetric: VitalMetric = {
      name,
      value: Math.round(metric.value),
      rating: metric.rating as any,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href
    };

    console.log(`📊 ${name}:`, vitalMetric.value, `(${vitalMetric.rating})`);
    this.metrics.push(vitalMetric);

    // Send to analytics
    this.sendToAnalytics(vitalMetric);

    // Alert on poor rating
    if (vitalMetric.rating === 'poor') {
      console.warn(`⚠️ Poor ${name} detected: ${vitalMetric.value}ms`);
    }
  }

  private sendToAnalytics(metric: VitalMetric) {
    // Send to your analytics backend
    navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
    
    // Or use fetch (non-blocking)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
    } else {
      fetch('/api/vitals', {
        method: 'POST',
        body: JSON.stringify(metric),
        keepalive: true
      }).catch(err => console.error('Failed to send metrics:', err));
    }
  }

  getMetrics() {
    return this.metrics;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { WebVitalsService } from './app/core/web-vitals.service';

// Initialize web vitals before bootstrap
const vitalsService = new WebVitalsService();
console.log('📊 Web Vitals monitoring initialized');

bootstrapApplication(AppComponent);
```

---

100) Capstone project: E-Commerce App
- Goal: combine all learnings into a production-ready full-stack app.
- Features:
  - Product listing with search/filter
  - Shopping cart with local persistence
  - User authentication & profiles
  - Order checkout & history
  - Admin panel for inventory
  - Payment integration (Stripe stub)
  - SEO optimization
  - Performance monitoring
  - Unit & E2E tests
  - CI/CD deployment
- Best example: working e-commerce site deployable to production.
- Brief explanation: capstone validates all Angular concepts in realistic context.
- Learning tips:
  - Start with MVP, add features incrementally
  - Use mockup API first, integrate real API later
  - Write tests as you develop
  - Deploy to Netlify/Vercel early and often
- Complete working code (project structure):

```bash
# filepath: /workspaces/angHub/ngApp/PROJECT_SETUP.md
# E-Commerce Capstone Project Setup

## Project Structure
```
src/
├── app/
│   ├── core/              # Singleton services
│   │   ├── auth.service.ts
│   │   ├── api.service.ts
│   │   └── cart.service.ts
│   ├── shared/             # Shared components & pipes
│   │   ├── components/
│   │   │   ├── navbar.component.ts
│   │   │   ├── footer.component.ts
│   │   │   └── product-card.component.ts
│   │   └── pipes/
│   ├── pages/              # Route components
│   │   ├── home.component.ts
│   │   ├── products.component.ts
│   │   ├── product-detail.component.ts
│   │   ├── cart.component.ts
│   │   ├── checkout.component.ts
│   │   ├── login.component.ts
│   │   └── profile.component.ts
│   ├── admin/              # Admin features (lazy-loaded)
│   │   ├── dashboard.component.ts
│   │   ├── inventory.component.ts
│   │   └── orders.component.ts
│   ├── store/              # NgRx state management
│   │   ├── product/
│   │   ├── cart/
│   │   └── auth/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── app.routes.ts       # Route configuration
│   └── app.component.ts    # Root component
├── assets/
│   ├── images/
│   ├── styles/
│   └── data/
└── environments/
    ├── environment.ts
    └── environment.prod.ts

e2e/
├── home.spec.ts
├── products.spec.ts
└── checkout.spec.ts

.github/workflows/
├── ci.yml                  # Lint, test, build
└── deploy.yml              # Deploy to production
```

## Development Steps

1. **Setup Project**
   ```bash
   ng new ecommerce-app --standalone --routing --style=scss
   ng add @ngrx/store @ngrx/effects
   npm install @angular/material @angular/cdk
   ```

2. **Create Core Services**
   - ApiService (HTTP calls)
   - AuthService (user auth)
   - CartService (shopping cart)

3. **Build Product Listing**
   - ProductList component
   - Product filter/search
   - Product card component

4. **Implement Shopping Cart**
   - Add to cart functionality
   - Cart component with quantities
   - Local storage persistence

5. **Authentication & User**
   - Login/register pages
   - Auth// filepath: /workspaces/angHub/ngApp/ANGULAR_EXERCISES_PART4_COMPLETE.md
# Angular Exercises — Part 4 (76–100) — Complete Enhanced Version

Each exercise includes:
- Goal (what you'll build)
- Steps (detailed point-by-point)
- Best example (short, focused)
- Brief explanation (why it matters)
- Complete working code (copy-paste ready)
- Learning tips (beginner guidance)

---

81) TrackBy in *ngFor
- Goal: optimize large list rendering by telling Angular which items are the same.
- Steps:
  1. Create a trackBy function that returns a unique identifier (usually id)
  2. Add `trackBy: trackByFunction` to *ngFor directive
  3. Function receives (index, item) and returns unique value
  4. Angular reuses DOM nodes when identity matches
- Best example: list of 1000 users; update one → only that DOM node changes.
- Brief explanation: Without trackBy, Angular destroys/recreates all DOM nodes on list change.
- Learning tips:
  - Always use trackBy for performance-critical lists
  - Return `item.id` or `item._id` (whatever uniquely identifies item)
  - Never return array index as trackBy value (defeats purpose)
  - Use with `ChangeDetectionStrategy.OnPush` for maximum benefit
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/performance/trackby.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-trackby-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>TrackBy Optimization Demo</h2>
      
      <div class="controls">
        <button (click)="generateUsers()">Generate 100 Users</button>
        <button (click)="updateFirstUser()">Update First User</button>
        <button (click)="shuffleList()">Shuffle List</button>
      </div>

      <div class="stats">
        <p>Total Users: {{ users.length }}</p>
        <p>Re-renders (with trackBy): {{ renderCount }}</p>
      </div>

      <h3>Users List (with TrackBy)</h3>
      <ul class="user-list">
        <li *ngFor="let user of users; trackBy: trackByUserId" class="user-item">
          <span class="id">ID: {{ user.id }}</span>
          <span class="name">{{ user.name }}</span>
          <span class="email">{{ user.email }}</span>
          <span class="timestamp">{{ getCurrentTime() }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 20px auto; padding: 20px; }
    .controls { margin: 20px 0; display: flex; gap: 10px; }
    button { padding: 10px 15px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px; }
    button:hover { background: #1565c0; }
    .stats { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .user-list { list-style: none; padding: 0; max-height: 400px; overflow-y: auto; }
    .user-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px; 
      background: #f9f9f9; 
      margin: 5px 0; 
      border-radius: 4px;
      border-left: 4px solid #1976d2;
    }
    .timestamp { color: #999; font-size: 0.9em; }
  `]
})
export class TrackbyDemoComponent {
  users: User[] = [];
  renderCount = 0;

  trackByUserId(index: number, user: User): number {
    // Return unique identifier for each user
    this.renderCount++;
    return user.id;
  }

  generateUsers() {
    this.users = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`
    }));
  }

  updateFirstUser() {
    if (this.users.length > 0) {
      // Create new object to trigger change (immutability)
      this.users[0] = {
        ...this.users[0],
        name: `User 1 - Updated at ${new Date().toLocaleTimeString()}`
      };
      // Trigger array change detection
      this.users = [...this.users];
    }
  }

  shuffleList() {
    // Fisher-Yates shuffle
    const shuffled = [...this.users];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.users = shuffled;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
}
```

---

82) Virtual scrolling (CDK)
- Goal: render only visible list items for massive lists (10k+ items).
- Steps:
  1. Install @angular/cdk: `npm install @angular/cdk`
  2. Import `ScrollingModule` from '@angular/cdk/scrolling'
  3. Use `<cdk-virtual-scroll-viewport>` container
  4. Set `itemSize="<height>"` (height of each item in pixels)
  5. Use `*cdkVirtualFor` instead of `*ngFor`
  6. Set viewport height (CSS)
- Best example: 10,000 item list rendering 20 visible at a time.
- Brief explanation: Virtual scroll only renders visible + buffer items; massive performance gain.
- Learning tips:
  - `itemSize` must match CSS height of item
  - Use with TrackBy for optimal performance
  - Virtual scroll works with observables via `async` pipe
  - Buffer items added above/below visible area by default
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/performance/virtual-scroll.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface Item {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-virtual-scroll-demo',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  template: `
    <div class="container">
      <h2>Virtual Scrolling Demo</h2>
      
      <div class="stats">
        <p>Total Items: {{ items.length }}</p>
        <p>Currently Visible: ~20 items</p>
        <p>Memory Efficient: Only renders what you see</p>
      </div>

      <cdk-virtual-scroll-viewport itemSize="60" class="viewport">
        <div *cdkVirtualFor="let item of items; trackBy: trackById" class="item">
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 20px auto; }
    .stats { background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .viewport { height: 600px; border: 2px solid #1976d2; border-radius: 4px; }
    .item { 
      padding: 15px; 
      border-bottom: 1px solid #ddd; 
      display: flex; 
      flex-direction: column; 
      height: 60px;
      justify-content: center;
    }
    .item:hover { background: #f5f5f5; }
    .item strong { color: #1976d2; }
    .item p { margin: 5px 0 0 0; font-size: 0.9em; color: #666; }
  `]
})
export class VirtualScrollDemoComponent implements OnInit {
  items: Item[] = [];

  ngOnInit() {
    this.generateItems();
  }

  generateItems() {
    this.items = Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      title: `Item #${i + 1}`,
      description: `Description for item ${i + 1}. This is a sample item in virtual scroll.`
    }));
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }
}
```

---

83) Bundle analysis
- Goal: identify large dependencies and optimize bundle size.
- Steps:
  1. Build with stats: `ng build --configuration production --stats-json`
  2. Check output in `dist/<app-name>/stats.json`
  3. Install analyzer: `npm install -g source-map-explorer`
  4. Analyze: `source-map-explorer dist/<app-name>/browser/main.*.js`
  5. Look for large chunks and consider lazy loading
  6. Replace heavy libraries with lighter alternatives
- Best example: find moment.js is 70KB, replace with date-fns or day.js.
- Brief explanation: visual analysis reveals which dependencies consume most bytes.
- Learning tips:
  - Run analysis regularly in CI/CD
  - Set bundle size budget in angular.json
  - Lazy load feature modules, not core
  - Use tree-shaking: avoid default exports
- Complete working code (commands):

```bash
# filepath: /workspaces/angHub/ngApp/bundle-analysis.sh
#!/bin/bash

echo "🔍 Starting Bundle Analysis..."

# Build with stats
echo "📦 Building with stats..."
ng build --configuration production --stats-json

# Install analyzer if not present
if ! command -v source-map-explorer &> /dev/null; then
  echo "📥 Installing source-map-explorer..."
  npm install -g source-map-explorer
fi

# Analyze the bundle
STATS_FILE="dist/*/stats.json"
MAIN_FILE=$(find dist -name "main.*.js" | head -1)

if [ -f "$MAIN_FILE" ]; then
  echo "📊 Analyzing: $MAIN_FILE"
  source-map-explorer "$MAIN_FILE"
else
  echo "❌ Could not find main bundle file"
fi

echo ""
echo "💡 Tips:"
echo "  - Look for files > 100KB (candidates for code splitting)"
echo "  - Check for duplicate dependencies in node_modules"
echo "  - Consider lazy loading for large feature modules"
echo "  - Use dynamic imports: () => import('./module')"
```

---

84) Lazy load assets & code splitting
- Goal: defer loading of heavy code/assets until needed.
- Steps:
  1. Use dynamic imports with webpack comment for chunk naming
  2. Apply to large feature modules via lazy routes
  3. Load images with `loading="lazy"` attribute
  4. Serve different image formats/sizes with `srcset`
  5. Preload critical assets in head
- Best example: admin dashboard lazy-loaded on route change.
- Brief explanation: reduces initial bundle; user gets faster first paint.
- Learning tips:
  - Name chunks for easier debugging: `/* webpackChunkName: "admin" */`
  - Preload with `<link rel="preload">` for anticipated navigation
  - Monitor chunk sizes with `ng build --stats-json`
  - Use `preloadingStrategy: PreloadAllModules` for non-critical routes
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Lazy-loaded admin module with named chunk
  {
    path: 'admin',
    loadChildren: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin.module')
      .then(m => m.AdminModule)
  },

  // Lazy-loaded reports module
  {
    path: 'reports',
    loadChildren: () => import(/* webpackChunkName: "reports" */ './modules/reports/reports.module')
      .then(m => m.ReportsModule)
  },

  // Lazy-loaded analytics module
  {
    path: 'analytics',
    loadChildren: () => import(/* webpackChunkName: "analytics" */ './modules/analytics/analytics.module')
      .then(m => m.AnalyticsModule)
  }
];
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // Router with preloading strategy
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
});
```

```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/app.component.html -->
<!-- Preload critical assets -->
<link rel="preload" href="assets/fonts/primary.woff2" as="font" type="font/woff2" crossorigin>

<!-- Image with lazy loading and srcset -->
<img 
  src="assets/images/hero-800.jpg"
  srcset="assets/images/hero-400.jpg 400w, assets/images/hero-800.jpg 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"
  alt="Hero Banner"
>

<router-outlet></router-outlet>
```

---

85) Server-Side Rendering (SSR)
- Goal: pre-render HTML on server for SEO and faster first paint.
- Steps:
  1. Add Universal: `ng add @nguniversal/express-engine`
  2. Build SSR: `npm run build:ssr`
  3. Run server: `npm run serve:ssr`
  4. Use `isPlatformBrowser` / `isPlatformServer` guards for browser-only APIs
  5. Avoid window, document, localStorage in components without guards
- Best example: blog site with SEO-friendly pre-rendered pages.
- Brief explanation: SSR renders on Node; browser hydrates; improves SEO and First Paint.
- Learning tips:
  - Browser APIs (window, document) not available on server
  - Use `PLATFORM_ID` injection to check execution environment
  - Async operations block server render; use reasonable timeouts
  - Test both `ng serve` (client-only) and `npm run serve:ssr` (full)
- Complete working code:

```bash
# filepath: /workspaces/angHub/ngApp/ssr-setup.sh
#!/bin/bash

echo "🚀 Setting up Server-Side Rendering..."

# Add Universal
ng add @nguniversal/express-engine

echo ""
echo "✅ Universal added!"
echo ""
echo "📝 npm scripts generated:"
echo "  - npm run build:ssr   : Build for SSR"
echo "  - npm run serve:ssr   : Run SSR server"
echo ""
echo "🔗 Visit: http://localhost:4000"
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/safe-browser-only.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-safe-browser',
  standalone: true,
  template: `
    <div>
      <p>Platform: {{ platform }}</p>
      <p *ngIf="isBrowser">✅ Browser APIs available</p>
      <p *ngIf="!isBrowser">⚠️ Running on server (no browser APIs)</p>
      <button *ngIf="isBrowser" (click)="testLocalStorage()">Test LocalStorage</button>
    </div>
  `
})
export class SafeBrowserComponent implements OnInit {
  isBrowser = false;
  platform = 'Unknown';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.platform = this.isBrowser ? 'Browser' : 'Server';
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Safe: only runs in browser
      const stored = localStorage.getItem('key');
      console.log('From localStorage:', stored);
    }
  }

  testLocalStorage() {
    if (this.isBrowser) {
      localStorage.setItem('test-key', 'test-value');
      alert('Saved to localStorage: ' + localStorage.getItem('test-key'));
    }
  }
}
```

---

86) TransferState (SSR → Client)
- Goal: avoid duplicate HTTP calls between server render and client hydration.
- Steps:
  1. On server: fetch data and store in TransferState
  2. On client: read from TransferState first, skip HTTP if present
  3. After read, remove from cache to free memory
  4. Fall back to HTTP for subsequent navigations
- Best example: prefetch user profile on SSR.
- Brief explanation: eliminates redundant requests; faster hydration.
- Learning tips:
  - Use `makeStateKey()` to create type-safe keys
  - `set()` on server, `get()` on client
  - Always clean up state after reading
  - Wrap in platform checks
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/user.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const USER_KEY = makeStateKey<any>('user');

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUser(id: string): Observable<any> {
    // Check if data already transferred from server
    const storedUser = this.transferState.get(USER_KEY, null);
    if (storedUser) {
      this.transferState.remove(USER_KEY);
      return new Observable(observer => {
        observer.next(storedUser);
        observer.complete();
      });
    }

    // Fetch from API
    return this.http.get(`/api/user/${id}`).pipe(
      tap(user => {
        // Store on server (no-op on client)
        if (!isPlatformBrowser(this.platformId)) {
          this.transferState.set(USER_KEY, user);
        }
      })
    );
  }
}
```

---

87) SEO basics & Meta service
- Goal: set page titles and meta tags for search result snippets.
- Steps:
  1. Inject `Title` and `Meta` services
  2. In component or resolver, call `setTitle()`
  3. Use `updateTag()` to set description, og:image, etc.
  4. Consider using router events to update on navigation
  5. Use SSR for crawlers to see rendered content
- Best example: product page with dynamic title and description.
- Brief explanation: search engines and social media read meta tags.
- Learning tips:
  - Set defaults in index.html
  - Update in route resolver or component ngOnInit
  - Use `updateTag` not `addTag` to avoid duplicates
  - Test with OpenGraph debugger and Google Search Console
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/seo.service.ts
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private titleService: Title, private metaService: Meta) {}

  setPageMeta(meta: PageMeta) {
    // Set page title
    this.titleService.setTitle(`${meta.title} | My App`);

    // Set description
    this.metaService.updateTag({ name: 'description', content: meta.description });

    // Open Graph meta tags (for social sharing)
    this.metaService.updateTag({ property: 'og:title', content: meta.title });
    this.metaService.updateTag({ property: 'og:description', content: meta.description });
    if (meta.image) {
      this.metaService.updateTag({ property: 'og:image', content: meta.image });
    }

    // Twitter card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: meta.title });
    this.metaService.updateTag({ name: 'twitter:description', content: meta.description });

    // Canonical URL
    if (meta.url) {
      this.metaService.updateTag({ rel: 'canonical', href: meta.url });
    }
  }

  setProductMeta(product: { name: string; description: string; price: number; image: string }) {
    this.setPageMeta({
      title: product.name,
      description: product.description,
      image: product.image,
      url: window.location.href
    });

    // Add structured data (Schema.org)
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price
      }
    };
    this.metaService.updateTag({
      name: 'structured-data',
      content: JSON.stringify(schema)
    });
  }
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `
    <div class="product">
      <h1>{{ product?.name }}</h1>
      <img [src]="product?.image" [alt]="product?.name">
      <p>{{ product?.description }}</p>
      <p class="price">${{ product?.price }}</p>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Fetch product (simplified)
    this.product = {
      name: 'Premium Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      image: 'assets/headphones.jpg'
    };

    // Update SEO
    this.seoService.setProductMeta(this.product);
  }
}
```

---

88) XSS protection & sanitization
- Goal: prevent malicious scripts from being injected via user input.
- Steps:
  1. Use interpolation `{{ value }}` (automatically escaped)
  2. Avoid innerHTML; use [textContent] for text
  3. If HTML needed, sanitize with DomSanitizer
  4. Only use `bypassSecurityTrustHtml` for fully trusted content
  5. Use Content-Security-Policy headers on server
- Best example: display user comment safely.
- Brief explanation: Angular escapes interpolated values; explicit sanitization needed only for trusted HTML.
- Learning tips:
  - Never trust user input; always sanitize
  - Use `sanitizer.sanitize(SecurityContext.HTML, value)`
  - `bypassSecurityTrust*` should be rare (trusted CMS content only)
  - Test with malicious input: `<img src=x onerror="alert('xss')">`
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/security/sanitization.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sanitization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>XSS Protection Demo</h2>

      <div class="section">
        <h3>❌ Unsafe (DO NOT USE)</h3>
        <p>User input with script tag:</p>
        <input [(ngModel)]="userInput" placeholder="Try: <img src=x onerror='alert(1)'>">
        <!-- THIS WOULD BE UNSAFE - DON'T DO THIS -->
        <!-- <div [innerHTML]="userInput"></div> -->
        <p class="warning">⚠️ [innerHTML] would execute scripts!</p>
      </div>

      <div class="section">
        <h3>✅ Safe - Escaped (Recommended)</h3>
        <p>Safe interpolation (automatically escaped):</p>
        <div class="output">{{ userInput }}</div>
        <p>Script tags displayed as text, not executed</p>
      </div>

      <div class="section">
        <h3>✅ Safe - Using textContent</h3>
        <div class="output" [textContent]="userInput"></div>
        <p>Also safe for text content</p>
      </div>

      <div class="section">
        <h3>⚠️ Sanitized HTML (Trusted Source Only)</h3>
        <p>Example: Blog post from database (trusted source)</p>
        <div class="output" [innerHTML]="trustedHtml"></div>
        <p>Only use for content you control or trust completely</p>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 20px auto; padding: 20px; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px; }
    .section h3 { margin-top: 0; }
    input { width: 100%; padding: 8px; margin: 10px 0; }
    .output { 
      padding: 15px; 
      background: white; 
      border: 1px solid #ddd; 
      border-radius: 4px;
      word-break: break-all;
      font-family: monospace;
      min-height: 50px;
    }
    .warning { color: #d32f2f; font-weight: bold; }
  `]
})
export class SanitizationComponent {
  userInput = '<img src=x onerror="alert(\'XSS\')">';
  trustedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    // Example: sanitizing trusted content from CMS
    const blogContent = '<p>Safe blog content with <strong>bold</strong> text</p>';
    this.trustedHtml = this.sanitizer.sanitize(1, blogContent) as any;
  }

  // Method to safely sanitize user input (if HTML needed)
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(1, html) as any;
  }
}
```

---

89) Content Security Policy (CSP)
- Goal: harden app against XSS by controlling allowed script/style sources.
- Steps:
  1. Configure server to send CSP header (or <meta> tag)
  2. Start permissive, then gradually restrict
  3. Use `nonce` or `hash` for inline scripts/styles
  4. Monitor CSP violations with report-uri
  5. Test with browser DevTools (Security tab)
- Best example: restrict scripts to same-origin only.
- Brief explanation: CSP prevents inline scripts and limits where code can load from.
- Learning tips:
  - `default-src 'self'` restricts to same origin
  - `script-src 'self' https://cdn.example.com` allows specific domains
  - Use nonce for inline scripts: `<script nonce="xyz">...</script>`
  - Test violations in DevTools Network tab
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/csp-example.ts
// Example CSP headers to set on server (e.g., Express middleware)

export const cspMiddleware = (req: any, res: any, next: any) => {
  // Strict CSP (recommended for production)
  res.setHeader('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'nonce-${generateNonce()}';
    style-src 'self' 'nonce-${generateNonce()}' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    report-uri /csp-report;
  `);
  
  // Report-Only mode (for testing without blocking)
  // res.setHeader('Content-Security-Policy-Report-Only', '...');
  
  next();
};

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15);
}
```

```html
<!-- Meta CSP tag (less effective than header, but better than nothing) -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
">
```

---

90) Dependency updates & migrations
- Goal: safely upgrade Angular and libraries with automatic migrations.
- Steps:
  1. Check current versions: `npm outdated`
  2. Update Angular CLI: `npm install -g @angular/cli@latest`
  3. Run ng update: `ng update @angular/cli @angular/core`
  4. Follow migration guides and prompts
  5. Update other libraries: `ng update`
  6. Run tests and lint: `npm run lint && npm test`
  7. Commit to git before and after
- Best example: migrate from Angular 15 to 16.
- Brief explanation: ng update automates breaking changes; manual fixes sometimes needed.
- Learning tips:
  - Always commit before updating
  - Read migration guide before running update
  - Test on separate branch first
  - Update one major version at a time
- Complete working code (commands):

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/update-angular.sh

set -e

echo "🔄 Angular Update Script"
echo ""

# Backup current state
echo "📦 Checking git status..."
if [[ $(git status --porcelain) ]]; then
  echo "❌ Uncommitted changes detected. Please commit first."
  exit 1
fi

echo "✅ Git clean. Proceeding with update."
echo ""

# Check outdated packages
echo "📋 Checking outdated packages..."
npm outdated

echo ""
read -p "Continue with update? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 1
fi

# Update CLI globally
echo "🔧 Updating Angular CLI globally..."
npm install -g @angular/cli@latest

# Update project
echo "📥 Updating Angular in project..."
ng update @angular/cli @angular/core

echo ""
echo "🧹 Updating other dependencies..."
ng update

echo ""
echo "🧪 Running lint and tests..."
npm run lint
npm run test -- --watch=false

echo ""
echo "✅ Update complete!"
echo "   - Review changes"
echo "   - Test the app manually"
echo "   - Commit the changes"
```

---

91) Create Angular library
- Goal: author reusable Angular library publishable to npm.
- Steps:
  1. Generate library: `ng generate library my-lib`
  2. Develop components/services in `projects/my-lib`
  3. Export public API via `public-api.ts`
  4. Build: `ng build my-lib`
  5. Test: `npm link` locally or build and publish
  6. Use in apps: `npm install @your-org/my-lib`
- Best example: shared button component library.
- Brief explanation: libraries allow code reuse across multiple projects/teams.
- Learning tips:
  - Keep public API minimal (export only what consumers need)
  - Use `ng-packagr` for optimized builds
  - Document with README and inline comments
  - Include peer dependencies in package.json
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/create-library.sh

echo "📚 Creating Angular Library..."

# Generate library
ng generate library ui-components --prefix="app"

echo ""
echo "✅ Library created at: projects/ui-components"
echo ""
echo "Next steps:"
echo "  1. cd projects/ui-components/src/lib"
echo "  2. Create components: ng generate component button --project ui-components"
echo "  3. Export in public-api.ts"
echo "  4. Build: ng build ui-components"
echo "  5. Publish: npm publish dist/ui-components"
```

```typescript
// filepath: /workspaces/angHub/ngApp/projects/ui-components/src/public-api.ts
// Export all public APIs of your library

export * from './lib/button/button.component';
export * from './lib/card/card.component';
export * from './lib/badge/badge.component';
// More exports...
```

---

92) Publish to npm
- Goal: publish library to npm for world-wide use.
- Steps:
  1. Create npm account if needed
  2. Bump version in package.json following semver
  3. Authenticate: `npm login`
  4. Build distribution: `ng build my-lib`
  5. Publish: `npm publish dist/my-lib`
  6. Verify on npmjs.com
- Best example: publish @myorg/ui-button with v1.0.0.
- Brief explanation: npm registry allows others to install your library.
- Learning tips:
  - Use scoped names for organizations: `@myorg/package`
  - Update CHANGELOG.md before publishing
  - Use semantic versioning: MAJOR.MINOR.PATCH
  - Publish from CI/CD for automatic releases
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/publish-library.sh

set -e

echo "📦 Publishing Library to npm"
echo ""

# Check npm login
npm whoami > /dev/null 2>&1 || npm login

# Build library
echo "🔨 Building library..."
ng build ui-components --configuration production

# Bump version
echo "📝 Current package version:"
cat dist/ui-components/package.json | grep '"version"'

echo ""
read -p "Enter new version (e.g., 1.0.1): " NEW_VERSION

# Update package.json
cd dist/ui-components
npm version $NEW_VERSION --no-git-tag-v
cd ../../

# Publish
echo "🚀 Publishing to npm..."
npm publish dist/ui-components --access public

echo ""
echo "✅ Published successfully!"
echo "📦 Package URL: https://www.npmjs.com/package/ui-components"
```

---

93) CI with GitHub Actions
- Goal: automate build, test, lint on every push/PR.
- Steps:
  1. Create `.github/workflows/ci.yml`
  2. Configure Node.js, npm install, build, test, lint
  3. Cache node_modules for speed
  4. Set up success/failure notifications
  5. Optionally run E2E tests
- Best example: PR requires all checks passing before merge.
- Brief explanation: CI catches bugs early; ensures code quality standards.
- Learning tips:
  - Cache `node_modules` to avoid reinstall each run
  - Run lint and tests in parallel for speed
  - Set matrix to test on multiple Node versions
  - Use workflow_dispatch for manual triggers
- Complete working code:

```yaml
# filepath: /workspaces/angHub/ngApp/.github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-test-lint:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [ 18.x, 20.x ]

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🔍 Lint code
        run: npm run lint -- --max-warnings=0

      - name: 🏗️ Build production bundle
        run: npm run build -- --configuration production

      - name: 🧪 Run unit tests
        run: npm run test -- --watch=false --code-coverage

      - name: 📊 Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🎭 Run E2E tests
        run: npm run e2e

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔒 Security audit
        run: npm audit --audit-level=moderate

      - name: 📝 Dependency check
        run: npm outdated || true
```

---

94) Automated deployment (Netlify/Vercel)
- Goal: automatically deploy app on git push to production.
- Steps:
  1. Connect repository to Netlify/Vercel
  2. Configure build command: `ng build --configuration production`
  3. Set publish directory: `dist/<app-name>`
  4. Add environment variables if needed (API keys, etc.)
  5. Enable auto-deploy on main branch
  6. Set up branch previews for PRs
- Best example: every push to main → automatic production deploy.
- Brief explanation: CI/CD reduces manual steps; app always reflects latest code.
- Learning tips:
  - Use preview deployments for PR testing
  - Set environment variables securely (not in code)
  - Monitor deploys with Netlify/Vercel dashboards
  - Set up Slack notifications for deployment status
- Complete working code:

```yaml
# filepath: /workspaces/angHub/ngApp/netlify.toml
[build]
  command = "npm run build -- --configuration production"
  publish = "dist/angular-app"
  functions = "functions"

[build.environment]
  NODE_VERSION = "20.9.0"
  NPM_VERSION = "10.1.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  command = "npm run build -- --configuration production"

[context.deploy-preview]
  command = "npm run build -- --configuration staging"

[context.branch-deploy]
  command = "npm run build -- --configuration development"
```

```yaml
# filepath: /workspaces/angHub/ngApp/.github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🏗️ Build production
        run: npm run build -- --configuration production

      - name: 🚀 Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist/angular-app

      - name: 📢 Notify Slack
        if: always()
        run: echo "Deployment complete"
```

---

95) Code splitting & chunk naming
- Goal: produce readable, cacheable bundle chunks with predictable names.
- Steps:
  1. Use webpack comments for chunk names: `/* webpackChunkName: "feature" */`
  2. Lazy-load feature modules
  3. Configure `optimization.runtimeChunk` in angular.json
  4. Inspect chunks in `ng build --stats-json`
  5. Use separate vendor chunk for node_modules
- Best example: admin panel loads only when user navigates there.
- Brief explanation: readable chunk names aid debugging and caching strategy.
- Learning tips:
  - Chunk names appear in Network tab of DevTools
  - Use CamelCase for consistency
  - Main + polyfills always load; others lazy
  - Monitor chunk sizes with budget in angular.json
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Lazy-load admin with named chunk
  {
    path: 'admin',
    loadChildren: () => import(/* webpackChunkName: "admin" */ './modules/admin/admin.module')
      .then(m => m.AdminModule),
    canActivate: [adminGuard]
  },

  // Lazy-load reports
  {
    path: 'reports',
    loadChildren: () => import(/* webpackChunkName: "reports" */ './modules/reports/reports.module')
      .then(m => m.ReportsModule)
  },

  // Lazy-load settings
  {
    path: 'settings',
    loadChildren: () => import(/* webpackChunkName: "settings" */ './modules/settings/settings.module')
      .then(m => m.SettingsModule)
  }
];
```

```json
// filepath: /workspaces/angHub/ngApp/angular.json (snippet)
{
  "projects": {
    "angular-app": {
      "architect": {
        "build": {
          "options": {
            "optimization": {
              "scripts": true,
              "styles": true,
              "fonts": true
            },
            "vendorChunk": true,
            "runtimeChunk": "single"
          },
          "budgets": [
            {
              "type": "bundle",
              "name": "main",
              "baseline": "500kb",
              "warning": "450kb",
              "error": "550kb"
            }
          ]
        }
      }
    }
  }
}
```

---

96) Image optimization pipeline
- Goal: serve appropriately sized and formatted images for performance.
- Steps:
  1. Generate multiple sizes (400w, 800w, 1600w) for responsive images
  2. Convert to modern formats (WebP, AVIF) alongside JPEG/PNG
  3. Use `<picture>` element with `srcset` for browser choice
  4. Add `loading="lazy"` for below-fold images
  5. Integrate image optimization in build process (CI/CD)
- Best example: hero image serves AVIF/WebP/JPEG based on browser support.
- Brief explanation: smaller images = faster LCP and reduced bandwidth.
- Learning tips:
  - Use ImageMagick or Sharp.js for conversion
  - AVIF is smaller but less supported; provide fallbacks
  - Preload above-fold images: `<link rel="preload" as="image" href="hero.jpg">`
  - Test with Lighthouse (PageSpeed Insights)
- Complete working code:

```html
<!-- filepath: /workspaces/angHub/ngApp/src/app/image-optimization-example.html -->
<!-- Example: Optimized hero image with multiple formats and sizes -->

<picture>
  <!-- AVIF format (smallest, best compression) -->
  <source 
    type="image/avif" 
    srcset="
      assets/images/hero-400.avif 400w,
      assets/images/hero-800.avif 800w,
      assets/images/hero-1600.avif 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
  >
  
  <!-- WebP format (good compression, wide support) -->
  <source 
    type="image/webp" 
    srcset="
      assets/images/hero-400.webp 400w,
      assets/images/hero-800.webp 800w,
      assets/images/hero-1600.webp 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
  >
  
  <!-- JPEG fallback (universal support) -->
  <img 
    src="assets/images/hero-800.jpg"
    srcset="
      assets/images/hero-400.jpg 400w,
      assets/images/hero-800.jpg 800w,
      assets/images/hero-1600.jpg 1600w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
    alt="Hero Banner"
    loading="lazy"
    width="1600"
    height="800"
  >
</picture>
```

```typescript
// filepath: /workspaces/angHub/ngApp/scripts/optimize-images.js
/**
 * Image Optimization Script using Sharp.js
 * Converts images to multiple formats and sizes
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = 'src/assets/images-raw';
const OUTPUT_DIR = 'src/assets/images';
const SIZES = [400, 800, 1600];
const FORMATS = ['avif', 'webp', 'jpeg'];

async function optimizeImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(jpg|png)$/i.test(f));

  for (const file of files) {
    const input = path.join(INPUT_DIR, file);
    const name = path.parse(file).name;

    console.log(`📷 Processing ${file}...`);

    for (const size of SIZES) {
      for (const format of FORMATS) {
        const output = path.join(OUTPUT_DIR, `${name}-${size}.${format}`);
        
        try {
          await sharp(input)
            .resize(size, Math.ceil(size * 0.5), { withoutEnlargement: true })
            [format]({ quality: 80, progressive: true })
            .toFile(output);
          
          console.log(`  ✅ ${name}-${size}.${format}`);
        } catch (err) {
          console.error(`  ❌ Error: ${err.message}`);
        }
      }
    }
  }

  console.log('✅ Image optimization complete!');
}

optimizeImages().catch(console.error);
```

---

97) Major version upgrade
- Goal: safely upgrade to next major Angular version.
- Steps:
  1. Read Angular update guide: https://update.angular.io
  2. Create feature branch: `git checkout -b upgrade/angular-vX`
  3. Run: `ng update @angular/cli@next @angular/core@next`
  4. Follow automatic migrations and manual steps from guide
  5. Fix TypeScript errors and deprecations
  6. Run tests and lint
  7. Test manually in browser
  8. Create PR for review
- Best example: upgrade from Angular 16 to 17.
- Brief explanation: major upgrades require careful planning; Angular provides migration guides.
- Learning tips:
  - Always backup or commit before upgrading
  - Read breaking changes in CHANGELOG
  - Test on staging environment first
  - Update supporting libraries (RxJS, NgRx, etc.)
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/major-upgrade.sh

set -e

echo "🚀 Major Angular Version Upgrade"
echo ""

# Get current version
CURRENT_VERSION=$(cat package.json | grep '"@angular/core"' | head -1 | sed 's/.*"@angular\/core": "^\([0-9]*\).*/\1/')
echo "Current Angular version: $CURRENT_VERSION"

# Commit current state
echo ""
echo "📝 Committing current state..."
git add -A
git commit -m "backup: before major version upgrade"

# Create upgrade branch
UPGRADE_BRANCH="upgrade/angular-v$((CURRENT_VERSION + 1))"
echo "🌿 Creating branch: $UPGRADE_BRANCH"
git checkout -b "$UPGRADE_BRANCH"

# Run update
echo ""
echo "📥 Running ng update..."
ng update @angular/cli@next @angular/core@next

echo ""
echo "🧹 Running lint and tests..."
npm run lint -- --fix
npm run test -- --watch=false

echo ""
echo "✅ Upgrade complete!"
echo ""
echo "Manual steps:"
echo "  1. Review all changes: git diff main"
echo "  2. Test the app manually: npm start"
echo "  3. Read Angular CHANGELOG for breaking changes"
echo "  4. Verify all tests pass"
echo "  5. Create PR: git push -u origin $UPGRADE_BRANCH"
```

---

98) Debug SSR & server processes
- Goal: debug Node.js SSR server with breakpoints and DevTools.
- Steps:
  1. Start server with `--inspect`: `node --inspect=9229 dist/server/main.js`
  2. Open Chrome DevTools or VS Code debugger
  3. Set breakpoints in server code
  4. Step through render logic
  5. Inspect variables and call stack
- Best example: debug why page title not updating on server render.
- Brief explanation: server-side rendering can be tricky; debugger helps diagnose hydration issues.
- Learning tips:
  - Port 9229 is default; change with `--inspect=HOST:PORT`
  - Use `debugger` statements in code
  - Source maps make debugging readable
  - Test both server and client render
- Complete working code:

```bash
#!/bin/bash
# filepath: /workspaces/angHub/ngApp/scripts/debug-ssr.sh

echo "🐛 Debugging SSR Server"
echo ""

# Build SSR
echo "🏗️ Building SSR bundle..."
npm run build:ssr

echo ""
echo "📍 Starting server with debugger on port 9229..."
echo "   Open Chrome: chrome://inspect"
echo "   OR attach VS Code debugger to port 9229"
echo ""

node --inspect=0.0.0.0:9229 dist/server/main.js
```

```typescript
// filepath: /workspaces/angHub/ngApp/server.ts (example with debug points)
import 'zone.js/dist/zone-node';
import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './app/app.server.module';

export default async function render(document: string, req: any) {
  try {
    // Debug point: check request URL
    console.log('🔍 Rendering:', req.url);
    debugger; // Debugger will pause here

    const html = await renderModule(AppServerModule, {
      document,
      url: req.url,
      extraProviders: []
    });

    console.log('✅ Render complete');
    return html;
  } catch (err) {
    console.error('❌ Render failed:', err);
    debugger; // Pause on error
    throw err;
  }
}
```

```json
// .vscode/launch.json (attach debugger in VS Code)
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach SSR Debugger",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

99) Performance monitoring (web-vitals)
- Goal: collect and track Core Web Vitals (LCP, FID, CLS) from real users.
- Steps:
  1. Install web-vitals: `npm install web-vitals`
  2. Initialize in main.ts or app init
  3. Collect metrics and send to analytics service
  4. Dashboard shows trends over time
  5. Set alerts for regressions
- Best example: track LCP and alert if > 2.5 seconds.
- Brief explanation: real user metrics drive performance decisions better than lab data.
- Learning tips:
  - Web Vitals measured when page becomes inactive (not immediately)
  - Session ID helps group metrics per user
  - Monitor desktop vs mobile separately
  - Set realistic targets based on industry/competitors
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/core/web-vitals.service.ts
import { Injectable } from '@angular/core';
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  sessionId: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  private readonly sessionId = this.generateSessionId();
  private metrics: VitalMetric[] = [];

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals() {
    // Largest Contentful Paint
    getLCP(metric => this.processMetric('LCP', metric));
    
    // First Input Delay
    getFID(metric => this.processMetric('FID', metric));
    
    // Cumulative Layout Shift
    getCLS(metric => this.processMetric('CLS', metric));
    
    // First Contentful Paint
    getFCP(metric => this.processMetric('FCP', metric));
    
    // Time to First Byte
    getTTFB(metric => this.processMetric('TTFB', metric));
  }

  private processMetric(name: string, metric: Metric) {
    const vitalMetric: VitalMetric = {
      name,
      value: Math.round(metric.value),
      rating: metric.rating as any,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href
    };

    console.log(`📊 ${name}:`, vitalMetric.value, `(${vitalMetric.rating})`);
    this.metrics.push(vitalMetric);

    // Send to analytics
    this.sendToAnalytics(vitalMetric);

    // Alert on poor rating
    if (vitalMetric.rating === 'poor') {
      console.warn(`⚠️ Poor ${name} detected: ${vitalMetric.value}ms`);
    }
  }

  private sendToAnalytics(metric: VitalMetric) {
    // Send to your analytics backend
    navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
    
    // Or use fetch (non-blocking)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
    } else {
      fetch('/api/vitals', {
        method: 'POST',
        body: JSON.stringify(metric),
        keepalive: true
      }).catch(err => console.error('Failed to send metrics:', err));
    }
  }

  getMetrics() {
    return this.metrics;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { WebVitalsService } from './app/core/web-vitals.service';

// Initialize web vitals before bootstrap
const vitalsService = new WebVitalsService();
console.log('📊 Web Vitals monitoring initialized');

bootstrapApplication(AppComponent);
```

---

100) Capstone project: E-Commerce App
- Goal: combine all learnings into a production-ready full-stack app.
- Features:
  - Product listing with search/filter
  - Shopping cart with local persistence
  - User authentication & profiles
  - Order checkout & history
  - Admin panel for inventory
  - Payment integration (Stripe stub)
  - SEO optimization
  - Performance monitoring
  - Unit & E2E tests
  - CI/CD deployment
- Best example: working e-commerce site deployable to production.
- Brief explanation: capstone validates all Angular concepts in realistic context.
- Learning tips:
  - Start with MVP, add features incrementally
  - Use mockup API first, int…