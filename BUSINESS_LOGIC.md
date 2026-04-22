# Grano App — Детальний опис бізнес-логіки

## Загальний опис

**Grano** — це мобільний додаток для українських фермерів, розроблений компанією **Faynosoft**. Назва походить від слова "grano" (зерно). Додаток поєднує три основні бізнес-домени:

1. **Управління фермерськими полями** — облік полів, сільськогосподарських операцій, культур
2. **Інтернет-магазин агрохімії** — каталог, кошик, оформлення замовлень
3. **AI-діагностика рослин** — визначення хвороб рослин по фото (в процесі розробки)

Додаткові функції: погода, push-сповіщення, зворотній зв'язок, картка клієнта.

**Технологічний стек:** Flutter (Dart ^3.9.0), BLoC/Cubit, GetIt DI, go_router, Dio, Firebase (Analytics, Messaging, Crashlytics), Google Maps, SharedPreferences.

**Локалізація:** Основна мова — українська (uk_UA). Весь інтерфейс українською.

**Бекенд:** Мультитенантний REST API (ідентифікація компанії через заголовок `company: 696e7f45a566e6006e11fefd`). Base URL завантажується з `.env.development` / `.env.production`.

---

## Архітектура

Проєкт використовує **Feature-first Clean Architecture**:

```
lib/
├── app/              # Інфраструктура (DI, роутер, тема, утиліти)
├── data/             # Спільний шар даних (моделі, репозиторії, сервіси)
├── domain/           # Спільний доменний шар (use cases)
├── features/         # Функціональні модулі
│   ├── auth/         # Кожен модуль має data/, state/, ui/
│   ├── cart/
│   ├── fields/
│   └── ...
└── shared/           # Спільні UI-компоненти (widgets)
```

**Шари кожного модуля:**
- **UI** (`ui/`) — Flutter-віджети, сторінки
- **State** (`state/`) — Cubit + States (flutter_bloc)
- **Domain** (`domain/usecases/`) — тонкі use case обгортки (не завжди присутні)
- **Data** (`data/`) — Repository + API Service + моделі

**Dependency Injection:** GetIt (service locator) з lazy singletons та factories.

**Навігація:** go_router з `ValueNotifier<bool>` для реактивного auth guard.

**Крос-модульна синхронізація:** `DataSyncService` — broadcast stream для комунікації між кубітами без прямих залежностей.

---

## 1. Аутентифікація (Auth)

### Бізнес-правила

- Реєстрація та вхід за номером телефону (українським, з автоматичним додаванням `+38`)
- JWT аутентифікація (access token + refresh token)
- Автоматичне оновлення токена при 401 помилці (через `QueuedInterceptor`)
- Якщо оновлення токена неможливе — примусовий розлогін (видалення токенів)
- Пароль мінімум 6 символів
- При реєстрації обов'язкові: ім'я, прізвище, телефон, пароль
- При вході: телефон + пароль + інформація про пристрій

### Потік запуску додатку

```
main() → Firebase init → GetIt setup → StorageService init → .env load
  → MultiBlocProvider (ThemeCubit, AuthCubit, IntroCubit, CartCubit, NotificationSettingsCubit)
    → IntroPage → IntroCubit.initialize()
      → AuthCubit.checkAuthStatus()
        → якщо є збережений токен → AuthApiService.getMe()
          → успіх → AuthAuthenticated(user)
          → помилка → clearTokens() → AuthUnauthenticated
        → якщо немає токена → AuthUnauthenticated
      → Router reacts via authStateNotifier
```

### Потік входу

```
Користувач вводить телефон + пароль
  → AuthCubit.signIn(phone, password, deviceInfo)
    → SignInUseCase → AuthRepository.signIn()
      → AuthApiService.signIn() [POST /auth/sign-in]
        → Відповідь: { user, accessToken, refreshToken }
      → StorageService.saveToken() + saveRefreshToken()
    → emit AuthAuthenticated(User)
  → Router перенаправляє на головну сторінку
```

### Потік реєстрації

```
Користувач вводить ім'я, прізвище, телефон, пароль
  → AuthCubit.signUp(firstName, lastName, phone, password, deviceInfo)
    → SignUpUseCase → AuthRepository.signUp()
      → AuthApiService.signUp() [POST /auth/sign-up, очікує 201]
      → Зберігає токени
    → emit AuthAuthenticated(User)
```

### Механізм оновлення токенів

