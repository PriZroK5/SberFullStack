'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { createReview, getReviews, login, register, sendQuestion, createBooking, getBookedSlots } from './lib/api';
import { Review } from './types/review.types';
import Link from 'next/link';

function ThemeSwitcher({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      style={{
        position: 'relative',
        width: 56,
        height: 28,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 100,
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,200,100,0.5)',
          background: isDark
            ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
            : 'linear-gradient(135deg, #87ceeb, #ffd89b)',
          transition: 'all 0.4s ease',
          overflow: 'hidden',
        }}
      >
        {isDark && (
          <>
            <div style={{ position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: 'white', opacity: 0.8, top: 6, left: 10 }} />
            <div style={{ position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: 'white', opacity: 0.6, top: 14, left: 20 }} />
            <div style={{ position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: 'white', opacity: 0.9, top: 8, left: 32 }} />
          </>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: isDark ? 3 : 31,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: isDark ? '#1e2a4a' : '#fff7e6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          transition: 'left 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.4s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isDark ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#a0b4d6">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </div>
    </div>
  );
}

const officePhotos = [
  { url: '/office/IMG_0325.jpeg', title: 'Современный коворкинг' },
  { url: '/office/IMG_0311.jpeg', title: 'Переговорная' },
  { url: '/office/IMG_0326.jpeg', title: 'Зона отдыха' },
  { url: '/office/IMG_0411.jpeg', title: 'Команда за работой' },
  { url: '/sportzals/IMG_0349.jpeg', title: 'Спортзал' },
];

const lifeEvents = [
  { emoji: '🎨', title: 'Мастер-классы', desc: 'Каждую среду в 18:00 — дизайн-мышление, публичные выступления, продуктовый подход' },
  { emoji: '🎤', title: 'Выступления экспертов', desc: 'Приглашённые спикеры из IT, бизнеса и науки делятся опытом' },
  { emoji: '🍷', title: 'Дегустации', desc: 'Тематические вечера с дегустацией кофе, чая, локальных продуктов' },
  { emoji: '🤝', title: 'Командообразование', desc: 'Квизы, хакатоны, спортивные челленджи и выезды' },
];

const testimonials = [
  { name: 'Анна К.', role: 'Аналитик', text: 'Отличное пространство! Удобные переговорные, всегда есть место для работы.', avatar: '👩‍💼' },
  { name: 'Дмитрий В.', role: 'Руководитель проектов', text: 'Программа лояльности приятно удивляет. Кофе и снеки — отличный бонус каждый день.', avatar: '👨‍💻' },
  { name: 'Елена М.', role: 'Дизайнер', text: 'Мастер-классы и события помогают прокачивать навыки и знакомиться с коллегами.', avatar: '🎨' },
  { name: 'Сергей П.', role: 'Разработчик', text: 'Спортзал и массажное кресло — то, что нужно после долгого кодинга!', avatar: '💪' },
];

const checklistGrouped = [
  {
    day: 'День 1',
    items: [
      'Пройти курсы адаптации на платформе «Пульс»',
      'Заполнить анкету новичка',
      'Получить технику и все доступы',
    ],
  },
  {
    day: 'День 2',
    items: [
      'Пройти экскурсию по центру',
      'Инструктаж по кибербезопасности и охране труда',
    ],
  },
  {
    day: 'День 3',
    items: [
      'Встреча с куратором / бадди',
      'Познакомиться с командой',
      'Посетить первый дейлик / стендап',
    ],
  },
  {
    day: 'Доп. день',
    items: [
      'Самостоятельные курсы: ИИ-агенты, GigaChat на Пульсе',
      'Активировать бонусы программы лояльности',
      'Предложить свои идеи для улучшения центра',
    ],
  },
];

const contacts = [
  { name: 'Александра Иванова', role: 'Специалист по адаптации', tg: 'alex_hub', emoji: '👩‍💼', avatarImg: '/people/ava-nadya-v@2x.png' },
  { name: 'Михаил Смирнов', role: 'Технический специалист', tg: 'michael_tech', emoji: '👨‍💻', avatarImg: '/people/ava-azat@2x.png' },
  { name: 'Ирина Кузнецова', role: 'Менеджер по бронированию', tg: 'irina_booking', emoji: '📅', avatarImg: '/people/ava-nastya@2x.png' },
  { name: 'Фёдор Петров', role: 'Бадди-наставник', tg: 'fedor_buddy', emoji: '🤝', avatarImg: '/people/ava-vlad@2x.png' },
];

const faqItems = [
  {
    q: 'Как посетить спортзал?',
    a: 'Спортзал находится на первом этаже, слева от ресепшена. Открыт ежедневно с 07:00 до 21:00 — вход свободный для всех сотрудников без предварительной записи. Вам доступны: беговые дорожки, велотренажёры, силовая рама, гантели до 50 кг и скамьи. Есть раздевалки с ключами, душевые кабины, а также кулер с питьевой водой и чистое полотенце можно взять на ресепшене. В часы пик (12:00–14:00) зал может быть загружен, выбирайте другое время, если хотите заниматься в тишине.'
  },
  {
    q: 'Когда и где можно пообедать?',
    a: 'Обеденный перерыв — 50 минут, вы можете выбрать любое время с 11:30 до 15:00 (согласуйте с руководителем). В столовой на втором этаже каждый день с 12:00 до 14:00 доступны горячие обеды: первое, второе, салат, хлеб, компот. Также есть зона с двумя микроволновками, холодильником и кофемашиной — можно разогреть принесённую еду. Если хотите заказать доставку, ресепшн хранит меню ближайших кафе (рекомендуем «Супчик» и «Вкусное дело»). Запрещено разогревать рыбу и сильно пахнущие блюда в общих микроволновках, пожалуйста, уважайте коллег.'
  },
  {
    q: 'Как забронировать переговорную или коворкинг?',
    a: 'Забронировать можно двумя способами: (1) через внутренний портал «Бронирование» — выберите дату, время, количество участников, и система подтвердит, свободна ли комната. (2) Написать Ирине Кузнецовой, менеджеру по бронированию, в Telegram: @irina_booking (отвечает в рабочие дни с 9:00 до 18:00). Переговорные оснащены 4K-экраном, маркерной доской и конференц-связью. Коворкинг — open space с 12 рабочими местами, быстрым Wi-Fi и розетками у каждого стола. Бронирование — минимум на 1 час, максимум на 4 часа. Отмените бронь не позже чем за 30 минут, иначе штрафные бонусы.'
  },
  {
    q: 'Как долго длится адаптация для новичков?',
    a: 'Базовая адаптация официально длится 1 неделю. За вами закрепляют бадди-наставника (он проведёт экскурсию, познакомит с командой, ответит на бытовые вопросы). В первую неделю нужно обязательно пройти инструктаж по кибербезопасности, охране труда и пожарной безопасности — запишитесь у Александры Ивановой (@alex_hub). Полное погружение в рабочие процессы, доступ к корпоративным сервисам и полным правам занимает около месяца. По итогам месяца вы заполняете чек-лист адаптации (он есть на портале) и получаете приветственные бонусы в программе лояльности.'
  },
  {
    q: 'Как записаться на мастер-классы, дегустации и другие события?',
    a: 'Актуальное расписание публикуется в корпоративном телеграм-канале «Hub События» каждый понедельник. Запись на мероприятия — через специального бота @HubEventMatch_bot: выберите событие, нажмите «Записаться», и бот пришлёт напоминание за час. Если передумали, отмените запись в том же боте (но не позже чем за 2 часа, иначе событие будет считаться посещённым, а бонусы не начислят). Также можно записаться устно у Александры Ивановой (@alex_hub) — она ведёт общий список. Участие бесплатное, но количество мест ограничено (обычно 20–30 человек).'
  },
  {
    q: 'Как согласовать график работы? Есть ли гибкий формат?',
    a: 'График обсуждается с вашим руководителем в первую неделю работы. Действует система «core hours»: с 10:00 до 16:00 вы обязательно должны быть на связи (в офисе или удалённо). Остальные часы (рано утром, вечером) — по вашему усмотрению, но общая нагрузка 40 часов в неделю. Можно работать полностью из офиса, гибридно (2–3 дня в офисе) или полностью удалённо, если это позволяет ваша роль (например, аналитика, разработка). Для удалённой работы необходимо подать заявку через корпоративный портал (раздел «Удалённый режим») — её рассматривает руководитель и HR. При одобрении вы получаете доступ к VPN и корпоративной защите. В удалённые дни вы обязаны быть онлайн в рабочие часы, отвечать в чатах и участвовать в видеозвонках.'
  }
];

const loyaltyCategories = [
  {
    id: 'health', label: '🏋️ Здоровье', items: [
      {
        icon:'🏋️', name:'Спортзал (в хабе)', addr:'ул. Костина, 6, 2 этаж',
        badge:'Бесплатно',
        desc:'Пн–Пт 12:00–13:00 группы, 07:00–21:00 индивидуально',
        contact:'+7 (960) 174-16-67 Светлана',
        actions: [
          { label:'Записаться в Telegram', tg:'https://t.me/SportBotVVB_bot' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+6+Нижний+Новгород' },
        ]
      },
      {
        icon:'🏊', name:'ФОК', addr:'ул. Октябрьская, 35',
        badge:'Скидка',
        desc:'Бассейн для сотрудников со скидкой',
        contact:'+7 (960) 174-16-67 Светлана',
        actions: [
          { label:'Записаться в Telegram', tg:'https://t.me/SportBotVVB_bot' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Октябрьская+35+Нижний+Новгород' },
        ]
      },
      {
        icon:'💪', name:'Фитнес-студия Rush', addr:'ул. Костина, 3',
        badge:'Скидка',
        desc:'Скидки на посещение студии для сотрудников',
        contact:'+7 (910) 798-84-54 Ирина',
        actions: [
          { label:'rush-nn.ru', site:'https://rush-nn.ru/' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+3+Нижний+Новгород' },
        ]
      },
      {
        icon:'🥇', name:'Gold Fitness', addr:'ул. Казанское шоссе, 11 / ул. Коминтерна, 105А / ул. Н. Горького, 252',
        badge:'Скидка до 22%',
        desc:'По кодовому слову «СБ». Зависит от срока действия абонемента',
        contact:'+7 (910) 798-84-54 Ирина',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=Gold+Fitness+Нижний+Новгород' },
        ]
      },
      {
        icon:'🧘', name:'Fitness House', addr:'ул. Московское шоссе, 4.12 / ул. Цветочная, 12',
        badge:'Скидка 7%',
        desc:'По кодовому слову «СБ». При покупке бонус: заморозка / 50 мин солярий',
        contact:'+7 (930) 812-45-59 Катерина',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=Fitness+House+Нижний+Новгород' },
        ]
      },
      {
        icon:'🧠', name:'Психолог', addr:'ул. Костина, 6, 4 этаж',
        badge:'По записи',
        desc:'Запись через платформу Пульс → раздел «НН Здоровье» → «Психологическая поддержка»',
        contact:'Пульс',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+6+Нижний+Новгород' },
        ]
      },
      {
        icon:'🏄', name:'SUP-клуб Cristal SUP', addr:'Нижегородская область',
        badge:'Скидка 15%',
        desc:'Промокод «ХАБСБЕРА» на все сплавы',
        contact:'+7 (902) 302-02-88 Игнат',
        actions: [
          { label:'cristalsup-nn.ru', site:'https://cristalsup-nn.ru' },
        ]
      },
      {
        icon:'🏃', name:'Беги, герой', addr:'Нижний Новгород',
        badge:'Скидка',
        desc:'Скидки на забеги для сотрудников по промокоду',
        contact:'+7 (910) 798-84-54 Ирина',
        actions: []
      },
    ]
  },
  {
    id: 'leisure', label: '🎭 Досуг', items: [
      {
        icon:'🌌', name:'Планетарий', addr:'пр. Гагарина, 32Б (Парк «Швейцария»)',
        badge:'Скидка 15%',
        desc:'По промокоду «ЗИБИНИ» на посещение для сотрудников',
        contact:'+7 (996) 851-50-54 Анна',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=Планетарий+Нижний+Новгород+Гагарина+32' },
        ]
      },
      {
        icon:'📚', name:'Библиотека', addr:'ул. Костина, 6, 3 этаж',
        badge:'Бесплатно',
        desc:'Взять книги, заказать или принести свои (буккроссинг)',
        contact:'Лифтовый холл',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+6+Нижний+Новгород' },
        ]
      },
      {
        icon:'🏨', name:'Клубный отель «Акватория»', addr:'пос. Турбаза 3Л',
        badge:'Скидка 20%',
        desc:'По промокоду «СБ»',
        contact:'+7 (915) 938-38-60 Ксения',
        actions: [
          { label:'aquatori.ru', site:'http://aquatori.ru/' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=Акватория+Нижний+Новгород+Турбаза' },
        ]
      },
      {
        icon:'🏺', name:'Ceramica Lepka', addr:'ул. Варварская 32, 5 этаж',
        badge:'Скидка 20%',
        desc:'По промокоду «СберКерамика»',
        contact:'+7 (920) 293-30-52 Мария',
        actions: [
          { label:'vk.com/ceramica_lepka', site:'https://vk.com/ceramica_lepka' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Варварская+32+Нижний+Новгород' },
        ]
      },
      {
        icon:'🎵', name:'8 Нот', addr:'Онлайн',
        badge:'Скидка 200 ₽',
        desc:'Промокод SBERSTAFF при бронировании музыкально-развлекательной игры',
        contact:'8notaquiz.ru',
        actions: [
          { label:'8notaquiz.ru', site:'https://8notaquiz.ru/' },
        ]
      },
      {
        icon:'🎓', name:'Онлайн-школа Нины Зверевой', addr:'Онлайн',
        badge:'Скидка 25%',
        desc:'Промокод «ХАБ» на все курсы кроме «Тайны тренера»',
        contact:'zvereva-online.ru',
        actions: [
          { label:'zvereva-online.ru', site:'https://zvereva-online.ru' },
        ]
      },
    ]
  },
  {
    id: 'beauty', label: '💅 Красота', items: [
      {
        icon:'✂️', name:'Салон красоты', addr:'ул. Октябрьская, 35',
        badge:'Акции',
        desc:'Маникюр, ламинирование и окрашивание ресниц, архитектура бровей',
        contact:'Вступить в группу в Telegram',
        actions: [
          { label:'Записаться в Telegram', tg:'https://t.me/' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Октябрьская+35+Нижний+Новгород' },
        ]
      },
      {
        icon:'💐', name:'Цветочный магазин LiLL', addr:'ул. Славянская 35, к.1',
        badge:'Скидка 10%',
        desc:'При предъявлении пропуска Сбера',
        contact:'Группа контакт',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Славянская+35+Нижний+Новгород' },
        ]
      },
      {
        icon:'💈', name:'Барбершоп «Мужская гармония»', addr:'ул. Белинского, 41',
        badge:'Скидка 15%',
        desc:'По промокоду «СБ»',
        contact:'+7 (953) 552-96-76',
        actions: [
          { label:'vk.com/mensgarmony', site:'https://vk.com/mensgarmony' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Белинского+41+Нижний+Новгород' },
        ]
      },
      {
        icon:'🌿', name:'Спа-салон RAVAI SPA', addr:'ул. Б. Покровская, 29',
        badge:'Скидка 15%',
        desc:'На все услуги при предъявлении пропуска Сбера',
        contact:'+7 (953) 552-96-76',
        actions: [
          { label:'nn.rawaispa.ru', site:'https://nn.rawaispa.ru' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Покровская+29+Нижний+Новгород' },
        ]
      },
    ]
  },
  {
    id: 'care', label: '🛠 Забота', items: [
      {
        icon:'👟', name:'Ремонт обуви', addr:'ул. Костина, 6, 2 этаж',
        badge:'Скидка 15%',
        desc:'По промокоду «СБ». Мастер сам принесёт и заберёт изделие',
        contact:'+7 (903) 052-61-29 Виталий',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+6+Нижний+Новгород' },
        ]
      },
    ]
  },
  {
    id: 'food', label: '🍽 Еда', items: [
      {
        icon:'🍱', name:'Вендинг «Обед Store»', addr:'ул. Костина, 6, 3 этаж (лифтовый холл)',
        badge:'Готовая еда',
        desc:'Рацион правильного питания в быстром доступе',
        contact:'kurtsevo.com',
        actions: [
          { label:'kurtsevo.com', site:'https://kurtsevo.com/' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+6+Нижний+Новгород' },
        ]
      },
      {
        icon:'☕', name:'Кофейня «Чёртова»', addr:'ул. Рождественская, 32 / ул. Б. Покровская, 10 / ул. Родионова, 187',
        badge:'Скидка 10%',
        desc:'По промокоду «СБ» (произнести на кассе)',
        contact:'+7 (910) 145-72-78 Дмитрий',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=Кофейня+Чёртова+Нижний+Новгород' },
        ]
      },
      {
        icon:'🍺', name:'Бар-кафе «Горькая»', addr:'ул. Рождественская, 32',
        badge:'Скидка 10%',
        desc:'По промокоду «СБ НН Костина»',
        contact:'vk.ru/gorkayabar',
        actions: [
          { label:'vk.ru/gorkayabar', site:'https://vk.ru/gorkayabar' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Рождественская+32+Нижний+Новгород' },
        ]
      },
      {
        icon:'🍵', name:'Чайная «Горьков чай»', addr:'ул. Б. Покровская, 4, д. 93',
        badge:'Скидка 10%',
        desc:'При предъявлении пропуска Сбера',
        contact:'gorkovchay.ru',
        actions: [
          { label:'gorkovchay.ru', site:'https://gorkovchay.ru' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Покровская+4+Нижний+Новгород' },
        ]
      },
      {
        icon:'🥘', name:'Шаурма у мангала за стеклом', addr:'ул. Костина, 13, к.1',
        badge:'Скидка 10%',
        desc:'При заказе от 1500 по промокоду «СБ» (произнести на кассе)',
        contact:'u-mangala-nn.ru',
        actions: [
          { label:'u-mangala-nn.ru', site:'https://u-mangala-nn.ru/' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Костина+13+Нижний+Новгород' },
        ]
      },
      {
        icon:'🍃', name:'Китайский чай', addr:'ул. Рождественская, 185 / ул. Цветочная, 12 ТЦ «Цветы»',
        badge:'Скидка 10%',
        desc:'На всю продукцию при предъявлении пропуска Сбера',
        contact:'shoptea.pro',
        actions: [
          { label:'shoptea.pro', site:'https://www.shoptea.pro/' },
          { label:'На карте', map:'https://yandex.ru/maps/?text=ул.+Рождественская+185+Нижний+Новгород' },
        ]
      },
      {
        icon:'🫙', name:'Городецкая сыроварня «Курцево»', addr:'д. Курцево, 26',
        badge:'Скидка 15%',
        desc:'По промокоду «Сбер»',
        contact:'+7 (906) 361-59-60 Виктория',
        actions: [
          { label:'На карте', map:'https://yandex.ru/maps/?text=Курцево+Нижегородская+область' },
        ]
      },
    ]
  },
];

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [officeIdx, setOfficeIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checklistState, setChecklistState] = useState<boolean[][]>(() =>
    checklistGrouped.map(group => new Array(group.items.length).fill(false))
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modal, setModal] = useState<{ open: boolean; title: string; body: string }>({ open: false, title: '', body: '' });
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', role: '', tg: '', message: '' });
  const [applyDone, setApplyDone] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('health');
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({ name: '', contact: '', text: '' });
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState<'login' | 'register' | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ login: '', password: '', confirmPassword: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [authError, setAuthError] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [currentUser, setCurrentUser] = useState<{ name: string; token: string } | null>(null);
  const [apiReviews, setApiReviews] = useState<Review[]>([]);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', date: '', time_start: '', time_end: '' });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{ time_start: string; time_end: string }[]>([]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleVideoEnd = () => setShowVideo(false);

  const [isSending, setIsSending] = useState(false); 
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null);
  const startAutoSlide = () => {
    if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    autoSlideInterval.current = setInterval(() => {
      setOfficeIdx((prev) => (prev + 1) % officePhotos.length);
    }, 3000);
  };
  const stopAutoSlide = () => {
    if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    autoSlideInterval.current = null;
  };
  const testimonialTotal = apiReviews.length + testimonials.length;
  const autoTestimonialInterval = useRef<NodeJS.Timeout | null>(null);
  const startAutoTestimonial = () => {
    if (autoTestimonialInterval.current) clearInterval(autoTestimonialInterval.current);
    autoTestimonialInterval.current = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonialTotal);
    }, 4000);
  };
  const stopAutoTestimonial = () => {
    if (autoTestimonialInterval.current) clearInterval(autoTestimonialInterval.current);
    autoTestimonialInterval.current = null;
  };

  useEffect(() => {
    if (!isLoadingPage) {
      startAutoSlide();
      startAutoTestimonial();
    }
    return () => {
      stopAutoSlide();
      stopAutoTestimonial();
    };
  }, [isLoadingPage, apiReviews.length]);

  const handleOfficeManual = (newIdx: number) => {
    setOfficeIdx(newIdx);
    stopAutoSlide();
    startAutoSlide();
  };
  const handleTestimonialManual = (newIdx: number) => {
    setTestimonialIdx(newIdx);
    stopAutoTestimonial();
    startAutoTestimonial();
  };

  const getAiResponse = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('спортзал') || q.includes('тренажер') || q.includes('зал')) {
      return 'Спортзал открыт ежедневно с 07:00 до 21:00, вход свободный. Есть беговые дорожки, велотренажёры, силовая рама, гантели до 50 кг, раздевалки и душевые.';
    }
    if (q.includes('бронировать') || q.includes('переговорная') || q.includes('коворкинг')) {
      return 'Забронировать переговорную или коворкинг можно через внутренний портал или у Ирины Кузнецовой в Telegram: @irina_booking.';
    }
    if (q.includes('адаптация') || q.includes('новичок') || q.includes('первый день')) {
      return 'Адаптация длится 1 неделю. За вами закрепят бадди-наставника. Необходимо пройти инструктажи и заполнить анкету новичка.';
    }
    if (q.includes('мероприятие') || q.includes('мастер-класс') || q.includes('дегустация')) {
      return 'Расписание мероприятий публикуется в канале «Hub События» каждый понедельник. Запись через бот @HubEventMatch_bot.';
    }
    if (q.includes('лояльность') || q.includes('бонус')) {
      return 'Программа лояльности даёт скидки у партнёров и бонусы за активность. Подробнее на внутреннем портале.';
    }
    if (q.includes('обед') || q.includes('кушать') || q.includes('столовая')) {
      return 'Обед — 50 минут. В столовой горячие обеды с 12:00 до 14:00. Есть микроволновки, холодильник, кофемашина.';
    }
    if (q.includes('печать') || q.includes('канцтовары')) {
      return 'Бесплатная печать до 20 страниц в день в зоне коворкинга. Канцтовары можно взять на ресепшене.';
    }
    return 'Я Помощник хаба. Напишите свой вопрос подробнее, или обратитесь к нашим контактам в разделе "К кому обратиться".';
  };

  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage.trim();
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiMessage('');
    setAiLoading(true);
    setTimeout(() => {
      const answer = getAiResponse(userMsg);
      setAiChat(prev => [...prev, { role: 'assistant', text: answer }]);
      setAiLoading(false);
    }, 800);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
        await sendQuestion(questionForm);
        setQuestionSubmitted(true);
        setTimeout(() => {
            setQuestionSubmitted(false);
            setQuestionModalOpen(false);
            setQuestionForm({ name: '', contact: '', text: '' });
        }, 2500);
    } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.error || 'Не удалось отправить вопрос. Попробуйте позже.');
    } finally {
        setIsSending(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedTheme = localStorage.getItem('hubTheme');
      if (savedTheme === 'light') setIsDark(false);
      else if (savedTheme === 'dark') setIsDark(true);
      else setIsDark(true);
      const savedChecklist = localStorage.getItem('hubChecklistGrouped');
      if (savedChecklist) {
        try {
          const parsed = JSON.parse(savedChecklist);
          if (Array.isArray(parsed) && parsed.length === checklistGrouped.length) {
            setChecklistState(parsed);
          }
        } catch (e) {}
      }
      const savedUser = localStorage.getItem('hubUser');
      if (savedUser) {
        try { setCurrentUser(JSON.parse(savedUser)); } catch {}
      }
      try {
        const reviews = await getReviews();
        setApiReviews(reviews);
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
      setIsClient(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoadingPage(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isClient) return;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('hubTheme', isDark ? 'dark' : 'light');
  }, [isDark, isClient]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.2, rootMargin: '0px 0px -20% 0px' }
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.anim').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('hubChecklistGrouped', JSON.stringify(checklistState));
  }, [checklistState, isClient]);

  const toggleChecklistItem = (groupIdx: number, itemIdx: number) => {
    const newState = [...checklistState];
    newState[groupIdx][itemIdx] = !newState[groupIdx][itemIdx];
    setChecklistState(newState);
  };

  const getCheckedCount = () => {
    const flat = checklistState.flat();
    return flat.filter(Boolean).length;
  };

  const getTotalCount = () => {
    return checklistState.flat().length;
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = window.scrollY;
    const end = el.getBoundingClientRect().top + start - 80;
    const dist = end - start;
    const t0 = performance.now();
    const dur = 700;
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!loginForm.login || !loginForm.password) {
      setAuthError('Заполните все поля');
      return;
    }
    try {
      const data = await login({ name: loginForm.login, password: loginForm.password });
      setCurrentUser({ name: data.name, token: data.token });
      localStorage.setItem('hubUser', JSON.stringify({ name: data.name, token: data.token }));
      setAuthModalOpen(null);
      setLoginForm({ login: '', password: '' });
    } catch (error: any) {
      setAuthError(error.response?.data?.error || 'Ошибка входа');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!registerForm.login || !registerForm.password || !registerForm.confirmPassword) {
      setAuthError('Заполните все поля');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Пароли не совпадают');
      return;
    }
    try {
      const data = await register({
        name: registerForm.login,
        password: registerForm.password,
        confirm_password: registerForm.confirmPassword,
      });
      setCurrentUser({ name: data.name, token: data.token });
      localStorage.setItem('hubUser', JSON.stringify({ name: data.name, token: data.token }));
      setAuthModalOpen(null);
      setRegisterForm({ login: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      const errMsg = error.response?.data;
      const firstError = Object.values(errMsg)[0];
      setAuthError(Array.isArray(firstError) ? firstError[0] : String(firstError));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setReviewModalOpen(false);
      setAuthModalOpen('login');
      return;
    }
    try {
      const newReview = await createReview(currentUser.token, {
        text: reviewForm.text,
        rating: reviewForm.rating,
      });
      setApiReviews(prev => [newReview, ...prev]);
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewSubmitted(false);
        setReviewModalOpen(false);
        setReviewForm({ rating: 5, text: '' });
      }, 2500);
    } catch (error) {
      setAuthError('Ошибка отправки отзыва');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingLoading(true);
    try {
      await createBooking(bookingForm);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingModalOpen(false);
        setBookingForm({ name: '', date: '', time_start: '', time_end: '' });
        setBookedSlots([]);
      }, 3000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setBookingError(err.response.data?.conflict || 'Коворкинг занят на это время');
      } else {
        setBookingError(err.response?.data?.detail || 'Ошибка при бронировании. Попробуйте ещё раз.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookingDateChange = async (date: string) => {
    setBookingForm(prev => ({ ...prev, date }));
    setBookingError('');
    if (date) {
      try {
        const slots = await getBookedSlots(date);
        setBookedSlots(slots);
      } catch {
        setBookedSlots([]);
      }
    } else {
      setBookedSlots([]);
    }
  };

  const openModal = (title: string, body: string) => setModal({ open: true, title, body });
  const closeModal = () => setModal({ open: false, title: '', body: '' });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyDone(true);
    setTimeout(() => { setApplyDone(false); setApplyOpen(false); setApplyForm({ name: '', role: '', tg: '', message: '' }); }, 2500);
  };

  const navLinks = [
    { id: 'hero', label: 'О центре' },
    { id: 'possibilities', label: 'Возможности' },
    { id: 'life', label: 'Жизнь' },
    { id: 'testimonials', label: 'Отзывы' },
    { id: 'checklist', label: 'Чек-лист' },
    { id: 'contacts', label: 'Контакты' },
    { id: 'faq', label: 'FAQ' },
  ];

  const timeSlots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      timeSlots.push(`${hour}:${minute}`);
    }
  }

  return (
    <>
      {isLoadingPage && (
        <div className="page-loader" style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="loader-content" style={{ textAlign: 'center' }}>
            <div className="cat-loader" style={{ width: '180px', height: '180px', margin: '0 auto 24px' }}>
              <video 
                src="/cat_flying.webm" 
                autoPlay 
                muted 
                loop 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <p className="loader-text" style={{ color: 'var(--text)', fontSize: '18px' }}>
              Загружаем космические возможности...
            </p>
          </div>
        </div>
      )}

      <div style={{
        opacity: isLoadingPage ? 0 : 1,
        transition: 'opacity 0.8s ease',
        pointerEvents: isLoadingPage ? 'none' : 'auto',
      }}>
        {aiOpen && (
          <div
            onClick={() => setAiOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 102, transition: 'opacity 0.3s' }}
          />
        )}

        <button
          onClick={() => setAiOpen(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--peach), var(--pink))', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            border: 'none', cursor: 'pointer', zIndex: 103, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', transition: 'transform 0.2s', overflow: 'hidden',
          }}
          aria-label="button"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Image src="/bot-chat.png" alt="bot-chat" width={60} height={50} style={{ objectFit: 'cover' }} />
        </button>

        <div
          style={{
            position: 'fixed', bottom: 0, right: 0, left: 'auto', width: 'min(90%, 400px)',
            backgroundColor: 'var(--bg3)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            boxShadow: '0 -4px 30px rgba(0,0,0,0.3)', zIndex: 104,
            transform: aiOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
            display: 'flex', flexDirection: 'column', maxHeight: '80vh', border: '1px solid var(--border)', borderBottom: 'none',
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
            <span style={{ fontWeight: 600, fontFamily: 'Unbounded, sans-serif', fontSize: '16px' }}>Помощник</span>
            <button onClick={() => setAiOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text)', opacity: 0.7 }} aria-label="close">✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh' }}>
            {aiChat.length === 0 && (
              <div style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '14px', padding: '20px 0' }}>
                Задайте вопрос о хабе, мероприятиях, бронировании и т.д.
              </div>
            )}
            {aiChat.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--peach), var(--pink))' : 'var(--card)',
                color: msg.role === 'user' ? '#12001a' : 'var(--text)',
                padding: '10px 14px', borderRadius: '18px', maxWidth: '85%', fontSize: '14px', wordBreak: 'break-word',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              }}>{msg.text}</div>
            ))}
            {aiLoading && <div style={{ alignSelf: 'flex-start', background: 'var(--card)', padding: '10px 14px', borderRadius: '18px', fontSize: '14px', color: 'var(--muted)' }}>Печатает...</div>}
          </div>
          <form onSubmit={handleAiSend} style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', background: 'var(--bg2)' }}>
            <input type="text" placeholder="Спросите что-нибудь..." value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} style={{ flex: 1, padding: '10px 16px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
            <button type="submit" disabled={aiLoading} style={{ background: 'linear-gradient(135deg, var(--peach), var(--pink))', border: 'none', borderRadius: '100px', padding: '0 20px', fontWeight: 600, cursor: 'pointer', color: '#12001a' }} aria-label="отправить">Отправить</button>
          </form>
        </div>

        <div className="progress"><div className="progress-fill" style={{ height: `${scrollProgress}%` }} /></div>

        <nav className="nav">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} className="nav-logo">СБЕРХАБ</a>
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.id}><a href={`#${l.id}`} className={activeSection === l.id ? 'act' : ''} onClick={(e) => { e.preventDefault(); scrollTo(l.id); }}>{l.label}</a></li>
            ))}
          </ul>
          <div className="nav-right">
            <ThemeSwitcher isDark={isDark} onToggle={() => setIsDark((p) => !p)} />
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', padding: '9px 16px', background: 'rgba(244,165,130,0.1)', borderRadius: '100px', border: '1px solid rgba(244,165,130,0.3)' }}>👤 {currentUser.name}</span>
                <button onClick={() => { setCurrentUser(null); localStorage.removeItem('hubUser'); }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '100px', padding: '9px 16px', fontFamily: 'inherit', fontWeight: 600, fontSize: '12px', cursor: 'pointer', color: 'var(--muted)', transition: '0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')} aria-label="exit">Выйти</button>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen('login')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '100px', padding: '9px 22px', fontFamily: 'inherit', fontWeight: 600, fontSize: '12px', cursor: 'pointer', color: 'var(--text)', transition: '0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')} aria-label="войти">Войти</button>
            )}
            <a href="#booking" className="nav-cta" onClick={(e) => { e.preventDefault(); setBookingModalOpen(true); }}>Забронировать</a>
          </div>
        </nav>

        <div className="mobile-bar">
          {[
            { id: 'hero', ico: '/sber_home.png', label: 'Главная' },
            { id: 'possibilities', ico: '/sber_helping.png', label: 'Возможности' },
            { id: 'life', ico: '/sber_live.png', label: 'Жизнь' },
            { id: 'testimonials', ico: '/sber_coments.png', label: 'Отзывы' },
            { id: 'checklist', ico: '/sber.png', label: 'Чек-лист' },
            { id: 'contacts', ico: '/sber_contacts.png', label: 'Контакты' },
            { id: 'faq', ico: '/sber_helping.png', label: 'FAQ' },
          ].map((b) => (
            <button key={b.id} className={activeSection === b.id ? 'act' : ''} onClick={() => scrollTo(b.id)} aria-label={b.label}>
              <div className="mobile-bar-icon">
                <Image src={b.ico} alt={b.label} width={32} height={32} />
              </div>
              <span className="mobile-bar-label">{b.label}</span>
            </button>
          ))}
        </div>

        <section id="hero" className="sec" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: 600, height: 600, top: -150, right: -150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,165,130,0.18) 0%, transparent 70%)', filter: 'blur(70px)', animation: 'float1 12s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', width: 500, height: 500, bottom: -80, left: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,96,154,0.15) 0%, transparent 70%)', filter: 'blur(70px)', animation: 'float2 16s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[320, 560, 800].map((size, i) => (
                <div key={i} style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: `1px solid rgba(244,165,130,${0.12 - i * 0.03})`, animation: `spin${i + 1} ${30 + i * 20}s linear infinite${i % 2 === 1 ? ' reverse' : ''}` }} />
              ))}
            </div>
            <div className="deco" style={{ width: 420, height: 420, top: '5%', right: '-80px', opacity: 0.55, animation: 'deco-float 10s ease-in-out infinite' }}><img src="/brandbook/20.png" alt="" /></div>
            <div className="deco" style={{ width: 320, height: 320, bottom: '10%', left: '-60px', opacity: 0.2, animation: 'deco-spin 40s linear infinite' }}><img src="/brandbook/22.png" alt="" /></div>
            <div className="deco" style={{ width: 180, height: 180, top: '12%', left: '8%', opacity: 0.22, animation: 'deco-float 14s ease-in-out infinite 2s' }}><img src="/brandbook/34.png" alt="" /></div>
            <div className="deco" style={{ width: 80, height: 80, top: '18%', right: '18%', opacity: 0.28, animation: 'deco-float 8s ease-in-out infinite 1s' }}><img src="/brandbook/16.png" alt="" /></div>
            <div className="deco" style={{ width: 420, height: 420, top: '18%', right: '-60px', opacity: 0.75, animation: 'deco-float 11s ease-in-out infinite', zIndex: 2 }}><img src="/brandbook/IMG_0339.png" alt="Котик-астронавт" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
            <div className="deco" style={{ width: 580, height: 580, top: '-120px', left: '50%', transform: 'translateX(-50%)', opacity: 0.22, animation: 'deco-spin 75s linear infinite', zIndex: 1 }}><img src="/brandbook/33.png" alt="Космическая планета" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
          </div>

          <style>{`
            @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-35px,35px)} }
            @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(28px,-28px)} }
            @keyframes spin1 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes spin2 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes spin3 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          `}</style>

          <div className="anim" style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div className="hero-badge"><div className="badge-dot" /> 📍 ул. Костина, 6 · Нижний Новгород</div>
            <h1 className="hero-title">ХАБ<br /><span className="hero-grad">новых возможностей</span></h1>
            <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 48px' }}>Мы запускаем проекты для развития региона. Современные технологии, инновационные сервисы и комфортное пространство — всё здесь.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#possibilities" className="btn-p" onClick={(e) => { e.preventDefault(); scrollTo('possibilities'); }}>Исследовать →</a>
              <a href="#booking" className="btn-s" onClick={(e) => { e.preventDefault(); setBookingModalOpen(true); }}>Забронировать</a>
              <button onClick={() => { if (!currentUser) setAuthModalOpen('login'); else setReviewModalOpen(true); }} className="btn-s" style={{ marginLeft: '8px' }} aria-label="оставить отзыв">Оставить отзыв</button>
              <button onClick={() => setQuestionModalOpen(true)} className="btn-s" style={{ marginLeft: '8px' }} aria-label="задать вопрос">Задать вопрос</button>
            </div>
          </div>

          <div className="anim" style={{ maxWidth: 1100, margin: '64px auto 0', width: '100%', padding: '0 60px' }}>
            <div className="map-wrap">
              {showVideo ? (
                <video ref={videoRef} src="/per.mp4" autoPlay muted playsInline onEnded={handleVideoEnd} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <iframe src="https://yandex.ru/map-widget/v1/?ll=44.005775%2C56.328617&z=16&pt=44.005775,56.328617" width="100%" height="100%" style={{ border: 0, display: 'block' }} allowFullScreen />
              )}
            </div>
          </div>
        </section>

        <div style={{ position: 'relative', height: 0, overflow: 'visible', zIndex: 10 }}>
          <img src="/brandbook/22.png" alt="" style={{ position: 'absolute', right: 60, top: -120, width: 240, opacity: 0.45, pointerEvents: 'none', animation: 'deco-float 12s ease-in-out infinite' }} />
        </div>

        <div className="divider-peach" />
        <section id="office" className="sec sec-alt">
          <div className="anim" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="s-label">Пространство</div>
            <h2 className="s-title">Офис Сбера на Костина, 6</h2>
            <p className="s-sub" style={{ maxWidth: 520, margin: '14px auto 0' }}>Современные интерьеры, комфортные зоны для работы и отдыха</p>
          </div>
          <div className="slider-wrap anim"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
              <img className="slide-img" src={officePhotos[officeIdx].url} alt={officePhotos[officeIdx].title} />
              <div className="slide-caption">{officePhotos[officeIdx].title}</div>
            </div>
            <button className="sl-btn sl-l" onClick={() => handleOfficeManual((officeIdx - 1 + officePhotos.length) % officePhotos.length)} aria-label="назад">←</button>
            <button className="sl-btn sl-r" onClick={() => handleOfficeManual((officeIdx + 1) % officePhotos.length)} aria-label="вперел">→</button>
            <div className="dots">
              {officePhotos.map((_, i) => (
                <div key={i} className={`dot ${i === officeIdx ? 'act' : ''}`} onClick={() => handleOfficeManual(i)} />
              ))}
            </div>
          </div>
        </section>

        <div className="divider-blue" />
        <section id="possibilities" className="sec" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="deco" style={{ width: 500, height: 500, top: -100, right: -100, opacity: 0.08, animation: 'deco-spin 60s linear infinite reverse' }}><img src="/brandbook/37.png" alt="" /></div>
          <div className="anim" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="s-label">Всё для тебя</div>
            <h2 className="s-title">Возможности центра</h2>
          </div>
          <div className="grid-3">
            {[
              { img: 'sber_present.png', name: 'Программа лояльности', desc: 'Бонусы, скидки у партнёров и приоритетное бронирование за активность' },
              { img: 'sber_food.png', name: 'Снеки и напитки', desc: 'Бесплатный кофе, фрукты, яблоки, груши, сливы каждый день' },
              { img: 'sber_rest.png', name: 'Массажное кресло', desc: 'Relax-зона с профессиональными массажными креслами' },
              { img: 'sber_man_sport.png', name: 'Спортзал', desc: 'Открыт 07:00–21:00, современное оборудование, душевые' },
              { img: 'sber_suitcase.png', name: 'Коворкинг', desc: 'Светлые рабочие места и переговорные с 4K-экранами и Wi-Fi 6' },
              { img: 'sber_books.png', name: 'Обучение', desc: 'Мастер-классы, тренинги, курсы на Пульсе — постоянный рост' },
              { img: 'sber_a_man_is_resting_in_a_chair.png', name: 'Удобное расположение', desc: 'Центр города, рядом с метро Горьковская' },
              { img: 'sber_printer.png', name: 'Печать и канцтовары', desc: 'Цветной МФУ в коворкинге, всё необходимое на ресепшене' },
            ].map((f, i) => (
              <div className="card anim" key={i} style={{ transitionDelay: `${i * 0.06}s` }}>
                <img src={f.img} alt={f.name} style={{ width: 48, height: 48, objectFit: 'contain', marginBottom: 20, display: 'block' }} />
                <h3 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{f.name}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <button className="btn-p" onClick={() => openModal('Забронировать переговорную', 'Свяжитесь с Ириной Кузнецовой в Telegram: @irina_booking, или через внутренний портал.')}aria-label="забронировать переговорную">Забронировать переговорную →</button>
          </div>
        </section>

        <div className="divider-peach" />
        <section id="life" className="sec sec-alt">
          <div className="anim" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="s-label">Программа лояльности</div>
            <h2 className="s-title">Жизнь внутри центра</h2>
            <p className="s-sub" style={{ maxWidth: 500, margin: '14px auto 0' }}>Скидки и бонусы для сотрудников ХАБа — просто покажи пропуск Сбера</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:36 }}>
            {loyaltyCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-label={cat.label}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'10px 22px', borderRadius:100, fontSize:13, fontWeight:700,
                  cursor:'pointer', transition:'all .25s', border:'1px solid',
                  borderColor: activeCategory === cat.id ? 'rgba(244,165,130,.6)' : 'rgba(255,255,255,.1)',
                  background: activeCategory === cat.id ? 'rgba(244,165,130,.15)' : 'rgba(255,255,255,.04)',
                  color: activeCategory === cat.id ? '#f4a582' : 'rgba(240,238,248,.55)',
                  fontFamily:'Manrope,sans-serif',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div
            key={activeCategory}
            style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
              gap:20,
              maxWidth:1100,
              margin:'0 auto',
              animation:'fadeInUp .35s ease',
            }}
          >
            {loyaltyCategories
              .find(c => c.id === activeCategory)?.items
              .map((item, i) => (
                <div key={i} className="card" style={{ display:'flex', flexDirection:'column', gap:12, padding:24 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <span style={{ fontSize:36, flexShrink:0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, lineHeight:1.3 }}>{item.name}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>📍 {item.addr}</div>
                    </div>
                  </div>
                  <div style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    padding:'5px 14px', borderRadius:100, fontSize:12, fontWeight:700,
                    background:'rgba(244,165,130,.12)', border:'1px solid rgba(244,165,130,.35)',
                    color:'var(--peach)', width:'fit-content',
                  }}>
                    🎁 {item.badge}
                  </div>
                  <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6, flex:1 }}>{item.desc}</p>
                  <div style={{ fontSize:12, color:'var(--blue)', fontWeight:600 }}>📞 {item.contact}</div>
                  {item.actions && item.actions.length > 0 && (
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:4 }}>
                      {item.actions.map((action, j) => {
                        const href = action.tg || action.site || action.map || '#';
                        const isTg = !!action.tg;
                        const isMap = !!action.map;
                        const prefix = isTg ? '✈️ ' : isMap ? '🗺 ' : '🔗 ';
                        return (
                          <a
                            key={j}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display:'inline-flex', alignItems:'center', gap:4,
                              padding:'7px 14px', borderRadius:100, fontSize:12, fontWeight:600,
                              textDecoration:'none', transition:'all .2s',
                              background: isTg
                                ? 'rgba(91,200,245,.1)'
                                : isMap
                                  ? 'rgba(179,136,247,.1)'
                                  : 'rgba(244,165,130,.1)',
                              border: `1px solid ${isTg ? 'rgba(91,200,245,.35)' : isMap ? 'rgba(179,136,247,.35)' : 'rgba(244,165,130,.35)'}`,
                              color: isTg ? 'var(--blue)' : isMap ? 'var(--purple)' : 'var(--peach)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                          >
                            {prefix}{action.label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
          <div style={{ maxWidth:1100, margin:'48px auto 0' }}>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div className="s-label">Мероприятия</div>
              <h3 style={{ fontFamily:'Unbounded,sans-serif', fontSize:24, fontWeight:700 }}>Каждую неделю — что-то новое</h3>
            </div>
            <div className="grid-2">
              {lifeEvents.map((ev, i) => (
                <div className="card anim" key={i} style={{ transitionDelay:`${i*0.08}s` }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>{ev.emoji}</div>
                  <h3 style={{ fontFamily:'Unbounded,sans-serif', fontSize:17, fontWeight:700, marginBottom:10 }}>{ev.title}</h3>
                  <p style={{ color:'var(--muted)', lineHeight:1.65, fontSize:14 }}>{ev.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:36 }}>
              <Link href="https://t.me/HubEventMatch_bot" target="_blank" rel="noreferrer" className="btn-s">Записаться через бот</Link>
            </div>
          </div>
        </section>

        <div className="divider-blue" />
        <section id="testimonials" className="sec">
          <div className="anim" style={{ textAlign: 'center', marginBottom: 16 }}>
            <div className="s-label">Что говорят</div>
            <h2 className="s-title">Отзывы сотрудников</h2>
            <div style={{ fontSize: 28, color: '#f59e0b', marginTop: 16 }}>★★★★★ <span style={{ color: 'var(--muted)', fontSize: 18 }}>5.0 / 5</span></div>
          </div>

          <div className="testimonial-slider"
            onMouseEnter={stopAutoTestimonial}
            onMouseLeave={startAutoTestimonial}
          >
            <div className="testimonial-track" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
              {[...apiReviews.map(r => ({ name: r.author_name, role: 'Сотрудник', text: r.text, avatar: '👤' })), ...testimonials].map((t, idx) => (
                <div className="testimonial-slide" key={idx}>
                  <div className="card test-card" style={{ margin: 0, width: '100%' }}>
                    <div className="test-avatar">{t.avatar}</div>
                    <p className="test-text">«{t.text}»</p>
                    <div className="test-stars">★★★★★</div>
                    <h4 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 16, fontWeight: 700 }}>{t.name}</h4>
                    <p style={{ color: 'var(--muted)', marginTop: 6 }}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="sl-btn sl-l" onClick={() => handleTestimonialManual((testimonialIdx - 1 + testimonialTotal) % testimonialTotal)} aria-label="вперед">←</button>
            <button className="sl-btn sl-r" onClick={() => handleTestimonialManual((testimonialIdx + 1) % testimonialTotal)} aria-label="назад">→</button>
            <div className="dots">
              {[...apiReviews, ...testimonials].map((_, i) => (
                <div key={i} className={`dot ${i === testimonialIdx ? 'act' : ''}`} onClick={() => handleTestimonialManual(i)} />
              ))}
            </div>
          </div>
        </section>

        <div className="divider-peach" />
        <section id="checklist" className="sec sec-alt" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="deco" style={{ width: 300, height: 300, bottom: 0, left: -80, opacity: 0.2, animation: 'deco-float 16s ease-in-out infinite' }}><img src="/brandbook/23.png" alt="" /></div>
          <div className="anim" style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="s-label">Адаптация</div>
            <h2 className="s-title">Карта пути новичка</h2>
            <p className="s-sub">Нажми на точку, чтобы отметить задачу. Прогресс виден сразу</p>
          </div>

          <div style={{ maxWidth: '100%', margin: '0 auto', padding: '20px 0 30px', overflowX: 'auto' }}>
            {!isMobile ? (
              <svg viewBox="0 0 900 90" style={{ width: '100%', height: 'auto', display: 'block', minWidth: '600px' }}>
                <path d="M 60 45 L 760 45" stroke="var(--muted)" strokeWidth="1.5" fill="none" strokeDasharray="5 5" strokeLinecap="round" />
                <path d="M 60 45 Q 200 70, 300 45 T 540 45 T 760 55" stroke="var(--peach)" strokeWidth="3" fill="none" strokeLinecap="round" />
                {[
                  { x: 80, title: 'День 1', icon: '1', fill: '#f4a582', dayIndex: 0 },
                  { x: 300, title: 'День 2', icon: '2', fill: '#5bc8f5', dayIndex: 1 },
                  { x: 520, title: 'День 3', icon: '3', fill: '#b388f7', dayIndex: 2 },
                  { x: 740, title: 'Доп. день', icon: '4', fill: '#e8609a', dayIndex: 3 },
                ].map((point) => {
                  const done = checklistState[point.dayIndex].filter(Boolean).length;
                  const total = checklistGrouped[point.dayIndex].items.length;
                  return (
                    <g key={point.dayIndex} style={{ cursor: 'pointer' }} onClick={() => setSelectedDay(point.dayIndex)}>
                      <circle cx={point.x} cy={45} r="18" fill={point.fill} stroke="#fff" strokeWidth="2.5" />
                      <text x={point.x} y={50} textAnchor="middle" fill="#12001a" fontWeight="bold" fontSize="14">{point.icon}</text>
                      <text x={point.x} y="70" textAnchor="middle" fill="var(--text)" fontSize="10" fontWeight="500">{point.title}</text>
                      <text x={point.x} y="82" textAnchor="middle" fill="var(--peach)" fontSize="9" fontWeight="600">{done}/{total}</text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <svg viewBox="0 0 320 420" style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }}>
                <path d="M 160 30 L 160 390" stroke="var(--muted)" strokeWidth="1.5" fill="none" strokeDasharray="5 5" strokeLinecap="round" />
                <path d="M 160 30 C 200 50, 200 80, 160 100 C 120 120, 120 150, 160 170 C 200 190, 200 220, 160 240 C 120 260, 120 290, 160 310 C 190 330, 190 360, 160 380" stroke="var(--peach)" strokeWidth="3" fill="none" strokeLinecap="round" />
                {[
                  { y: 40, title: 'День 1', icon: '1', fill: '#f4a582', dayIndex: 0 },
                  { y: 110, title: 'День 2', icon: '2', fill: '#5bc8f5', dayIndex: 1 },
                  { y: 180, title: 'День 3', icon: '3', fill: '#b388f7', dayIndex: 2 },
                  { y: 260, title: 'Доп. день', icon: '4', fill: '#e8609a', dayIndex: 3 },
                ].map((point) => {
                  const done = checklistState[point.dayIndex].filter(Boolean).length;
                  const total = checklistGrouped[point.dayIndex].items.length;
                  return (
                    <g key={point.dayIndex} style={{ cursor: 'pointer' }} onClick={() => setSelectedDay(point.dayIndex)}>
                      <circle cx="160" cy={point.y} r="20" fill={point.fill} stroke="#fff" strokeWidth="2.5" />
                      <text x="160" y={point.y + 5} textAnchor="middle" fill="#12001a" fontWeight="bold" fontSize="15">{point.icon}</text>
                      <text x="160" y={point.y + 28} textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="500">{point.title}</text>
                      <text x="160" y={point.y + 42} textAnchor="middle" fill="var(--peach)" fontSize="10" fontWeight="600">{done}/{total}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {selectedDay !== null && (
            <div className="checklist-modal-overlay" onClick={() => setSelectedDay(null)}>
              <div className="checklist-modal" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '22px', margin: 0 }}>{checklistGrouped[selectedDay].day}</h3>
                  <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: 'var(--text)', opacity: 0.7 }} aria-label="закрыть">✕</button>
                </div>
                <div>
                  {checklistGrouped[selectedDay].items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'var(--card)', borderRadius: '16px', marginBottom: '12px', cursor: 'pointer', transition: '0.2s' }}
                      onClick={() => toggleChecklistItem(selectedDay, idx)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244,165,130,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--card)')}>
                      <div className={`cl-box${checklistState[selectedDay][idx] ? ' done' : ''}`}>{checklistState[selectedDay][idx] && '✓'}</div>
                      <span style={{ flex: 1, textDecoration: checklistState[selectedDay][idx] ? 'line-through' : 'none', opacity: checklistState[selectedDay][idx] ? 0.6 : 1 }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(244,165,130,0.08)', borderRadius: '12px', textAlign: 'center' }}>
                    📊 Прогресс: {checklistState[selectedDay].filter(Boolean).length} / {checklistGrouped[selectedDay].items.length}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 100, background: 'rgba(244,165,130,0.12)', color: 'var(--peach)', fontSize: 13, fontWeight: 600 }}>
              🗺️ Общий прогресс: {getCheckedCount()} / {getTotalCount()}
            </div>
          </div>
          <p style={{ marginTop: 24, color: 'var(--muted)', fontSize: 12, fontStyle: 'italic', textAlign: 'center' }}>
            * Период адаптации — 1 неделя. После прохождения курсов на «Пульсе» открываются все бонусы.
          </p>
        </section>

        <div className="divider-blue" />
        <section id="contacts" className="sec">
          <div className="anim" style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="s-label">Команда поддержки</div>
            <h2 className="s-title">К кому обратиться?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
            {contacts.map((c, i) => (
              <div className="card anim" key={i} style={{ textAlign: 'center', transitionDelay: `${i * 0.07}s`, display: 'flex', flexDirection: 'column', height: '100%', padding: '36px 28px' }}>
                <div className="contact-avatar">
                  {c.avatarImg ? <img src={c.avatarImg} alt={c.name} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} /> : <span>{c.emoji}</span>}
                </div>
                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{c.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 20, flexGrow: 1, lineHeight: 1.4 }}>{c.role}</p>
                <a href={`https://t.me/${c.tg}`} target="_blank" rel="noreferrer" className="btn-s" style={{ fontSize: 12, padding: '11px 20px', marginTop: 'auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textAlign: 'center' }}>✈️ Telegram</a>
              </div>
            ))}
            <div className="card anim" style={{ textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', padding: '36px 28px' }} onClick={() => setApplyOpen(true)}>
              <div className="contact-avatar"><img src="add.png" alt="add" /></div>
              <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Хочу в команду</h3>
              <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 20, flexGrow: 1, lineHeight: 1.4 }}>Присоединяйтесь к нам!</p>
              <button className="btn-p" style={{ fontSize: 12, padding: '11px 20px', marginTop: 'auto', width: '100%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="заявка">Заявка →</button>
            </div>
          </div>
        </section>

        <div className="divider-peach" />
        <section id="faq" className="sec sec-alt" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="deco" style={{ width: 260, height: 260, top: 40, right: -60, opacity: 0.12, animation: 'deco-spin 50s linear infinite' }}><img src="/brandbook/33.png" alt="" /></div>
          <div className="anim" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="s-label">Ответы</div>
            <h2 className="s-title">Часто задаваемые вопросы</h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div className="faq-item anim" key={i} style={{ transitionDelay: `${i * 0.04}s` }}>
                  <div className="faq-q" onClick={() => setOpenFaq(isOpen ? null : i)}>
                    <span>{item.q}</span>
                    <span className={`faq-icon${isOpen ? ' open' : ''}`}>+</span>
                  </div>
                  <div className="faq-body" style={{ maxHeight: isOpen ? '300px' : '0px', padding: isOpen ? '0 28px 22px 28px' : '0 28px' }}>{item.a}</div>
                </div>
              );
            })}
          </div>
        </section>

        <footer style={{ padding: '32px 60px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: 'var(--bg)' }}>
          <div style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 14 }}>ХАБ · Сбер</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>ул. Костина, 6, Нижний Новгород · © 2026 Сбер</div>
        </footer>

        <div className={`modal-ov${bookingModalOpen ? ' open' : ''}`} onClick={() => { setBookingModalOpen(false); setBookingError(''); setBookingSuccess(false); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Коворкинг забронирован!</h3>
                <p style={{ color: 'var(--muted)' }}>Подтверждение отправлено на почту.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Бронирование коворкинга</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Выберите дату и время — мы проверим доступность</p>
                <form onSubmit={handleBookingSubmit}>
                  <label className="modal-label">Имя *</label>
                  <input
                    className="modal-input" required placeholder="Иван Иванов"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  />
                  <label className="modal-label">Дата *</label>
                  <input
                    className="modal-input" type="date" required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={(e) => handleBookingDateChange(e.target.value)}
                  />
                  {bookedSlots.length > 0 && (
                    <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 12, background: 'rgba(232,96,154,0.08)', border: '1px solid rgba(232,96,154,0.25)', fontSize: 13, color: 'var(--muted)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--pink)' }}>⚠️ Занятые слоты:</span>
                      <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                        {bookedSlots.map((s, i) => (
                          <li key={i}>{s.time_start.slice(0, 5)} – {s.time_end.slice(0, 5)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="modal-label">Начало *</label>
                      <select
                        className="modal-input" required
                        value={bookingForm.time_start}
                        onChange={(e) => { setBookingForm({ ...bookingForm, time_start: e.target.value }); setBookingError(''); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="" disabled>Выберите</option>
                        {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="modal-label">Конец *</label>
                      <select
                        className="modal-input" required
                        value={bookingForm.time_end}
                        onChange={(e) => { setBookingForm({ ...bookingForm, time_end: e.target.value }); setBookingError(''); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="" disabled>Выберите</option>
                        {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>
                  {bookingError && (
                    <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(232,96,154,0.1)', border: '1px solid rgba(232,96,154,0.35)', color: 'var(--pink)', fontSize: 13, fontWeight: 600 }}>
                      ❌ {bookingError}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button
                      type="submit" className="btn-p"
                      style={{ flex: 1, justifyContent: 'center', border: 'none', cursor: bookingLoading ? 'not-allowed' : 'pointer', opacity: bookingLoading ? 0.7 : 1 }}
                      disabled={bookingLoading}
                      aria-label="забронировать"
                    >
                      {bookingLoading ? 'Проверяем...' : 'Забронировать →'}
                    </button>
                    <button type="button" className="btn-s" onClick={() => { setBookingModalOpen(false); setBookingError(''); }} aria-label="отмена">Отмена</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className={`modal-ov${applyOpen ? ' open' : ''}`} onClick={() => { setApplyOpen(false); setApplyDone(false); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {applyDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}><div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div><h3 style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Заявка отправлена!</h3><p style={{ color: 'var(--muted)' }}>Мы свяжемся с вами в ближайшее время.</p></div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Хочу в команду</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28 }}>Заполните форму — мы свяжемся с вами!</p>
                <form onSubmit={handleApply}>
                  <label className="modal-label">Имя *</label><input className="modal-input" required placeholder="Иван Иванов" value={applyForm.name} onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })} />
                  <label className="modal-label">Направление / роль *</label><input className="modal-input" required placeholder="Разработчик, аналитик..." value={applyForm.role} onChange={(e) => setApplyForm({ ...applyForm, role: e.target.value })} />
                  <label className="modal-label">Telegram</label><input className="modal-input" placeholder="@username" value={applyForm.tg} onChange={(e) => setApplyForm({ ...applyForm, tg: e.target.value })} />
                  <label className="modal-label">О себе</label><textarea className="modal-input" rows={3} placeholder="Расскажите немного о себе..." value={applyForm.message} onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })} style={{ resize: 'none' }} />
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <button type="submit" className="btn-p" style={{ flex: 1, justifyContent: 'center', border: 'none', cursor: 'pointer', padding: '13px 0' }} aria-label="отправить">Отправить</button>
                    <button type="button" className="btn-s" style={{ padding: '13px 20px', cursor: 'pointer' }} onClick={() => setApplyOpen(false)} aria-label="отмена">Отмена</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className={`modal-ov${authModalOpen ? ' open' : ''}`} onClick={() => setAuthModalOpen(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
              <button onClick={() => setAuthModalOpen('login')} style={{ background: 'none', border: 'none', padding: '8px 0', fontSize: '18px', fontWeight: authModalOpen === 'login' ? 700 : 400, color: authModalOpen === 'login' ? 'var(--peach)' : 'var(--muted)', cursor: 'pointer', borderBottom: authModalOpen === 'login' ? '2px solid var(--peach)' : 'none' }} aria-label="вход">Вход</button>
              <button onClick={() => setAuthModalOpen('register')} style={{ background: 'none', border: 'none', padding: '8px 0', fontSize: '18px', fontWeight: authModalOpen === 'register' ? 700 : 400, color: authModalOpen === 'register' ? 'var(--peach)' : 'var(--muted)', cursor: 'pointer', borderBottom: authModalOpen === 'register' ? '2px solid var(--peach)' : 'none' }} aria-label="регистрация">Регистрация</button>
            </div>
            {authModalOpen === 'login' && (
              <form onSubmit={handleLogin}>
                <label className="modal-label">Имя</label><input className="modal-input" required placeholder="Иван Иванов" value={loginForm.login} onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })} />
                <label className="modal-label">Пароль</label><input className="modal-input" type="password" required placeholder="••••••" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                {authError && <div style={{ color: '#e8609a', fontSize: '13px', marginBottom: '16px' }}>{authError}</div>}
                <button type="submit" className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} aria-label="войти">Войти</button>
              </form>
            )}
            {authModalOpen === 'register' && (
              <form onSubmit={handleRegister}>
                <label className="modal-label">Имя (только русские буквы)</label><input className="modal-input" required placeholder="Иван Иванов" value={registerForm.login} onChange={(e) => setRegisterForm({ ...registerForm, login: e.target.value })} />
                <label className="modal-label">Пароль</label><input className="modal-input" type="password" required placeholder="••••••" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
                <label className="modal-label">Повторите пароль</label><input className="modal-input" type="password" required placeholder="••••••" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} />
                {authError && <div style={{ color: '#e8609a', fontSize: '13px', marginBottom: '16px' }}>{authError}</div>}
                <button type="submit" className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} aria-label="зарегистрироваться">Зарегистрироваться</button>
              </form>
            )}
          </div>
        </div>

        <div className={`modal-ov${reviewModalOpen ? ' open' : ''}`} onClick={() => setReviewModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            {reviewSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}><div style={{ fontSize: 56, marginBottom: 16 }}>
                <video src="/sber_cat_loves.webm" autoPlay muted loop playsInline style={{ width: '50%', height: '50%', objectFit: 'contain' }}/>
              </div>
              <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Спасибо за отзыв!</h3>
              <p style={{ color: 'var(--muted)' }}>Ваше мнение очень важно для нас.</p></div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Оставить отзыв</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Поделитесь впечатлениями о хабе{currentUser && <span style={{ display: 'block', marginTop: 8, color: 'var(--peach)', fontWeight: 600 }}>От имени: {currentUser.name}</span>}</p>
                <form onSubmit={handleReviewSubmit}>
                  <label className="modal-label">Оценка</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', fontSize: '28px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} style={{ cursor: 'pointer', color: star <= reviewForm.rating ? '#f59e0b' : '#ccc' }}>★</span>
                    ))}
                  </div>
                  <label className="modal-label">Ваш отзыв</label>
                  <textarea className="modal-input" rows={4} required placeholder="Расскажите о своём опыте..." value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} style={{ resize: 'none' }} />
                  <button type="submit" className="btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} aria-label="отправить отзыв">Отправить отзыв</button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className={`modal-ov${questionModalOpen ? ' open' : ''}`} onClick={() => setQuestionModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            {questionSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📨</div>
                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Вопрос отправлен!</h3>
                <p style={{ color: 'var(--muted)' }}>Мы ответим вам в ближайшее время.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Задать вопрос</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Напишите, и мы обязательно ответим</p>
                <form onSubmit={handleQuestionSubmit}>
                  <label className="modal-label">Ваше имя (необязательно)</label>
                  <input
                    className="modal-input"
                    placeholder="Иван Иванов"
                    value={questionForm.name}
                    onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                  />
                  <label className="modal-label">Email или телефон *</label>
                  <input
                    className="modal-input"
                    required
                    placeholder="email@example.com или +7(123)456-78-90"
                    value={questionForm.contact}
                    onChange={(e) => setQuestionForm({ ...questionForm, contact: e.target.value })}
                  />
                  <label className="modal-label">Ваш вопрос *</label>
                  <textarea
                    className="modal-input"
                    rows={4}
                    required
                    placeholder="Расскажите, что вас интересует..."
                    value={questionForm.text}
                    onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                    style={{ resize: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button 
                      type="submit" 
                      className="btn-p" 
                      style={{ flex: 1, justifyContent: 'center' }}
                      disabled={isSending}
                      aria-label={isSending ? 'Отправка...' : 'Отправить'}
                    >
                      {isSending ? 'Отправка...' : 'Отправить'}
                    </button>
                    <button 
                      type="button" 
                      className="btn-s" 
                      onClick={() => setQuestionModalOpen(false)}
                      disabled={isSending}
                      aria-label="Отмена"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}