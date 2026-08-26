# Design structure and flow for Yjs

## Scope

- For `./website/src/features/template`

## Purpose

- Hiện tại, tôi đang implement yjs một cách cực kỳ đơn giản, gồm nhiều thao tác trực tiếp và phụ thuộc vào nhau.
- Ví dụ: khi xóa session, tôi sẽ phải tự vào widget và tất cả chúng
- Trong lần cập nhật này, chúng ta sẽ xây dựng mô hình tương tác cho yjs của dự án này.
- Lấy ý tưởng từ Doctrine với các EntityListener
- Kết hợp với react

## Ý tưởng

- Tôi sẽ tổ chức dữ liệu thành các module. Ví dụ: SessionModule
- Mỗi module sẽ bao gồm các hàm được đang ký. Ví dụ

```ts
@When({ entity: string, event: 'post'})
```

- Tạo 1 hook dang useTransaction() return danh sach [entity, event]

## Flow cho 1 cập nhật

```
Tôi gọi hàm thêm addWidget -> cap nhat du lieu cho map widgets -> return [widget, `widget`, `post`] -> dung du lieu tra ve, lap qua tat ca module duoc dang ky -> module properties có sự kiến -> cập nhật map properies -> tiếp tục duyệt tất cả module -> kết thúc, gửi cập nhật

```

```ts
TemplateDoc {
  modules: [sessionModule, properitesModule, widgetModule]
}

PropertiesModule {
  @When('widget', 'post')
  onAddWidget(widget) {}
}

```

```ts
function useTransactionHandler((callback) => {
  doc.transaction(()=> {
    const events = callback(); // array or object, iterator, ...
    modules.foreach((modules) => {
      module.on(events);
    }
  });
})
```

## Dùng `mitt` thay vì tự lặp qua modules

- Vấn đề của cách lặp thủ công: mỗi lần transaction chạy xong, phải duyệt qua **tất cả** module rồi gọi `module.on(events)`, dù module đó có quan tâm sự kiện hay không. Thêm/bớt module cũng phải sửa `useTransactionHandler`.
- Thay vào đó, dùng một event emitter (`mitt`) làm trung gian: mỗi module tự đăng ký các handler được đánh dấu `@When` vào emitter theo key `` `${entity}:${event}` `` (vd: `widget:post`). `useTransactionHandler` chỉ còn nhiệm vụ `emit`, không cần biết ai đang lắng nghe.

```ts
import mitt from 'mitt';

type Events = Record<string, unknown>; // có thể định nghĩa chi tiết theo từng entity/event

const emitter = mitt<Events>();

// Đọc metadata từ @When và đăng ký vào emitter
function registerModule(module: object) {
  const listeners = getWhenMetadata(module); // [{ entity, event, handler }]
  listeners.forEach(({ entity, event, handler }) => {
    emitter.on(`${entity}:${event}`, handler.bind(module));
  });
}

modules.forEach(registerModule);

function useTransactionHandler(
  callback: () => Array<[payload: unknown, entity: string, event: string]>,
) {
  return () => {
    doc.transaction(() => {
      const events = callback();
      events.forEach(([payload, entity, event]) => {
        emitter.emit(`${entity}:${event}`, payload);
      });
    });
  };
}
```

- Lợi ích:
  - Chỉ những module có đăng ký `entity:event` tương ứng mới được gọi, không phải duyệt toàn bộ.
  - Thêm/bớt module không cần sửa `useTransactionHandler`.
  - Nhiều module có thể cùng lắng nghe 1 sự kiện (many-to-many) mà không cần biết về nhau.
  - `mitt` rất nhỏ (~200 bytes), không kéo thêm dependency nặng.
- Lưu ý: cần `emitter.off(...)` tương ứng khi module bị destroy/unmount (đặc biệt khi module gắn với lifecycle của component React) để tránh leak listener.

## Hoàn thiện `@When`, `getWhenMetadata` và `registerModule`

- `registerModule` ở trên đang gọi `getWhenMetadata` nhưng chưa định nghĩa nguồn metadata đến từ đâu. `@When` cần lưu lại danh sách `{ entity, event, methodName }` lên chính class, để `getWhenMetadata` đọc ra khi module được khởi tạo.