```
Будь-який API запит → 401 Unauthorized
  → AuthorizationInterceptor.onError()
    → Блокує інші запити (QueuedInterceptor)
    → AuthApiService.refreshToken() [окремий Dio інстанс без інтерсепторів]
      → Успіх: зберігає нові токени → повторює оригінальний запит
      → Помилка: clearTokens() → примусовий розлогін
```

### Стани Auth

| Стан | Опис |
|------|------|
| `AuthInitial` | Початковий стан |
| `AuthLoading` | Виконується авторизація |
| `AuthAuthenticated(User)` | Користувач увійшов |
| `AuthUnauthenticated` | Користувач не увійшов |
| `AuthError(message)` | Помилка (404: не знайдено, 400: невірні дані, 401: невірний пароль) |

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/auth/data/auth_api_service.dart` | HTTP-запити до `/auth/`, `/users/` |
| `lib/features/auth/data/auth_repository.dart` | Оркестрація API + збереження токенів |
| `lib/features/auth/domain/usecases/sign_in_usecase.dart` | Use case для входу |
| `lib/features/auth/domain/usecases/sign_up_usecase.dart` | Use case для реєстрації |
| `lib/features/auth/domain/usecases/sign_out_usecase.dart` | Use case для виходу |
| `lib/features/auth/state/auth_cubit.dart` | Глобальний стан авторизації |

---

## 2. Відновлення пароля (Forgot Password)

### Бізнес-правила

- Двоетапний процес: 1) запит коду на телефон, 2) введення коду + новий пароль
- Обмеження частоти запитів коду (400 = rate-limited)
- Код має термін дії (400 = expired code vs. wrong code — різні повідомлення)
- Після успішного скидання — автоматичний вхід (зберігаються нові токени)
- Підтримка повторного надсилання коду (окремий стан `ResendCodeSuccess`)

### Потік

```
1. Користувач вводить номер телефону
   → ForgotPasswordCubit.requestCode(phone)
     → ForgotPasswordApiService.requestCode() [POST /auth/forgot-password]
     → emit ForgotPasswordCodeSent(phone)

2. Користувач вводить код та новий пароль
   → ForgotPasswordCubit.resetPassword(phone, code, newPassword)
     → ForgotPasswordRepository.resetPassword()
       → API повертає: { user, accessToken, refreshToken }
       → Зберігає токени → emit ResetPasswordSuccess(User)
```

### Обробка помилок

| HTTP код | Сценарій | Повідомлення |
|----------|----------|-------------|
| 400 (requestCode) | Rate limit | "Зачекайте перед повторним запитом" |
| 404 (requestCode) | Користувач не знайдений | "Користувача з таким номером не знайдено" |
| 400 (resetPassword) | Невірний/протермінований код | Роздільні повідомлення |

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/forgot_password/data/forgot_password_api_service.dart` | HTTP-запити |
| `lib/features/forgot_password/data/forgot_password_repository.dart` | Логіка + маппінг помилок |
| `lib/features/forgot_password/state/forgot_password_cubit.dart` | Управління станом 2-етапного потоку |

---

## 3. Профіль користувача (Profile)

### Бізнес-правила

- Перегляд профілю: ім'я, телефон, email, бонуси, дата народження
- Перегляд інформації про ферму: назва, регіон, район
- Редагування імені: `PATCH /users`
- Редагування дати народження: `PATCH /users/update-personal-data`
- Зміна пароля: потрібен поточний пароль + новий пароль
- Статистика: кількість замовлень, кількість полів

### Зміна пароля

```
Користувач вводить поточний + новий пароль
  → SecurityCubit.changePassword(currentPassword, newPassword)
    → ChangePasswordUseCase → AuthRepository.changePassword()
      → AuthApiService.changePassword() [PATCH /users/change-password]
      → Успіх: emit SecuritySuccess
      → 400/401: "Невірний поточний пароль"
```

### Модель користувача (User)

| Поле | Тип | Опис |
|------|-----|------|
| `userId` | `String?` | MongoDB `_id` |
| `name` | `String?` | Ім'я (з `firstName`) |
| `email` | `String?` | Email |
| `phone` | `String?` | Телефон |
| `bonuses` | `double?` | Бонусний баланс |
| `dateOfBirth` | `String?` | Дата народження (з `personalDataId.aboutMe.dob`) |
| `ordersCount` | `int?` | Кількість замовлень |
| `fieldsCount` | `int?` | Кількість полів |
| `addresses` | `List<Address>?` | Адреси доставки |
| `farm` | `Farm?` | Інформація про ферму |

