# Angular Exercises — Part 4 (76–100) — Enhanced for Beginners

Each exercise includes:
- Goal (what you'll build)
- Steps (detailed point-by-point)
- Best example (short, focused)
- Brief explanation (why it matters)
- Complete working code (copy-paste ready)
- Learning tips (beginner guidance)

---

76) File upload with progress
- Goal: allow users to upload files and see real-time upload progress.
- Steps:
  1. Create a file input in the template with `(change)` event handler
  2. In the handler, extract the file from the input element
  3. Create FormData object and append the file
  4. Create HttpRequest with `reportProgress: true` to get progress events
  5. Subscribe to events and check `HttpEventType` to differentiate between progress and response
  6. Calculate progress percentage: `(loaded / total) * 100`
  7. Display progress in template with `*ngIf` and binding
- Best example: file input → FormData → HttpRequest → progress display.
- Brief explanation: HttpClient emits multiple events for uploads; we listen and update UI.
- Learning tips:
  - `HttpEventType.UploadProgress` fires multiple times as file uploads
  - Always check `ev.total` before dividing to avoid errors
  - Use `Math.round()` to show whole number percentages
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/file-upload/upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

interface UploadStatus {
  progress: number;
  fileName: string;
  isUploading: boolean;
  error: string | null;
  success: boolean;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <h2>File Upload with Progress</h2>
      
      <div class="input-group">
        <label for="fileInput">Choose File:</label>
        <input 
          id="fileInput"
          type="file" 
          (change)="onFileSelected($event)"
          [disabled]="status.isUploading"
        />
      </div>

      <div *ngIf="status.fileName" class="file-info">
        <p>Selected: <strong>{{ status.fileName }}</strong></p>
      </div>

      <div *ngIf="status.isUploading" class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="status.progress"></div>
        </div>
        <p>Upload Progress: <strong>{{ status.progress }}%</strong></p>
      </div>

      <div *ngIf="status.error" class="error-message">
        <p>❌ Error: {{ status.error }}</p>
      </div>