```ts
import 'reflect-metadata';

const WHEN_METADATA_KEY = Symbol('when');

interface WhenMeta {
  entity: string;
  event: string;
  methodName: string | symbol;
}

function When(meta: { entity: string; event: string }) {
  return function (target: object, methodName: string | symbol) {
    const existing: WhenMeta[] =
      Reflect.getMetadata(WHEN_METADATA_KEY, target.constructor) ?? [];
    existing.push({ ...meta, methodName });
    Reflect.defineMetadata(WHEN_METADATA_KEY, existing, target.constructor);
  };
}

function getWhenMetadata(module: object): WhenMeta[] {
  return Reflect.getMetadata(WHEN_METADATA_KEY, module.constructor) ?? [];
}
```

- `registerModule` cần trả về hàm **unregister** (thay vì chỉ đăng ký một chiều), và mỗi handler nên được bọc `try/catch` — nếu 1 module throw lỗi, các module khác đăng ký cùng `entity:event` vẫn phải chạy tiếp (mitt gọi tuần tự các listener, 1 exception không bắt sẽ chặn các listener sau nó).

```ts
function registerModule(module: object): () => void {
  const listeners = getWhenMetadata(module);

  const bound = listeners.map(({ entity, event, methodName }) => {
    const key = `${entity}:${event}`;
    const handler = (payload: unknown) => {
      try {
        (module as Record<string, (payload: unknown) => void>)[methodName as string](payload);
      } catch (error) {
        console.error(`[${module.constructor.name}] lỗi khi xử lý sự kiện "${key}"`, error);
      }
    };
    emitter.on(key, handler);
    return { key, handler };
  });

  return function unregister() {
    bound.forEach(({ key, handler }) => emitter.off(key, handler));
  };
}
```

- Tích hợp với React qua hook, để module tự đăng ký khi mount và tự dọn khi unmount (tránh leak, đúng với lifecycle component):

```ts
function useModule<T extends object>(createModule: () => T) {
  useEffect(() => {
    const module = createModule();
    const unregister = registerModule(module);
    return unregister;
  }, [createModule]);
}

// Sử dụng
useModule(() => new PropertiesModule());
```

- Để component (không phải module) muốn re-render khi 1 `entity:event` cụ thể xảy ra (đúng ý `useTransaction()` trả về `[entity, event]` trong ý tưởng ban đầu), có thể thêm 1 hook riêng dùng chung emitter:

```ts
function useEntityEvent(entity: string, event: string, callback: (payload: unknown) => void) {
  useEffect(() => {
    const key = `${entity}:${event}`;
    emitter.on(key, callback);
    return () => emitter.off(key, callback);
  }, [entity, event, callback]);
}
```

- Vấn đề còn mở, cần quyết định trước khi implement:
  - **Type-safety cho `Events`**: hiện đang để `Record<string, unknown>`. Nên định nghĩa map cụ thể dạng `{'widget:post': Widget; 'widget:delete': string; ...}` để `emitter.on/emit` được typed đầy đủ, tránh gõ nhầm key `entity:event`.
  - **Sự kiện lồng nhau trong 1 transaction**: nếu `PropertiesModule.onAddWidget` lại tự cập nhật map và phát sinh thêm sự kiện mới (vd `properties:post`), sự kiện đó có nên emit ngay trong cùng transaction hay gom lại rồi emit sau khi `doc.transaction()` kết thúc? Emit ngay có thể gây đệ quy khó kiểm soát nếu 2 module bắt chéo sự kiện của nhau.
  - **Thứ tự đăng ký module**: nếu nhiều module cùng nghe 1 `entity:event`, thứ tự gọi phụ thuộc thứ tự `registerModule` — cần quyết định có cần đảm bảo thứ tự cố định (vd theo mảng `modules` khai báo ở `TemplateDoc`) hay không.

## Tách thành package riêng: điều chỉnh thiết kế