---

## 4. Управління полями (Fields — Grano Module)

### Бізнес-правила

- Кожне поле має: назву, площу (га), географічні координати (GeoJSON Polygon), нотатки
- Поле відображається на Google Maps як полігон
- До поля прив'язуються сільськогосподарські операції
- Поле може мати "активну культуру" (active crop) — остання операція посіву
- Пошук полів за назвою
- CRUD операції (створення, перегляд, оновлення, видалення)
- Площа вказується в гектарах, розраховується при малюванні полігона на карті

### Потік створення поля

```
1. Користувач вводить назву + нотатки (AddFieldPage)
2. Переходить на FieldLocationPage — малює полігон на Google Maps
   → Автоматичний розрахунок площі в гектарах (FieldLocationResult)
   → Конвертація LatLng → GeoJSON Polygon (закриття полігона, swap lat↔lng)
3. → FieldsCubit.createField(name, area, geometry, notes)
   → GranoRepository.createField()
     → GranoApiService [POST /grano/fields]
   → Поле додається на початок локального списку
   → emit FieldCreated(field)
```

### GeoJSON конвертація

Координати зберігаються у форматі GeoJSON: `[longitude, latitude]`. Google Maps `LatLng` використовує `(latitude, longitude)`. `FieldLocationResult.toGeoJson()` виконує конвертацію та закриває полігон (перша точка = остання точка).

### Автосинхронізація з операціями

```
OperationsCubit створює/оновлює/видаляє операцію
  → DataSyncService.emit(OperationCreatedEvent/Updated/Deleted)
    → FieldsCubit._listenToSyncEvents() отримує подію
      → _refreshFieldsQuietly() — фоновий рефреш без індикатора завантаження
```

### Модель поля (FieldModel)

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `String` | MongoDB `_id` |
| `name` | `String` | Назва поля |
| `area` | `double` | Площа в гектарах |
| `geometry` | `GeoJsonPolygon` | Координати полігона |
| `notes` | `String?` | Нотатки |
| `operationsCount` | `int` | Кількість операцій |
| `activeCrop` | `OperationModel?` | Активна культура (остання операція посіву) |
| `operations` | `List<OperationModel>` | Список операцій |

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/grano/data/grano_api_service.dart` | Всі API-виклики для полів, операцій, культур |
| `lib/features/grano/data/grano_repository.dart` | Маппінг API → доменні моделі |
| `lib/features/grano/data/models/field_model.dart` | Модель поля + GeoJsonPolygon |
| `lib/features/grano/state/fields/fields_cubit.dart` | Стан CRUD полів + підписка на DataSyncService |
| `lib/features/fields/data/field_location_result.dart` | Конвертація LatLng ↔ GeoJSON |

---

## 5. Сільськогосподарські операції (Operations — Grano Module)

### Бізнес-правила

- Операція прив'язана до конкретного поля
- **5 типів операцій:**
  - `sowing` — Посів (прив'язує культуру до поля)
  - `treatment` — Обробка
  - `fertilization` — Удобрення
  - `harvesting` — Збір урожаю
  - `other` — Інше
- **3 статуси:** `planned` (заплановано), `inProgress` (в процесі), `completed` (виконано)
- Операція може мати: дату планування, нагадування, коментар, очікувану дату збору
- До операції можуть бути прив'язані продукти (добрива, засоби обробки) з кількістю та одиницями
- Завершення операції — спеціальна дія `completeOperation`

### Потік створення операції

```
Користувач обирає тип операції, культуру (для посіву), дату, коментар
  → OperationsCubit.createOperation(fieldId, type, cultureId?, scheduledDate?, ...)
    → GranoRepository.createOperation()
      → GranoApiService [POST /grano/operations]
    → emit OperationCreated(operation)
    → DataSyncService.emit(OperationCreatedEvent(fieldId))
      → FieldsCubit автоматично оновлює список полів
```

### Потік завершення операції

```
OperationsCubit.completeOperation(operationId)
  → GranoRepository.completeOperation(id) [= updateOperation(id, status: completed)]
  → emit OperationUpdated(operation)
  → DataSyncService.emit(OperationUpdatedEvent(fieldId, operationId))