      <div *ngIf="status.success" class="success-message">
        <p>✅ File uploaded successfully!</p>
      </div>
    </div>
  `,
  styles: [`
    .upload-container { max-width: 500px; margin: 20px auto; padding: 20px; }
    .input-group { margin: 20px 0; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input[type="file"] { padding: 8px; }
    .progress-bar { width: 100%; height: 20px; background: #ddd; border-radius: 4px; overflow: hidden; margin: 10px 0; }
    .progress-fill { height: 100%; background: #4CAF50; transition: width 0.3s; }
    .error-message { color: #d32f2f; padding: 10px; background: #ffebee; border-radius: 4px; }
    .success-message { color: #388e3c; padding: 10px; background: #e8f5e9; border-radius: 4px; }
    .file-info { color: #1976d2; padding: 10px; background: #e3f2fd; border-radius: 4px; }
  `]
})
export class UploadComponent {
  status: UploadStatus = {
    progress: 0,
    fileName: '',
    isUploading: false,
    error: null,
    success: false
  };

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.status.error = 'No file selected';
      return;
    }

    // Reset status
    this.status = {
      progress: 0,
      fileName: file.name,
      isUploading: true,
      error: null,
      success: false
    };

    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Create request with reportProgress enabled
    const request = new HttpRequest('POST', '/api/upload', formData, {
      reportProgress: true
    });

    this.http.request(request).subscribe({
      next: (event) => {
        // Check event type
        if (event.type === HttpEventType.UploadProgress) {
          // Calculate percentage
          if (event.total) {
            this.status.progress = Math.round((100 * event.loaded) / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          // Upload complete
          this.status.isUploading = false;
          this.status.success = true;
          this.status.progress = 100;
        }
      },
      error: (err) => {
        this.status.isUploading = false;
        this.status.error = err?.error?.message || 'Upload failed';
      }
    });
  }
}
```

---

77) WebSocket / Realtime updates
- Goal: receive live data from server via WebSocket connection.
- Steps:
  1. Create a service that manages WebSocket connection
  2. Use RxJS `webSocket` helper to create observable
  3. Expose message stream as observable for consumers
  4. In component, subscribe to message stream in `ngOnInit`
  5. Update component data on each incoming message
  6. Handle disconnection gracefully
- Best example: live notification feed or chat messages.
- Brief explanation: WebSocket maintains persistent connection; RxJS wraps it in observable pattern.
- Learning tips:
  - WebSocket URLs use `ws://` (not encrypted) or `wss://` (encrypted, recommended)
  - Each subscription to WebSocket service gets same connection (if service is singleton)
  - Always unsubscribe in `ngOnDestroy` to avoid memory leaks
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/websocket/ws.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { tap, retryWhen, delay, take } from 'rxjs/operators';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  user: string;
}

@Injectable({ providedIn: 'root' })
export class WsService {
  private wsSubject$: WebSocketSubject<any> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // For demo: simulate WebSocket with ReplaySubject
  private mockWs$ = new ReplaySubject<Message>(10);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Simulate incoming messages for demo
    setTimeout(() => {
      this.mockWs$.next({
        id: '1',
        text: 'Hello from server!',
        timestamp: new Date(),
        user: 'System'
      });
    }, 1000);

    setTimeout(() => {
      this.mockWs$.next({
        id: '2',
        text: 'This is a live update',
        timestamp: new Date(),
        user: 'Server'
      });
    }, 3000);
  }

  connect(url: string): Observable<Message> {
    // For production, use real WebSocket:
    // return webSocket(url).pipe(
    //   retryWhen(errors => errors.pipe(delay(1000), take(this.maxReconnectAttempts)))
    // );

    // For demo, return mock stream
    return this.mockWs$.asObservable();
  }

  send(message: any) {
    if (this.wsSubject$) {
      this.wsSubject$.next(message);
    } else {
      console.warn('WebSocket not connected');
    }
  }

  disconnect() {
    if (this.wsSubject$) {
      this.wsSubject$.complete();
    }
  }
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/websocket/live-feed.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsService, Message } from './ws.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-live-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feed-container">
      <h2>Live Feed</h2>
      <p class="status" [ngClass]="isConnected ? 'connected' : 'disconnected'">
        {{ isConnected ? '🟢 Connected' : '🔴 Disconnected' }}
      </p>

      <div class="messages-list">
        <div *ngFor="let msg of messages" class="message-item">
          <div class="message-header">
            <strong>{{ msg.user }}</strong>
            <span class="timestamp">{{ msg.timestamp | date:'short' }}</span>
          </div>
          <p class="message-text">{{ msg.text }}</p>
        </div>
      </div>

      <div *ngIf="messages.length === 0" class="empty-state">
        <p>Waiting for messages...</p>
      </div>
    </div>
  `,
  styles: [`
    .feed-container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .status { padding: 10px; border-radius: 4px; font-weight: bold; }
    .status.connected { color: #4CAF50; background: #e8f5e9; }
    .status.disconnected { color: #d32f2f; background: #ffebee; }
    .messages-list { max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; }
    .message-item { padding: 15px; border-bottom: 1px solid #eee; }
    .message-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .timestamp { color: #999; font-size: 0.9em; }
    .message-text { margin: 5px 0 0 0; color: #333; }
    .empty-state { text-align: center; color: #999; padding: 40px 20px; }
  `]
})
export class LiveFeedComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  isConnected = false;
  private destroy$ = new Subject<void>();

  constructor(private wsService: WsService) {}

  ngOnInit() {
    this.connectToWebSocket();
  }

  private connectToWebSocket() {
    this.isConnected = true;
    this.wsService.connect('wss://example.com/updates')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message: Message) => {
          this.messages.unshift(message); // Add to top of list
        },
        error: (err) => {
          console.error('WebSocket error:', err);
          this.isConnected = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }
}
```

---

78) NgRx store intro
- Goal: centralize app state using Redux pattern (NgRx).
- Steps:
  1. Install @ngrx/store: `npm install @ngrx/store`
  2. Define actions (what happened)
  3. Create reducer (how state changes)
  4. Create selectors (how to read state)
  5. Configure store in bootstrap
  6. Dispatch actions from components
  7. Select and subscribe to state changes
- Best example: counter with increment/decrement actions.
- Brief explanation: NgRx separates state (single source of truth) from actions and reducers (pure functions).
- Learning tips:
  - Actions describe what happened (e.g., "UserLoggedIn")
  - Reducers take current state + action and return new state (must be pure)
  - Selectors are memoized functions to read specific parts of state
  - Always return new object/array from reducer (immutability)
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/counter.state.ts
// Define state shape
export interface CounterState {
  count: number;
  lastAction: string;
  history: number[];
}

export const initialCounterState: CounterState = {
  count: 0,
  lastAction: 'init',
  history: [0]
};
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/counter.actions.ts
import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
export const incrementBy = createAction('[Counter] Increment By', props<{ value: number }>());
export const reset = createAction('[Counter] Reset');
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/counter.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { CounterState, initialCounterState } from './counter.state';
import * as CounterActions from './counter.actions';

export const counterReducer = createReducer(
  initialCounterState,
  
  on(CounterActions.increment, (state: CounterState) => ({
    ...state,
    count: state.count + 1,
    lastAction: 'increment',
    history: [...state.history, state.count + 1]
  })),

  on(CounterActions.decrement, (state: CounterState) => ({
    ...state,
    count: state.count - 1,
    lastAction: 'decrement',
    history: [...state.history, state.count - 1]
  })),

  on(CounterActions.incrementBy, (state: CounterState, { value }) => ({
    ...state,
    count: state.count + value,
    lastAction: `incrementBy(${value})`,
    history: [...state.history, state.count + value]
  })),

  on(CounterActions.reset, (state: CounterState) => ({
    ...state,
    count: 0,
    lastAction: 'reset',
    history: [0]
  }))
);
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/counter.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CounterState } from './counter.state';

export const selectCounterState = createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  (state: CounterState) => state.count
);

export const selectLastAction = createSelector(
  selectCounterState,
  (state: CounterState) => state.lastAction
);

export const selectHistory = createSelector(
  selectCounterState,
  (state: CounterState) => state.history
);
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { counterReducer } from './app/store/counter.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({
      counter: counterReducer
    })
  ]
});
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/counter.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { CounterState } from './counter.state';
import * as CounterActions from './counter.actions';
import * as CounterSelectors from './counter.selectors';

@Component({
  selector: 'app-counter-store',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-container">
      <h2>NgRx Counter</h2>
      
      <div class="counter-display">
        <h1>{{ count$ | async }}</h1>
        <p>Last Action: {{ lastAction$ | async }}</p>
      </div>

      <div class="controls">
        <button (click)="decrement()">- Decrement</button>
        <button (click)="increment()">+ Increment</button>
        <button (click)="incrementBy(5)">+ By 5</button>
        <button (click)="reset()">Reset</button>
      </div>

      <div class="history">
        <h3>History</h3>
        <p>{{ (history$ | async)?.join(', ') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .counter-container { max-width: 400px; margin: 20px auto; padding: 20px; }
    .counter-display { text-align: center; margin: 20px 0; }
    .counter-display h1 { font-size: 3em; margin: 10px 0; }
    .controls { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
    button { padding: 10px 15px; cursor: pointer; border: none; border-radius: 4px; background: #1976d2; color: white; }
    button:hover { background: #1565c0; }
    .history { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; }
  `]
})
export class CounterStoreComponent {
  count$ = this.store.select(CounterSelectors.selectCount);
  lastAction$ = this.store.select(CounterSelectors.selectLastAction);
  history$ = this.store.select(CounterSelectors.selectHistory);

  constructor(private store: Store<{ counter: CounterState }>) {}

  increment() { this.store.dispatch(CounterActions.increment()); }
  decrement() { this.store.dispatch(CounterActions.decrement()); }
  incrementBy(value: number) { this.store.dispatch(CounterActions.incrementBy({ value })); }
  reset() { this.store.dispatch(CounterActions.reset()); }
}
```

---

79) NgRx Effects
- Goal: handle side effects (HTTP calls) triggered by actions.
- Steps:
  1. Install @ngrx/effects: `npm install @ngrx/effects`
  2. Create effect service with `@Injectable()`
  3. Define effect using `createEffect()` and `ofType()`
  4. Use `switchMap` to convert action to HTTP observable
  5. Map success response to success action
  6. Catch errors and map to error action
  7. Register EffectsModule or provideEffects in bootstrap
- Best example: load items on LoadItems action.
- Brief explanation: effects keep async logic (HTTP, timers) out of reducers and components.
- Learning tips:
  - Effects don't return values; they dispatch new actions
  - Use `switchMap` to cancel previous if new action arrives (e.g., search)
  - `dispatch: false` prevents effect from auto-dispatching
  - Always unsubscribe or use `takeUntil` in tests
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/items.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadItems = createAction('[Items] Load Items');
export const loadItemsSuccess = createAction(
  '[Items] Load Items Success',
  props<{ items: any[] }>()
);
export const loadItemsFailure = createAction(
  '[Items] Load Items Failure',
  props<{ error: string }>()
);
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/items.state.ts
export interface ItemsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export const initialItemsState: ItemsState = {
  items: [],
  loading: false,
  error: null
};
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/items.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { ItemsState, initialItemsState } from './items.state';
import * as ItemsActions from './items.actions';

export const itemsReducer = createReducer(
  initialItemsState,

  on(ItemsActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),

  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/items.effects.ts
import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, delay } from 'rxjs/operators';
import * as ItemsActions from './items.actions';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemsEffects {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(() =>
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts?_limit=5').pipe(
          map(items => ItemsActions.loadItemsSuccess({ items })),
          catchError(error => of(ItemsActions.loadItemsFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/store/items.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as ItemsActions from './items.actions';
import * as ItemsSelectors from './items.selectors';

@Component({
  selector: 'app-items-effect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="items-container">
      <h2>Items (NgRx Effects)</h2>
      <button (click)="loadItems()">Load Items</button>

      <div *ngIf="(loading$ | async)" class="loading">⏳ Loading...</div>
      <div *ngIf="(error$ | async) as err" class="error">❌ {{ err }}</div>

      <ul *ngIf="(items$ | async) as items">
        <li *ngFor="let item of items">{{ item.title }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .items-container { max-width: 600px; margin: 20px auto; }
    button { padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px; }
    .loading { color: #1976d2; margin: 10px 0; }
    .error { color: #d32f2f; margin: 10px 0; }
    ul { list-style: none; padding: 0; }
    li { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
  `]
})
export class ItemsEffectComponent implements OnInit {
  items$ = this.store.select(ItemsSelectors.selectItems);
  loading$ = this.store.select(ItemsSelectors.selectLoading);
  error$ = this.store.select(ItemsSelectors.selectError);

  constructor(private store: Store<{ items: any }>) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.store.dispatch(ItemsActions.loadItems());
  }
}
```

---

80) Performance: OnPush change detection
- Goal: reduce unnecessary change detection checks for better performance.
- Steps:
  1. Import `ChangeDetectionStrategy` from `@angular/core`
  2. Set `changeDetection: ChangeDetectionStrategy.OnPush` in @Component
  3. Ensure all inputs use immutable objects/arrays
  4. Use `async` pipe for observables (auto-marked for check)
  5. If needed, inject `ChangeDetectorRef` and call `markForCheck()` manually
- Best example: list component receiving input array.
- Brief explanation: OnPush only triggers when @Input reference changes or component events fire.
- Learning tips:
  - Default strategy checks on every possible event (slow for large trees)
  - OnPush is compatible with async pipe and Observables
  - Always create new array/object for changes: `items = [...items, newItem]`
  - Don't mutate: `items.push(item)` won't trigger with OnPush
- Complete working code:

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/performance/list-onpush.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-onpush',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list-container">
      <h3>List (OnPush)</h3>
      <p>Items received: {{ items.length }}</p>
      <ul>
        <li *ngFor="let item of items; trackBy: trackById">
          {{ item.name }} - ${{ item.price }}
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .list-container { padding: 10px; border: 1px solid #ddd; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px; background: #f9f9f9; margin: 5px 0; }
  `]
})
export class ListOnPushComponent {
  @Input() items: { id: number; name: string; price: number }[] = [];

  trackById(index: number, item: any) {
    return item.id;
  }
}
```

```typescript
// filepath: /workspaces/angHub/ngApp/src/app/performance/parent-onpush.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOnPushComponent } from './list-onpush.component';

@Component({
  selector: 'app-parent-onpush',
  standalone: true,
  imports: [CommonModule, ListOnPushComponent],
  template: `
    <div class="parent-container">
      <h2>Parent Container</h2>
      <button (click)="addItem()">Add Item</button>
      <p>Total items: {{ items.length }}</p>
      
      <app-list-onpush [items]="items"></app-list-onpush>
    </div>
  `,
  styles: [`
    .parent-container { max-width: 600px; margin: 20px auto; padding: 20px; }
    button { padding: 10px; background: #1976d2; color: white; border: none; cursor: pointer; }
  `]
})
export class ParentOnPushComponent {
  items = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 }
  ];

  addItem() {
    // Create NEW array (immutable) to trigger change detection
    this.items = [
      ...this.items,
      { id: this.items.length + 1, name: `Item ${this.items.length + 1}`, price: 50 }
    ];
  }
}
```

---

Continuing with exercises 81-100 in the same detailed format...

(Due to length, I'll continue with a few more key ones and provide a summary command to create all files)