- Tên package: `@tomato/crdt` — chọn để tên nói rõ ngay đây là package xử lý vấn đề đồng bộ/CRDT (Yjs), không phải 1 state-management chung chung.
- Class core chốt tên là **`CrdtDoc`** (không phải `YDoc`/`EntityDoc`/`TemplateDoc`) — đồng bộ trực tiếp với tên package `@tomato/crdt`, `import { CrdtDoc } from '@tomato/crdt'` nói rõ ngay bản chất mà không cần đọc thêm docs.
- Getter/setter cho từng loại dữ liệu (`widgets`, `sessions`, ...) **không đặt trên `CrdtDoc`** — chuyển xuống từng "Handler" (tên thay thế cho "Module", lý do giữ như bản trước: "Module" dễ nhầm ES module/NestJS, "Entity" đụng từ khóa `entity` đang dùng). Mỗi Handler tự biết map nào thuộc về mình, `CrdtDoc` chỉ giữ `Y.Doc` gốc + cơ chế đăng ký/emit, không biết gì về schema cụ thể.
- Danh sách Handler **không hardcode** trong class — đăng ký động bằng `crdtDoc.registerHandler(...)`, gọi ở đâu cũng được, thêm Handler mới không cần sửa package core.
- Cần các lifecycle interface cho Handler, tương tự NestJS: `OnHandlerInit`, `OnHandlerDestroy`.
- **Handler không được tự gọi `transact`.** Method trong Handler chỉ mutate map + trả về danh sách event, không mở transaction. Transaction boundary chỉ được mở ở 1 chỗ duy nhất: hook `useTransaction()` phía React.
- **`@When` đổi từ nhận JSON `{ entity, event }` sang nhận thẳng class Event.** Lý do: JSON key không cho compiler biết được gì — tham số của method xử lý (`onSessionDeleted(sessionId: string)`) phải tự gõ tay, sai kiểu compiler không bắt được; kiểu trả về của action method (`TransactionEvent = [payload: unknown, ...]`) cũng chỉ là `unknown`. Chuyển sang **1 class kế thừa `CrdtEvent` cho mỗi loại sự kiện**, method trả về instance của class đó, và `@When(EventClass)` nhận thẳng class — tham số trong handler được suy ra đúng kiểu của `EventClass`, không còn phải khai tay.
- Vì key giờ là **class** chứ không phải string, bỏ `mitt` (API của nó key theo `string | symbol`, không hợp) — thay bằng 1 `Map<EventClass, Set<listener>>` tự viết, chỉ vài dòng, đánh đổi cái lợi "thư viện nhỏ ~200 bytes" của mitt để lấy type-safety.

```ts
// --- Core (sẽ tách thành package riêng @tomato/crdt) ---

abstract class CrdtEvent {}

type EventConstructor<T extends CrdtEvent = CrdtEvent> = new (...args: never[]) => T;

interface OnHandlerInit {
  onHandlerInit(): void;
}

interface OnHandlerDestroy {
  onHandlerDestroy(): void;
}

function isOnHandlerInit(handler: object): handler is OnHandlerInit {
  return typeof (handler as OnHandlerInit).onHandlerInit === 'function';
}
function isOnHandlerDestroy(handler: object): handler is OnHandlerDestroy {
  return typeof (handler as OnHandlerDestroy).onHandlerDestroy === 'function';
}

const WHEN_METADATA_KEY = Symbol('when');

interface WhenMeta {
  eventType: EventConstructor;
  methodName: string | symbol;
}

function When<T extends CrdtEvent>(eventType: EventConstructor<T>) {
  return function (target: object, methodName: string | symbol) {
    const existing: WhenMeta[] =
      Reflect.getMetadata(WHEN_METADATA_KEY, target.constructor) ?? [];
    existing.push({ eventType, methodName });
    Reflect.defineMetadata(WHEN_METADATA_KEY, existing, target.constructor);
  };
}

function getWhenMetadata(handler: object): WhenMeta[] {
  return Reflect.getMetadata(WHEN_METADATA_KEY, handler.constructor) ?? [];
}

const LISTENER_METADATA_KEY = Symbol('listener');

// Class decorator - đánh dấu 1 class là hợp lệ để đăng ký vào CrdtDoc.
// Khác với @When (gắn trên method, chọn method nào xử lý event nào),
// @Listener() gắn trên class, xác nhận cả class được CrdtDoc "biết tới".
function Listener(): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(LISTENER_METADATA_KEY, true, target);
  };
}

function isListener(ctor: Function): boolean {
  return Reflect.getMetadata(LISTENER_METADATA_KEY, ctor) === true;
}

class CrdtDoc {
  readonly doc: Y.Doc;
  private readonly listeners = new Map<EventConstructor, Set<(event: CrdtEvent) => void>>();
  private readonly instances = new Map<Function, object>();
  private readonly unregisterFns: Array<() => void> = [];

  constructor() {
    this.doc = new Y.Doc();
  }

  on<T extends CrdtEvent>(eventType: EventConstructor<T>, listener: (event: T) => void): () => void {
    const set = this.listeners.get(eventType) ?? new Set();
    set.add(listener as (event: CrdtEvent) => void);
    this.listeners.set(eventType, set);
    return () => set.delete(listener as (event: CrdtEvent) => void);
  }

  emit(event: CrdtEvent): void {
    this.listeners.get(event.constructor as EventConstructor)?.forEach((listener) => listener(event));
  }

  registerHandler<T extends object>(handler: T): T {
    if (!isListener(handler.constructor)) {
      throw new Error(`"${handler.constructor.name}" thiếu @Listener() - không thể đăng ký vào CrdtDoc`);
    }
    if (this.instances.has(handler.constructor)) {
      throw new Error(`Handler "${handler.constructor.name}" đã được đăng ký`);
    }
    this.instances.set(handler.constructor, handler);

    getWhenMetadata(handler).forEach(({ eventType, methodName }) => {
      const off = this.on(eventType, (event) => {
        try {
          (handler as Record<string, (e: CrdtEvent) => void>)[methodName as string](event);
        } catch (error) {
          console.error(`[${handler.constructor.name}] lỗi khi xử lý "${eventType.name}"`, error);
        }
      });
      this.unregisterFns.push(off);
    });

    if (isOnHandlerInit(handler)) handler.onHandlerInit();
    return handler;
  }

  getHandler<T extends object>(ctor: new (...args: never[]) => T): T {
    const found = this.instances.get(ctor);
    if (!found) throw new Error(`Handler "${ctor.name}" chưa được đăng ký vào CrdtDoc`);
    return found as T;
  }

  destroy(): void {
    this.instances.forEach((handler) => {
      if (isOnHandlerDestroy(handler)) handler.onHandlerDestroy();
    });
    this.unregisterFns.forEach((fn) => fn());
    this.doc.destroy();
  }
}
```