```

### Продукти операції (OperationProduct)

Продукт, що використовується в операції (наприклад, добриво для удобрення):

| Поле | Тип | Опис |
|------|-----|------|
| `operationId` | `String` | Посилання на операцію |
| `productId` | `String` | Посилання на товар з магазину |
| `quantity` | `double?` | Кількість |
| `unit` | `ProductUnit?` | Одиниця виміру: `kg`, `l`, `pcs`, `ha` |

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/grano/data/models/operation_model.dart` | Модель операції, OperationType, OperationStatus |
| `lib/features/grano/data/models/operation_product_model.dart` | Модель продукту операції |
| `lib/features/grano/state/operations/operations_cubit.dart` | CRUD + complete + DataSync emit |

---

## 6. Культури (Cultures — Grano Module)

### Бізнес-правила

- Культура — це тип рослини (пшениця, соняшник, кукурудза тощо)
- CRUD операції
- Кожна культура має: назву (UA), назву (EN, опційно), іконку
- Культура прив'язується до операції типу "посів"

### Модель культури (CultureModel)

| Поле | Тип | Опис |
|------|-----|------|
| `id` | `String` | MongoDB `_id` |
| `name` | `String` | Назва українською |
| `nameEn` | `String?` | Назва англійською |
| `icon` | `String?` | Іконка |

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/grano/data/models/culture_model.dart` | Модель культури |
| `lib/features/grano/state/cultures/cultures_cubit.dart` | CRUD кубіт |

---

## 7. Інтернет-магазин (Shop)

### Бізнес-правила

- Каталог товарів організований по категоріях (підтримуються вкладені підкатегорії)
- Товари мають: назву, зображення, ціну (форматований рядок), опис
- Пошук товарів за ключовим словом
- Пагінація товарів (10 на сторінку, infinite scroll)
- Ціна зберігається як форматований рядок (наприклад, "1 250 ₴") — для обчислень очищається регулярним виразом

### Категорії

```
CategoriesCubit.loadCategories()
  → CategoriesRepository.getCategories()
    → CategoriesApiService [GET /product-categories]
  → emit CategoriesLoaded(List<CategoryModel>)
```

Категорії підтримують вкладеність: `CategoryModel.childrenCategories` — рекурсивний список дочірніх категорій.

### Товари

```
ProductsCubit.loadProducts(categoryId)        — товари однієї категорії
RecommendedProductsCubit.loadProducts()       — усі товари (рекомендовані)
RecommendedProductsCubit.loadMore()           — дозавантаження сторінки
```

### Пошук товарів

```
ProductsRepository.searchProducts(keyword, categoryId?, limit)
  → ProductsApiService [GET /products?filter[keyword]=X]
  → ProductsResult { products, hasNext }
```

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/shop/data/categories_api_service.dart` | API для категорій |
| `lib/features/shop/data/categories_repository.dart` | Маппінг категорій |
| `lib/features/shop/data/products_api_service.dart` | API для товарів (пагінація, пошук) |
| `lib/features/shop/data/products_repository.dart` | Маппінг товарів |
| `lib/features/shop/state/categories_cubit.dart` | Стан категорій |
| `lib/features/shop/state/products_cubit.dart` | Стан товарів категорії (factory) |
| `lib/features/shop/state/recommended_products_cubit.dart` | Стан усіх товарів з пагінацією |

---

## 8. Кошик (Cart)

### Бізнес-правила

- Кошик існує **тільки в пам'яті** (не зберігається між сесіями)
- Додавання товару: якщо товар вже є — збільшується кількість
- Кожен елемент кошика має: товар, кількість, унікальний ID (timestamp)
- Підсумок: `subtotal` + `deliveryFee (100 ₴)` - `discount (0)` = `total`
- Видалення при кількості <= 0
- Очищення кошика після успішного замовлення

### Потік

```
Додавання:
  CartCubit.addToCart(product, quantity)
    → Перевірка: чи є продукт у кошику?
      → Так: quantity += новий quantity
      → Ні: створюється новий CartItem
    → _emitCartState() → перерахунок subtotal

Видалення:
  CartCubit.removeFromCart(cartItemId)
  CartCubit.updateQuantity(cartItemId, quantity)  // quantity <= 0 → remove

Очищення:
  CartCubit.clearCart() → emit CartEmpty
```

### Обчислення ціни

