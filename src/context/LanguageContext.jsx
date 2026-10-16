import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export const languages = [
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "ua", label: "Українська", short: "UA", flag: "🇺🇦" },
  { code: "ru", label: "Русский", short: "RU", flag: "🇷🇺" },
];

const translations = {
  ua: {
    "Profile":"Профіль","Sign out":"Вийти","Sign in":"Увійти","Sign in ›":"Увійти ›",
    "Cart":"Кошик","Your profile":"Ваш профіль","Not you?":"Це не ви?","Hello, sign in":"Вітаємо! Увійдіть",
    "Accounts & Lists":"Обліковий запис і списки","Returns":"Повернення","& Orders":"і замовлення",
    "Products":"Товари","Pay Video":"Pay Video","Orders":"Замовлення","Sell":"Продавати",
    "All":"Усі","Open menu":"Відкрити меню","Close menu":"Закрити меню","Menu":"Меню",
    "Shop by category":"Купуйте за категоріями","Loading…":"Завантаження…","Loading...":"Завантаження...",
    "No categories to show.":"Немає категорій для відображення.","All products":"Усі товари",
    "Back to top":"На початок","Meet the team behind Ipay":"Команда Ipay",
    "Built as a team project with React, ASP.NET Core and Firestore":"Командний проєкт на React, ASP.NET Core та Firestore",
    "Search":"Пошук","Category":"Категорія","Add to Cart":"Додати до кошика","Buy Now":"Купити зараз",
    "No products found.":"Товарів не знайдено.","All categories":"Усі категорії","Manufacturer":"Виробник",
    "All manufacturers":"Усі виробники","Customer Review":"Відгуки покупців","Price":"Ціна","Filters":"Фільтри",
    "Clear all":"Очистити все","Sort by:":"Сортувати за:","Try again":"Спробувати ще раз",
    "Your IPAY Cart is empty":"Ваш кошик IPAY порожній","Shop today's deals":"Переглянути сьогоднішні пропозиції",
    "Shopping Cart":"Кошик покупок","Remove":"Видалити","Proceed to checkout":"Перейти до оформлення",
    "Sign in to your account":"Увійдіть у свій обліковий запис","Sign up now":"Зареєструватися",
    "Create account":"Створити обліковий запис","Your name":"Ваше ім’я","Email":"Електронна пошта",
    "Email address":"Адреса електронної пошти","Password":"Пароль","Forgot password?":"Забули пароль?",
    "Conditions of Use":"Умови використання","Privacy Notice":"Політика конфіденційності",
    "New to Ipay?":"Вперше на Ipay?","Create your Ipay account":"Створіть обліковий запис Ipay",
    "We couldn't find that page":"Не вдалося знайти цю сторінку","Back to home":"На головну",
    "Your Orders":"Ваші замовлення","Loading your orders…":"Завантаження замовлень…",
    "You haven't placed any orders yet":"Ви ще не оформлювали замовлень","Start shopping":"Почати покупки",
    "No item details available.":"Деталі товару недоступні.","Country/Region":"Країна/регіон",
    "Full name (First and Last name)":"Повне ім’я та прізвище","Street address":"Адреса вулиці",
    "City":"Місто","State/Province/Region":"Область/регіон","Zip Code":"Поштовий індекс",
    "Phone number":"Номер телефону","Use this address":"Використати цю адресу","Add your card":"Додати картку",
    "Order placed, thank you!":"Замовлення оформлено, дякуємо!","Your order was successful.":"Ваше замовлення успішно оформлено.",
    "View your orders":"Переглянути замовлення","Continue shopping":"Продовжити покупки",
    "Order Summary":"Підсумок замовлення","Loading your profile…":"Завантаження профілю…","Done":"Готово",
    "Categories":"Категорії","Genres":"Жанри","See more ›":"Дивитися більше ›","Sign in to rate":"Увійдіть, щоб оцінити",
    "Title not found":"Назву не знайдено","Description":"Опис","No image":"Немає зображення",
    "Select a category":"Виберіть категорію","Select a manufacturer":"Виберіть виробника","Choose file":"Вибрати файл",
    "Upload":"Завантажити","Uploading…":"Завантаження…","Cancel":"Скасувати","Save":"Зберегти",
    "Loading orders…":"Завантаження замовлень…","Loading requests…":"Завантаження запитів…",
    "Customer":"Клієнт","Message":"Повідомлення","Requested":"Запитано","Status":"Статус","Actions":"Дії",
    "Reject":"Відхилити","Name":"Ім’я","Role":"Роль","Active":"Активний","Banned":"Заблокований",
    "Clear":"Очистити","Edit":"Редагувати","Reset password":"Скинути пароль","Send a new link":"Надіслати нове посилання",
    "Back to sign in":"Повернутися до входу","Verify it's you":"Підтвердьте, що це ви",
    "Sign-in code":"Код входу","What would you like to sell?":"Що ви хочете продавати?",
    "Products you’re selling":"Товари, які ви продаєте","No orders match this filter.":"Немає замовлень, що відповідають фільтру.",
    "This order was cancelled.":"Це замовлення скасовано.","Order placed":"Замовлення оформлено","Total":"Усього",
  },
  ru: {
    "Profile":"Профиль","Sign out":"Выйти","Sign in":"Войти","Sign in ›":"Войти ›",
    "Cart":"Корзина","Your profile":"Ваш профиль","Not you?":"Это не вы?","Hello, sign in":"Здравствуйте, войдите",
    "Accounts & Lists":"Аккаунт и списки","Returns":"Возвраты","& Orders":"и заказы",
    "Products":"Товары","Pay Video":"Pay Video","Orders":"Заказы","Sell":"Продавать",
    "All":"Все","Open menu":"Открыть меню","Close menu":"Закрыть меню","Menu":"Меню",
    "Shop by category":"Покупки по категориям","Loading…":"Загрузка…","Loading...":"Загрузка...",
    "No categories to show.":"Нет категорий для отображения.","All products":"Все товары",
    "Back to top":"Наверх","Meet the team behind Ipay":"Команда Ipay",
    "Built as a team project with React, ASP.NET Core and Firestore":"Командный проект на React, ASP.NET Core и Firestore",
    "Search":"Поиск","Category":"Категория","Add to Cart":"Добавить в корзину","Buy Now":"Купить сейчас",
    "No products found.":"Товары не найдены.","All categories":"Все категории","Manufacturer":"Производитель",
    "All manufacturers":"Все производители","Customer Review":"Отзывы покупателей","Price":"Цена","Filters":"Фильтры",
    "Clear all":"Очистить всё","Sort by:":"Сортировать по:","Try again":"Попробовать снова",
    "Your IPAY Cart is empty":"Ваша корзина IPAY пуста","Shop today's deals":"Посмотреть сегодняшние предложения",
    "Shopping Cart":"Корзина покупок","Remove":"Удалить","Proceed to checkout":"Перейти к оформлению",
    "Sign in to your account":"Войдите в аккаунт","Sign up now":"Зарегистрироваться",
    "Create account":"Создать аккаунт","Your name":"Ваше имя","Email":"Электронная почта",
    "Email address":"Адрес электронной почты","Password":"Пароль","Forgot password?":"Забыли пароль?",
    "Conditions of Use":"Условия использования","Privacy Notice":"Политика конфиденциальности",
    "New to Ipay?":"Впервые на Ipay?","Create your Ipay account":"Создайте аккаунт Ipay",
    "We couldn't find that page":"Не удалось найти эту страницу","Back to home":"На главную",
    "Your Orders":"Ваши заказы","Loading your orders…":"Загрузка заказов…",
    "You haven't placed any orders yet":"Вы ещё не оформляли заказы","Start shopping":"Начать покупки",
    "No item details available.":"Детали товара недоступны.","Country/Region":"Страна/регион",
    "Full name (First and Last name)":"Полное имя и фамилия","Street address":"Улица, дом",
    "City":"Город","State/Province/Region":"Область/регион","Zip Code":"Почтовый индекс",
    "Phone number":"Номер телефона","Use this address":"Использовать этот адрес","Add your card":"Добавить карту",
    "Order placed, thank you!":"Заказ оформлен, спасибо!","Your order was successful.":"Ваш заказ успешно оформлен.",
    "View your orders":"Посмотреть заказы","Continue shopping":"Продолжить покупки",
    "Order Summary":"Итог заказа","Loading your profile…":"Загрузка профиля…","Done":"Готово",
    "Categories":"Категории","Genres":"Жанры","See more ›":"Смотреть ещё ›","Sign in to rate":"Войдите, чтобы оценить",
    "Title not found":"Название не найдено","Description":"Описание","No image":"Нет изображения",
    "Select a category":"Выберите категорию","Select a manufacturer":"Выберите производителя","Choose file":"Выбрать файл",
    "Upload":"Загрузить","Uploading…":"Загрузка…","Cancel":"Отмена","Save":"Сохранить",
    "Loading orders…":"Загрузка заказов…","Loading requests…":"Загрузка запросов…",
    "Customer":"Клиент","Message":"Сообщение","Requested":"Запрошено","Status":"Статус","Actions":"Действия",
    "Reject":"Отклонить","Name":"Имя","Role":"Роль","Active":"Активен","Banned":"Заблокирован",
    "Clear":"Очистить","Edit":"Изменить","Reset password":"Сбросить пароль","Send a new link":"Отправить новую ссылку",
    "Back to sign in":"Вернуться ко входу","Verify it's you":"Подтвердите, что это вы",
    "Sign-in code":"Код входа","What would you like to sell?":"Что вы хотите продавать?",
    "Products you’re selling":"Товары, которые вы продаёте","No orders match this filter.":"Нет заказов, соответствующих фильтру.",
    "This order was cancelled.":"Этот заказ отменён.","Order placed":"Заказ оформлен","Total":"Итого",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("ipay-language");
      return ["en", "ua", "ru"].includes(saved) ? saved : "en";
    } catch { return "en"; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const changeLanguage = useCallback((code) => {
    if (!["en", "ua", "ru"].includes(code)) return;
    setLanguage(code);
    try { localStorage.setItem("ipay-language", code); } catch { /* storage may be unavailable */ }
    document.documentElement.lang = code;
  }, []);
  const t = useCallback((text) => translations[language]?.[text] || text, [language]);
  const value = useMemo(() => ({ language, changeLanguage, t }), [language, changeLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