- Event ví dụ — mỗi loại sự kiện là 1 class riêng, payload là property có kiểu rõ ràng thay vì `unknown`:

```ts
class WidgetAddedEvent extends CrdtEvent {
  constructor(readonly widget: Widget) {
    super();
  }
}

class SessionDeletedEvent extends CrdtEvent {
  constructor(readonly sessionId: string) {
    super();
  }
}
```

- Handler ví dụ — action method trả về `CrdtEvent[]` (thay vì tuple `unknown`), `@When(EventClass)` nhận thẳng class, tham số của handler được suy ra đúng kiểu `SessionDeletedEvent`, không cần khai tay `sessionId: string` nữa:

```ts
@Listener()
class WidgetHandler {
  constructor(private readonly crdtDoc: CrdtDoc) {}

  private get widgets() {
    return this.crdtDoc.doc.getMap<Widget>('widgets');
  }

  getWidget(id: string): Widget | undefined {
    return this.widgets.get(id);
  }

  addWidget(id: string, type: WidgetType, before: Widget | null): CrdtEvent[] {
    const widget = { id, type, ...WidgetItems[type].defaultSettings };
    this.widgets.set(id, widget);
    return [new WidgetAddedEvent(widget)];
  }

  @When(SessionDeletedEvent)
  onSessionDeleted(event: SessionDeletedEvent) {
    // event.sessionId có sẵn type, không còn đoán mò như "sessionId: string" viết tay
  }
}
```

- Hook phía React — `CrdtDoc` không còn method `transact`, chỉ expose `doc` (raw `Y.Doc`), `emit` và `on`. Việc mở transaction + emit event được **ghép ở tầng hook**, đây là nơi duy nhất được gọi `crdtDoc.doc.transact(...)`; `useHandler()` chỉ để lấy instance Handler đã đăng ký:

```ts
function useTransaction() {
  const crdtDoc = useCrdtDoc(); // context tương tự useTemplateDoc hiện tại
  return useCallback(
    (callback: () => CrdtEvent[]) => {
      crdtDoc.doc.transact(() => {
        callback().forEach((event) => crdtDoc.emit(event));
      });
    },
    [crdtDoc],
  );
}

function useHandler<T extends object>(ctor: new (...args: never[]) => T): T {
  const crdtDoc = useCrdtDoc();
  return crdtDoc.getHandler(ctor);
}
```