```dart
// CartItem.totalPrice:
double get totalPrice {
  final cleanPrice = product.price.replaceAll(RegExp(r'[^\d.]'), '');
  return (double.tryParse(cleanPrice) ?? 0) * quantity;
}
```

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/cart/data/models/cart_item_model.dart` | Модель елемента кошика |
| `lib/features/cart/state/cart_cubit.dart` | Управління кошиком (singleton) |

---

## 9. Оформлення замовлення (Checkout)

### Бізнес-правила

- Вибір способу доставки: `delivery` (доставка), `novaPoshta` (Нова Пошта)
- Вибір способу оплати: `online` (онлайн), `cashOnDelivery` (накладений платіж), `cash` (готівка)
- Вибір/додавання адреси доставки
- Фіксована вартість доставки: 100 ₴ (передається на бекенд у копійках: ×100)
- Номер замовлення — випадкові 5 цифр (генерується на клієнті, НЕ з сервера)
- Вікно доставки: якщо зараз < 18:00 → сьогодні до 18:00, інакше — завтра до 18:00
- Якщо оплата онлайн — бекенд повертає URL для оплати (WebView)
- Якщо адреса не обрана — використовується захардкоджена адреса в Києві (fallback)

### Потік

```
1. CheckoutCubit.loadCheckout(user, items, total)
   → emit CheckoutLoaded(user, deliveryMethod=delivery, paymentMethod=online)

2. Користувач обирає опції:
   → setDeliveryMethod(method)
   → setPaymentMethod(method)
   → setAddress(address)

3. CheckoutCubit.submitOrder()
   → OrderApiService.createOrder() [POST /client/orders/create]
     → Тіло запиту: { paymentType, address, products, deliveryData, bonusAmount: 0 }
     → products: [{ count, price, productId }]
     → deliveryData: { deliveryPrice (kopecks), deliveryAt: { from, to } }
   → Якщо online + є URL → emit CheckoutPaymentPending(paymentUrl, OrderResult)
   → Якщо інша оплата   → emit CheckoutSuccess(OrderResult)
   → CartCubit.clearCart()
```

### Модель OrderResult

| Поле | Тип | Опис |
|------|-----|------|
| `orderNumber` | `String` | Випадковий 5-значний номер |
| `items` | `List<CartItem>` | Товари замовлення |
| `total` | `double` | Загальна сума |
| `deliveryMethod` | `DeliveryMethod` | Спосіб доставки |
| `paymentMethod` | `PaymentMethod` | Спосіб оплати |
| `orderDate` | `DateTime` | Дата замовлення |

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/checkout/data/order_api_service.dart` | Створення замовлення |
| `lib/features/checkout/data/models/order_result.dart` | Результат замовлення |
| `lib/features/checkout/data/models/delivery_method.dart` | Enum способів доставки |
| `lib/features/checkout/data/models/payment_method.dart` | Enum способів оплати |
| `lib/features/checkout/state/checkout_cubit.dart` | Стан оформлення |

---

## 10. Адреси (Addresses)

### Бізнес-правила

- Адреси зберігаються на бекенді як частина об'єкта User
- Адреса має: назву, коментар, деталі (будинок, квартира, поверх тощо), геолокацію
- Автозаповнення через Google Places API (обмежено Україною, мова — українська)
- Додавання адреси: `PATCH /users/add-address`
- Видалення адреси: `DELETE /users/remove-address/:id`
- Після мутації адрес — `AuthCubit.checkAuthStatus()` або `updateUser()` для синхронізації

### Потік автозаповнення

```
AutocompleteCubit.searchPlaces(input)
  → GooglePlacesService.getAutocomplete(input)
    → Google Places Autocomplete API [country=UA, language=uk]
  → emit AutocompleteLoaded(predictions)

AutocompleteCubit.getLocationDetails(placeId, mainText)
  → GooglePlacesService.getPlaceDetails(placeId)
    → Google Places Details API
  → emit LocationDetailsLoaded(location, mainText)
```

### Потік додавання адреси

