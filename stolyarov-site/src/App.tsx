import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/* ------------ Типы ----------- */
type Truck = {
  id: number;
  name: string;
  year: number;
  type: string;
  notes?: string;
  img: string;
  available: boolean;
};

type FormState = {
  name: string;
  contact: string;
  route: string;
  message: string;
};

/* ------------ Данные (пример) ----------- */
const COMPANY_NAME = "ИП «Столярова О.Н.»";
const FOUNDED = 2012;
const ROUTES = "Павлодар — Омск, Омск — Павлодар";
const GOODS = ["Металл", "Гофра", "Машинное масло"];

const INITIAL_FLEET: Truck[] = [
  {
    id: 1,
    name: "Renault",
    year: 2008,
    type: "Тягач",
    notes: "Регулярный рейс, приоритетные маршруты",
    img: "./src/assets/renault_2008.jpg",
    available: true,
  },
  {
    id: 2,
    name: "DAF",
    year: 2009,
    type: "Тягач",
    notes: "Техника в отличном состоянии",
    img: "./src/assets/daf_2009.jpg",
    available: false,
  },
];

/* ------------ Утилиты ----------- */
const yearsOnMarket = new Date().getFullYear() - FOUNDED;

/* ------------ Главный компонент ----------- */
const App: React.FC = () => {
  /* --- state --- */
  const [fleet, setFleet] = useState<Truck[]>(INITIAL_FLEET);
  const [filterAvailable, setFilterAvailable] = useState<"all" | "free" | "busy">("all");
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [counters, setCounters] = useState({ years: 0, shipments: 0 });
  const [form, setForm] = useState<FormState>({ name: "", contact: "", route: ROUTES, message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* --- derived --- */
  const shipmentsText = "1000+";

  const filteredFleet = useMemo(() => {
    if (filterAvailable === "all") return fleet;
    if (filterAvailable === "free") return fleet.filter((t) => t.available);
    return fleet.filter((t) => !t.available);
  }, [fleet, filterAvailable]);

  /* --- animировать счётчики при монтировании --- */
  useEffect(() => {
    let raf: number;
    const duration = 900;
    const start = performance.now();
    const fromYears = 0;
    const toYears = yearsOnMarket;
    const fromShip = 0;
    const toShip = 1000;

    const step = (ts: number) => {
      const p = Math.min(1, (ts - start) / duration);
      setCounters({
        years: Math.floor(fromYears + (toYears - fromYears) * p),
        shipments: Math.floor(fromShip + (toShip - fromShip) * p),
      });
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        setCounters({ years: toYears, shipments: toShip });
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* --- симулированная отправка формы --- */
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Введите имя";
    if (!form.contact.trim()) errs.contact = "Телефон или email обязателен";
    if (!form.message.trim()) errs.message = "Коротко опишите груз/маршрут";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;
    setSending(true);
    // симулируем отправку
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setToast("Заявка отправлена. Мы свяжемся с вами в течение рабочего дня.");
    setForm({ name: "", contact: "", route: ROUTES, message: "" });
    setFormErrors({});
    setTimeout(() => setToast(null), 4000);
  };

  /* --- копирование телефона --- */
  const copyPhone = async () => {
    const phone = "+7 (707) 450-03-92";
    try {
      await navigator.clipboard.writeText(phone);
      setToast("Номер скопирован в буфер обмена");
      setTimeout(() => setToast(null), 2500);
    } catch {
      setToast("Копирование не поддерживается в этом браузере");
      setTimeout(() => setToast(null), 2500);
    }
  };

  /* --- UI --- */
  return (
    <div className="site-root">
      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-mark"></div>
            <div>
              <div className="brand-title">{COMPANY_NAME}</div>
              <div className="brand-sub">Грузоперевозки</div>
            </div>
          </div>

          <nav className="nav">
            <a href="#services">Услуги</a>
            <a href="#fleet">Автопарк</a>
            <a href="#advantages">Преимущества</a>
            <a href="#contacts">Связаться</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left">
            <h1 className="hero-title">Надёжные грузоперевозки с фокусом на скорость и безопасность</h1>
            <p className="hero-lead">С 2012 года выполняем регулярные рейсы между Павлодаром и Омском. Поддерживаем высокий стандарт обслуживания и прозрачную коммуникацию с клиентом.</p>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-num">{counters.shipments >= 1000 ? "1000+" : counters.shipments}</div>
                <div className="stat-label">Рейсов</div>
              </div>
              <div className="stat">
                <div className="stat-num">{counters.years}</div>
                <div className="stat-label">Лет на рынке</div>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn" onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}>Оставить заявку</button>
              <button className="btn btn-outline" onClick={copyPhone}>Копировать телефон</button>
            </div>
          </div>

          <div className="hero-right" aria-hidden>
            <div className="hero-card">
              <img src={INITIAL_FLEET[0].img} alt="Renault 2008" />
              <div className="hero-card-body">
                <div className="tc">Тягач Renault — 2008</div>
                <div className="muted">Готов к междугородним рейсам</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section">
        <div className="container">
          <h2 className="section-title">Услуги</h2>
          <p className="section-sub">Оказываем автомобильные перевозки по Казахстану и России. Работаем с промышленными грузами: металл, гофра, машинное масло.</p>

          <div className="cards-row">
            <div className="card small">
              <div className="icon">🚚</div>
              <h3>Регулярные рейсы</h3>
              <p>Оптимальные графики и гарантированная загрузка.</p>
            </div>

            <div className="card small">
              <div className="icon">⚙️</div>
              <h3>Техническая поддержка</h3>
              <p>Плановое ТО и быстрые ремонты на базе сервиса.</p>
            </div>

            <div className="card small">
              <div className="icon">🔒</div>
              <h3>Страхование груза</h3>
              <p>Работаем с проверенными страховщиками по запросу.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section id="advantages" className="section bg-light">
        <div className="container">
          <h2 className="section-title">Преимущества</h2>
          <div className="advantages-grid">
            <div className="adv">Высококвалифицированные водители</div>
            <div className="adv">Скорость доставки</div>
            <div className="adv">Постоянный водительский состав</div>
            <div className="adv">Увеличивающийся парк машин</div>
            <div className="adv">Внедрение ИКТ</div>
            <div className="adv">Надежные эксплуатационные машины</div>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section id="fleet" className="section">
        <div className="container">
          <div className="section-head-row">
            <h2 className="section-title">Автопарк</h2>
            <div className="fleet-controls">
              <label className="small-muted">Показывать:</label>
              <select value={filterAvailable} onChange={(e) => setFilterAvailable(e.target.value as any)}>
                <option value="all">Все</option>
                <option value="free">Свободные</option>
                <option value="busy">В рейсе</option>
              </select>
            </div>
          </div>

          <div className="fleet-grid">
            {filteredFleet.map((t) => (
              <article key={t.id} className="truck-card" onClick={() => setSelectedTruck(t)} tabIndex={0}>
                <div className={`truck-image ${t.available ? "" : "muted"}`}>
                  <img src={t.img} alt={`${t.name} ${t.year}`} />
                </div>
                <div className="truck-body">
                  <div className="truck-title">{t.name} — {t.year}</div>
                  <div className="truck-sub">{t.type}</div>
                  <div className="truck-row">
                    <span className={`chip ${t.available ? "chip-green" : "chip-red"}`}>{t.available ? "Свободен" : "В рейсе"}</span>
                    <button className="link-btn" onClick={(e) => { e.stopPropagation(); setForm({ ...form, route: ROUTES }); document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" }); }}>Заказать рейс</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Form */}
      <section id="contacts" className="section bg-dark">
        <div className="container contact-grid">
          <div className="contact-card">
            <h3>Оставьте заявку</h3>
            <p className="muted">Опишите груз и желаемые даты. Мы свяжемся для уточнения деталей.</p>

            <form onSubmit={onSubmit} className="form">
              <div className="field">
                <label>Имя</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {formErrors.name && <div className="field-error">{formErrors.name}</div>}
              </div>

              <div className="field">
                <label>Телефон или email</label>
                <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                {formErrors.contact && <div className="field-error">{formErrors.contact}</div>}
              </div>

              <div className="field">
                <label>Маршрут</label>
                <input value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} />
              </div>

              <div className="field">
                <label>Описание / сообщение</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                {formErrors.message && <div className="field-error">{formErrors.message}</div>}
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? "Отправка..." : "Отправить"}</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setForm({ name: "", contact: "", route: ROUTES, message: "" }); setFormErrors({}); }}>Очистить</button>
              </div>
            </form>
          </div>

          <aside className="contact-info">
            <h4>Контакты</h4>
            <p>📍 Павлодар, Казахстан</p>
            <p>📞 <strong>+7 (707) 450-03-92</strong> <button className="link-btn-small" onClick={copyPhone}>Копировать</button></p>
            <p>✉️ stolarovigor734@gmail.com</p>

            <div className="mini-cards">
              <div className="mini-card">
                <div className="mini-title">Маршруты</div>
                <div className="mini-sub">{ROUTES}</div>
              </div>
              <div className="mini-card">
                <div className="mini-title">Основные грузы</div>
                <div className="mini-sub">{GOODS.join(", ")}</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <div>© {new Date().getFullYear()} {COMPANY_NAME}</div>
            <div className="muted">Разработка &ndash; демонстрационный сайт</div>
          </div>
        </div>
      </footer>

      {/* Modal for truck details */}
      {selectedTruck && (
        <div className="modal" role="dialog" onClick={() => setSelectedTruck(null)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTruck(null)} aria-label="Закрыть">✕</button>
            <img src={selectedTruck.img} alt={selectedTruck.name} />
            <h3>{selectedTruck.name} — {selectedTruck.year}</h3>
            <p className="muted">{selectedTruck.type}</p>
            <p>{selectedTruck.notes}</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => { setForm({ ...form, route: ROUTES }); document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" }); setSelectedTruck(null); }}>Заказать этот тягач</button>
              <button className="btn btn-ghost" onClick={() => setSelectedTruck(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default App;