- Hook cho component (không phải Handler) muốn re-render khi 1 event cụ thể xảy ra — cũng type-safe theo class:

```ts
function useCrdtEvent<T extends CrdtEvent>(
  eventType: EventConstructor<T>,
  callback: (event: T) => void,
) {
  const crdtDoc = useCrdtDoc();
  useEffect(() => crdtDoc.on(eventType, callback), [crdtDoc, eventType, callback]);
}
```

- Action hook ví dụ (thay cho `useWidgetActions` hiện tại) — chỉ còn nhiệm vụ gọi method của Handler bên trong `transact`:

```ts
export function useWidgetActions(): WidgetActions {
  const widgetHandler = useHandler(WidgetHandler);
  const transact = useTransaction();

  const addWidget = useCallback(
    (id: Widget['id'], type: Widget['type'], before: Widget | null) => {
      transact(() => widgetHandler.addWidget(id, type, before));
    },
    [widgetHandler, transact],
  );

  return { addWidget };
}
```

- Đăng ký Handler động, ở nơi khởi tạo doc cho feature template (thay cho `TemplateDocProvider` hiện tại), package core không biết gì về các Handler cụ thể này. Vì `crdtDoc` đã tồn tại xong mới tạo Handler (không phải ngược lại), không có vòng phụ thuộc, Handler constructor nhận thẳng `crdtDoc`:

```ts
const crdtDoc = new CrdtDoc();
crdtDoc.registerHandler(new WidgetHandler(crdtDoc));
crdtDoc.registerHandler(new SessionHandler(crdtDoc));
crdtDoc.registerHandler(new PropertiesHandler(crdtDoc));
// thêm Handler mới về sau chỉ cần gọi thêm registerHandler ở đây, kể cả sau khi doc đã chạy
```

- **Đã chốt:**
  - Package: `@tomato/crdt`. Class core: `CrdtDoc`.
  - Cần class decorator ngoài `@When`: có — thêm `@Listener()` gắn trên class, `registerHandler` throw ngay nếu thiếu (bắt lỗi lúc đăng ký thay vì im lặng không handler nào chạy khi quên decorate).

- **Vấn đề mở còn lại, cần chốt trước khi tách package:**
  - `getHandler` dùng `Map<Function, instance>` theo constructor — nếu đăng ký 2 lần cùng 1 class sẽ throw (đã thêm check ở trên); cần xác nhận đây đúng là hành vi mong muốn hay nên cho phép override.
  - Bỏ `mitt` đổi lấy type-safety — cần xác nhận đây là đánh đổi chấp nhận được (mất ~200 bytes lib nhỏ, đổi lại tự viết/tự bảo trì phần pub-sub key-theo-class).

## Trạng thái triển khai