```
AddressesCubit.addAddress(title, comments, location)
  → AddressesApiService.addAddress() [PATCH /users/add-address]
  → AuthCubit.checkAuthStatus() — оновлення User з сервера
  → emit AddressAdded(address)
```

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/addresses/data/addresses_api_service.dart` | API для адрес |
| `lib/features/addresses/data/google_places_service.dart` | Google Places інтеграція |
| `lib/features/addresses/data/models/place_prediction.dart` | Моделі автозаповнення |
| `lib/features/addresses/state/addresses_cubit.dart` | CRUD адрес + синхронізація з AuthCubit |
| `lib/features/addresses/state/autocomplete_cubit.dart` | Автозаповнення адрес |

---

## 11. AI-діагностика рослин (AI Diagnosis)

### Поточний стан: В РОЗРОБЦІ

Функціонал частково реалізований:
- Захоплення фото з камери або вибір з галереї (`ImagePicker`)
- Попередній перегляд зображення (preview page)
- Сторінка аналізу з анімацією завантаження
- **Реальний AI-аналіз НЕ реалізований** — `_simulateAnalysis()` просто чекає 3 секунди і повертає назад
- Сторінка історії діагностик існує як заглушка

### Запланований потік

```
1. Користувач робить фото рослини → AiDiagnosisPreviewPage
2. Підтвердження → AiDiagnosisAnalyzingPage
3. Відправка зображення на бекенд/ML-сервіс (TODO)
4. Отримання результату: хвороба + рекомендації (TODO)
5. Збереження в історію (TODO)
```

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/ai_diagnosis/ui/ai_diagnosis_page.dart` | Головна сторінка з камерою/галереєю |
| `lib/features/ai_diagnosis/ui/ai_diagnosis_preview_page.dart` | Попередній перегляд фото |
| `lib/features/ai_diagnosis/ui/ai_diagnosis_analyzing_page.dart` | Анімація аналізу (заглушка) |
| `lib/features/ai_diagnosis/ui/diagnosis_history/diagnosis_history_page.dart` | Історія (заглушка) |

---

## 12. Погода (Weather)

### Бізнес-правила

- Погодні дані з безкоштовного API Open-Meteo (без ключа API)
- Користувач обирає українську область (25 областей + Київ)
- Відображаються: поточна температура, вітер, вологість, опади, код погоди
- Прогноз на 7 днів (максимальна температура, код погоди, ймовірність опадів)
- Обрана область зберігається локально (`RegionLocalStorage`)
- Часовий пояс: `Europe/Kiev`

### Потік

```
WeatherCubit.loadWeather()
  → RegionLocalStorage.getSelectedRegion() → Region (default: Kyiv)
  → WeatherRepository.getWeather(lat, lng, regionName)
    → WeatherApiService [GET api.open-meteo.com/v1/forecast]
  → emit WeatherLoaded(WeatherModel)
```

### Маппінг кодів погоди (WMO Weather Codes)

Кожен числовий код WMO маппиться на:
- Текстовий опис українською (`getDescription(code)`)
- Шлях до іконки в ассетах (`getIconPath(code)`)

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/weather/data/weather_api_service.dart` | API Open-Meteo |
| `lib/features/weather/data/weather_repository.dart` | Маппінг відповіді |
| `lib/features/weather/data/region_local_storage.dart` | Збереження обраної області |
| `lib/features/weather/data/models/weather_model.dart` | Модель погоди + DailyForecast |
| `lib/features/weather/data/models/region_model.dart` | Модель області + список 25 областей |
| `lib/features/weather/state/weather_cubit.dart` | Стан погоди |

---

## 13. Push-сповіщення (Notifications)

### Бізнес-правила

- Firebase Cloud Messaging (FCM)
- 3 категорії сповіщень з окремими перемикачами:
  - `task_reminders` — нагадування про заплановані операції
  - `shop_offers` — пропозиції магазину
  - `app_updates` — оновлення додатку
- Всі категорії увімкнені за замовчуванням
- Увімкнення/вимкнення = підписка/відписка від FCM topic
- Стан зберігається локально (SharedPreferences)
- При ініціалізації — запит дозволу на сповіщення + синхронізація підписок

### Потік

```
NotificationSettingsCubit.init() [при старті додатку]
  → MessagingService.requestPermission()
  → NotificationSettingsRepository.syncTopicSubscriptions()
    → Для кожної категорії: якщо увімкнена → subscribe, інакше → unsubscribe
  → emit NotificationSettingsLoaded(taskReminders, shopOffers, appUpdates)

Користувач перемикає перемикач:
  NotificationSettingsCubit.setTaskReminders(bool)
    → _ensurePermission() — перевірка/запит дозволу
    → NotificationSettingsRepository.setTaskReminders(enabled)
      → NotificationSettingsLocalStorage.saveTaskReminders(enabled)
      → MessagingService.subscribeToTopic/unsubscribeFromTopic('task_reminders')
    → emit updated state
```

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/settings/data/notification_settings_local_storage.dart` | Локальне збереження налаштувань |
| `lib/features/settings/data/notification_settings_repository.dart` | Координація storage + FCM topics |
| `lib/features/settings/state/notification_settings_cubit.dart` | Стан налаштувань сповіщень |
| `lib/data/services/firebase/implementations/firebase_messaging_service.dart` | Обгортка FCM |

---

## 14. Зворотній зв'язок (Feedback)

### Бізнес-правила

- Відправка текстового повідомлення від користувача
- `POST /feedback-messages` з `{ message, userId, storeId: null }`
- Немає окремого кубіта — виклик напряму з UI

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/feedback/data/feedback_api_service.dart` | API-виклик |
| `lib/features/feedback/ui/feedback_page.dart` | UI форма |

---

## 15. Тема оформлення (Theme)

### Поточний стан

Темна тема **повністю вимкнена**. `ThemeCubit.setTheme()` завжди емітить `ThemeMode.light` незалежно від вхідних даних. Інфраструктура для перемикання тем існує, але заблокована.

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/settings/state/theme_cubit.dart` | Кубіт теми (заблоковано на light) |
| `lib/data/repositories/theme_repository.dart` | Репозиторій теми |
| `lib/data/services/storage/theme_local_storage.dart` | Локальне збереження теми |
| `lib/domain/usecases/theme_usecase.dart` | Use cases (неактивні) |

---

## 16. Навігація (Navigation)

### Структура

- **5 вкладок** внизу екрана (bottom navigation bar):
  1. Головна (`/main`) — дашборд з погодою, задачами, AI-діагностикою
  2. AI-діагностика (`/ai-diagnosis`) — фото рослин для аналізу
  3. Поля (`/fields`) — управління полями
  4. Магазин (`/shop`) — каталог товарів
  5. Профіль (`/profile`) — налаштування, замовлення

- **IndexedStack** для збереження стану вкладок
- **NavigationCubit** (singleton) зберігає індекс активної вкладки
- Перемикання вкладок через `context.go(route)` + `NavigationCubit.changeTab(index)`

### Auth Guard

Мінімальний guard — захищає тільки `/profile/edit`. Решта маршрутів доступні без авторизації (використовується API 401 → interceptor refresh/logout).

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/app/router/app_router.dart` | Конфігурація GoRouter |
| `lib/app/router/app_routes.dart` | Константи маршрутів |
| `lib/app/router/auth_guard.dart` | Auth guard + authStateNotifier |
| `lib/features/navigation/state/navigation_cubit.dart` | Кубіт навігації |
| `lib/features/home_page.dart` | HomePage з IndexedStack та bottom nav |

---

## 17. Онбоардінг (Onboarding)

### Бізнес-правила

- 4 екрани з ілюстраціями та описом функцій додатку
- Показується один раз (стан зберігається в SharedPreferences: `onboarding_completed`)
- Можна пропустити (`skip`) або пройти послідовно (`complete`)

### Потік

```
IntroPage → перевірка: StorageService.hasCompletedOnboarding?
  → Ні  → Router navigates to /onboarding
  → Так → Router navigates to /main або /sign-in
```

### Файли

| Файл | Призначення |
|------|-------------|
| `lib/features/onboarding/state/onboarding_cubit.dart` | Контролер каруселі |
| `lib/features/onboarding/data/models/onboarding_data.dart` | Контент 4 слайдів |

---

## Схема взаємозв'язків між модулями

```
                    ┌──────────────────┐
                    │   AuthCubit      │ ← Глобальний стан авторизації
                    │  (singleton)     │
                    └──────┬───────────┘
                           │
              ┌────────────┼────────────────┐
              ▼            ▼                ▼
        AddressesCubit  IntroCubit   ForgotPasswordCubit
        (читає User)    (triggers    (повертає User після
                         authCheck)   reset → AuthAuthenticated)

        ┌─────────────────────────────────────┐
        │         DataSyncService              │
        │       (broadcast stream)             │
        └──────────┬──────────────┬────────────┘
                   │              │
                   ▼              ▼
          OperationsCubit    FieldsCubit
          (EMITS events)     (LISTENS & refreshes)

        ┌─────────────────────────────────────┐
        │            CartCubit                 │
        │          (in-memory)                 │
        └──────────┬──────────────────────────┘
                   │
                   ▼
           CheckoutCubit → OrderApiService
                   │
                   ▼
           CartCubit.clearCart()