- **Đổi tên cuối cùng**: package + class core đổi từ `@tomato/crdt`/`CrdtDoc` sang **`@tomato/sync`/`SyncDoc`** (và `CrdtEvent` → `SyncEvent`) — "CRDT" vẫn đúng về mặt kỹ thuật (Yjs là CRDT) nhưng "sync" mô tả đúng hơn thứ người dùng package quan tâm (đồng bộ realtime), nên toàn bộ code/README dưới đây dùng tên mới; các đoạn thiết kế phía trên vẫn giữ nguyên `CrdtDoc` làm dấu vết lịch sử quyết định đặt tên.
- [x] Package `@tomato/sync` đã tạo tại `packages/sync/` (`SyncDoc`, `SyncEvent`, `OnSyncEvent`, `SyncHandler`, `OnSynced`/`OnDestroy`, hooks React `useSyncDoc`/`useHandler`/`useTransaction`/`useSyncEvent`) + `README.md` riêng cho package. *(Tên decorator/interface đã đổi thêm vài lần sau đó — xem 2 mục cuối cùng của checklist này để biết tên hiện hành.)*
- [x] `website/tsconfig.json` bật `experimentalDecorators: true` (bắt buộc để dùng `@OnSyncEvent`/`@SyncHandler`); `website/package.json` thêm `@tomato/sync: workspace:*`.
- [x] `website/src/features/template/sync/` — `events.ts` + 4 Handler: `WidgetHandler` (map `widgets`), `SessionHandler` (map `sessions`), `LayoutHandler` (map `layouts`+`widgetToSession`, phản ứng `WidgetAddedEvent`/`WidgetRemovedEvent` để tự đặt layout/session thay vì bị gọi thủ công), `TemplateHandler` (text `name` + `meta.ready`).
- [x] `TemplateDocProvider.tsx` khởi tạo `SyncDoc` thay vì `new Y.Doc()`, đăng ký Handler qua `createSyncDoc()`, cung cấp qua `SyncDocProvider` của package.
- [x] `templateDocInit.ts` dùng `syncDoc.doc`/`TemplateHandler.isReady()`; seed system widget vẫn ghi thẳng map `widgets` (không qua `WidgetHandler.addWidget`) để không kích hoạt `LayoutHandler` đặt layout cho widget hệ thống — hành vi giữ nguyên như bản gốc.
- [x] `useWidgetActions`, `useSessionActions`, `useTemplateActions` viết lại dùng `useHandler`+`useTransaction`, không còn `doc.getMap`/`doc.transact` trực tiếp.
- [x] **Đổi tiếp cách phát event**: Handler method không còn trả về `SyncEvent[]` cho `useTransaction` tự emit hộ — giờ gọi thẳng `this.syncDoc.emit(new XxxEvent(...))` bên trong chính method, method trả `void`. `useTransaction` theo đó cũng đơn giản lại thành `syncDoc.doc.transact(callback)` thuần, không còn logic lặp qua mảng event.
- [x] Tách `sync/actions/` (giữ pattern `hooks/actions` cũ) → đổi tên thành `sync/hooks/`; bỏ `useCallback` bọc từng action vì `useHandler`/`useTransaction` đã tự ổn định tham chiếu.
- [x] `initTemplateDoc` (hàm rời) → `TemplateInitHandler` (`@Listener()`, `implements OnSynced` tường minh — không chỉ định nghĩa method trùng tên rồi để runtime tự duck-type, mà khai `implements` để compiler tự bắt lỗi nếu sai chữ ký `onSynced`) — đăng ký cùng lúc với 4 Handler kia trong `createSyncDoc()`.
- [x] **Tách `registerHandler` khỏi lifecycle synced/destroy**: `SyncDoc` đổi tên `OnHandlerInit`/`OnHandlerDestroy`/`init()` → **`OnSynced`/`OnDestroy`/`synced()`** (đặt tên đúng bản chất — hook này chỉ có 1 lý do tồn tại là "chạy sau khi doc đã synced", không phải khởi tạo chung chung), song song với `destroy()` sẵn có — chạy `onSynced()` trên *mọi* Handler đã đăng ký có implement, như 1 phase riêng do app tự gọi khi thấy phù hợp, thay vì fire ngay lúc `registerHandler`. `TemplateDocProvider` gọi `nextSyncDoc.synced()` trong callback `"synced"`. Gọi lại nhiều lần (vd sau reconnect) an toàn vì `isReady()` bên trong `TemplateInitHandler.onSynced` đã tự guard; `synced()` bản thân không đăng ký gì nên không có rủi ro throw như `registerHandler`.
- [x] **Đổi tên decorator cuối cùng**: `Listener` → **`SyncHandler`**, `When` → **`OnSyncEvent`** (cùng các helper nội bộ đi kèm: `isListener`→`isSyncHandler`, `WhenMeta`→`OnSyncEventMeta`, `getWhenMetadata`→`getOnSyncEventMetadata`). Áp dụng lại toàn bộ 5 Handler ở `website/.../sync/handlers/`. Đây là tên hiện hành, các đoạn thiết kế phía trên (mục "Tách thành package riêng...") vẫn giữ nguyên `@Listener`/`@When` làm dấu vết lịch sử.
- [ ] Chưa chạy `pnpm install` (cần thiết để pnpm link package `@tomato/sync` mới vào `node_modules`, IDE đang báo "Cannot find module" cho tới lúc đó) — không tự chạy theo rule "Avoid run project" trong CLAUDE.md.
- [ ] Chưa chạy `pnpm typecheck`/`pnpm lint`/mở trình duyệt để verify — theo rule "Avoid run eslint, typecheck" trong CLAUDE.md, cần người dùng tự chạy và xác nhận.
- [ ] 2 vấn đề mở ở trên (override khi đăng ký trùng, đánh đổi bỏ `mitt`) vẫn chưa cần quyết lại vì bản triển khai đang theo đúng lựa chọn mặc định đã ghi (throw khi trùng, bỏ hẳn mitt).