```

---

## API Ендпоінти (зведена таблиця)

### Auth & Users

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `POST` | `/auth/sign-in` | Вхід |
| `POST` | `/auth/sign-up` | Реєстрація |
| `POST` | `/auth/refresh` | Оновлення токена |
| `GET` | `/auth/account/me` | Поточний користувач |
| `POST` | `/auth/forgot-password` | Запит коду відновлення |
| `POST` | `/auth/reset-password` | Скидання пароля |
| `PATCH` | `/users` | Оновлення імені |
| `PATCH` | `/users/change-password` | Зміна пароля |
| `PATCH` | `/users/update-personal-data` | Оновлення дати народження |
| `PATCH` | `/users/add-address` | Додавання адреси |
| `DELETE` | `/users/remove-address/:id` | Видалення адреси |

### Grano (Fields & Operations)

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `GET` | `/grano/cultures` | Список культур |
| `POST` | `/grano/cultures` | Створення культури |
| `GET` | `/grano/cultures/:id` | Деталі культури |
| `PATCH` | `/grano/cultures/:id` | Оновлення культури |
| `DELETE` | `/grano/cultures/:id` | Видалення культури |
| `GET` | `/grano/fields` | Список полів (пошук, пагінація) |
| `POST` | `/grano/fields` | Створення поля |
| `GET` | `/grano/fields/:id` | Деталі поля |
| `PATCH` | `/grano/fields/:id` | Оновлення поля |
| `DELETE` | `/grano/fields/:id` | Видалення поля |
| `GET` | `/grano/operations` | Список операцій (фільтр по полю/статусу/типу) |
| `POST` | `/grano/operations` | Створення операції |
| `GET` | `/grano/operations/:id` | Деталі операції |
| `PATCH` | `/grano/operations/:id` | Оновлення операції |
| `DELETE` | `/grano/operations/:id` | Видалення операції |
| `GET` | `/grano/operation-products` | Продукти операції |
| `POST` | `/grano/operation-products` | Додавання продукту до операції |
| `PATCH` | `/grano/operation-products/:id` | Оновлення продукту операції |
| `DELETE` | `/grano/operation-products/:id` | Видалення продукту операції |

### Shop

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `GET` | `/product-categories` | Категорії товарів |
| `GET` | `/products` | Товари (фільтр по категорії, пошук, пагінація) |

### Orders

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `POST` | `/client/orders/create` | Створення замовлення |

### Other

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `POST` | `/feedback-messages` | Зворотній зв'язок |
| `POST` | `/push-token/upsert` | Реєстрація push-токена |

### Зовнішні API

| Сервіс | URL | Опис |
|--------|-----|------|
| Open-Meteo | `api.open-meteo.com/v1/forecast` | Погода (безкоштовно, без ключа) |
| Google Places | `maps.googleapis.com/maps/api/place` | Автозаповнення + геокодування адрес |

---

## Локальне сховище (SharedPreferences)

| Ключ | Тип | Опис |
|------|-----|------|
| `auth_token` | `String` | JWT access token |
| `refresh_token` | `String` | JWT refresh token |
| `device_id` | `String` | Ідентифікатор пристрою |
| `onboarding_completed` | `bool` | Прапорець завершення онбоардінгу |
| `task_reminders` | `bool` | Сповіщення: нагадування (default: true) |
| `shop_offers` | `bool` | Сповіщення: пропозиції (default: true) |
| `app_updates` | `bool` | Сповіщення: оновлення (default: true) |
| `theme_mode` | `String` | Режим теми (не використовується) |
| `selected_region` | `String` | JSON обраної області для погоди |

---

## Відомі обмеження та технічний борг

1. **AI-діагностика** — лише UI-заглушка, реальний ML-аналіз не реалізований
2. **Кошик не зберігається** — при закритті додатку кошик очищується
3. **Темна тема заблокована** — інфраструктура є, але примусово ввімкнено light mode
4. **Auth guard мінімальний** — захищає лише `/profile/edit`, решта маршрутів покладаються на 401 від API
5. **Google API key захардкоджений** — ключ для Google Places вбудований в код (потенційна проблема безпеки)
6. **Номер замовлення генерується на клієнті** — випадкові 5 цифр, не гарантується унікальність
7. **Ціна товару як рядок** — потребує regex-очищення для обчислень
8. **Fallback адреса в Checkout** — якщо адреса не обрана, використовується захардкоджена адреса в Києві
9. **Пагінація товарів** — параметр `page` частково закоментований
10. **Історія замовлень** — сторінка існує, але без повної реалізації
