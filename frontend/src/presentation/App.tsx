import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  PawPrint,
  Search,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  ShieldCheck,
  Truck,
  SlidersHorizontal,
  Heart,
  Dog,
  Cat,
  Rabbit,
  Leaf,
} from "lucide-react";
import { useCatalog } from "../logic/useCatalog";
import { money, type Product } from "../domain/product";

function ProductArt({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <div
      className={`product-art ${product.color} ${large ? "large" : ""}`}
      aria-label={`${product.name}, illustrative Verpackung`}
      role="img"
    >
      <div
        className={`package ${product.category === "Zubehör" ? "accessory" : ""}`}
      >
        <span className="package-brand">{product.brand}</span>
        <PawPrint size={large ? 55 : 35} strokeWidth={1.2} />
        <span className="package-name">{product.name}</span>
        <span className="package-line" />
        <small>
          {product.size} · {product.animal}
        </small>
      </div>
      <span className="art-leaf">
        <Leaf size={large ? 60 : 30} />
      </span>
    </div>
  );
}
function Header() {
  return (
    <>
      <div className="topline">
        <span>Für kleine Pfoten. Und große Ersparnisse.</span>
        <span>
          <ShieldCheck size={13} /> Transparent vergleichen
        </span>
      </div>
      <header>
        <Link className="logo" to="/">
          <span className="logo-icon">
            <PawPrint size={26} />
          </span>
          pfoten<span>preis</span>
          <span className="logo-dot">.</span>
        </Link>
        <nav aria-label="Hauptnavigation">
          <Link to="/">Preisvergleich</Link>
          <a href="#so-funktionierts">So funktioniert’s</a>
          <span className="demo-pill">Demo-Katalog</span>
        </nav>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer id="so-funktionierts">
      <div>
        <strong>
          <PawPrint size={18} /> Gut für dein Tier. Gut für dich.
        </strong>
        <p>Produkt finden, Preise vergleichen, Lieblingsangebot entdecken.</p>
      </div>
      <p>
        Demoprojekt · Fiktive Händler & Beispielpreise
        <br />
        Kein Verkauf und keine Weiterleitung zu Shops.
      </p>
    </footer>
  );
}
function Status({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
}) {
  return (
    <div className="status" role="status">
      {loading ? (
        "Wir suchen die besten Pfotenpreise …"
      ) : (
        <>
          <h2>Das hat leider nicht geklappt.</h2>
          <p>{error}</p>
          <button onClick={retry}>Erneut versuchen</button>
        </>
      )}
    </div>
  );
}
function Listing() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);
  const { items, loading, error, retry } = useCatalog(params.toString());
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };
  const animal = params.get("animal") ?? "";
  const active = ["q", "animal", "category"].some((key) => params.has(key));
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> FÜR ALLE, DIE TIERE LIEBEN
          </div>
          <h1>
            Alles für deinen Liebling.
            <br />
            <em>Zum besten Preis.</em>
          </h1>
          <p>
            Mehr Freude. Weniger Ausgaben. Vergleiche Futter und
            <br className="desktop" /> Zubehör für dein Tier – einfach an einem
            Ort.
          </p>
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              change("q", query.trim());
            }}
          >
            <Search size={21} />
            <input
              aria-label="Produkt oder Marke suchen"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Was braucht dein Liebling?"
            />
            <button type="submit">
              Suchen <ArrowRight size={17} />
            </button>
          </form>
          <div className="hero-benefits">
            <span>
              <Check size={15} /> Kostenlos vergleichen
            </span>
            <span>
              <Check size={15} /> Preise auf einen Blick
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=85"
            alt="Golden Retriever im Grünen"
          />
          <div className="photo-note">
            <Heart size={22} />
            <span>
              Weil sie uns
              <br />
              <strong>alles bedeuten.</strong>
            </span>
          </div>
          <span className="photo-tag">Kleine Pfoten, große Liebe.</span>
        </div>
      </section>
      <section className="catalog-section">
        <div className="section-top">
          <div className="eyebrow">FIND DEINEN PFOTENPREIS</div>
          <span>
            Mit Liebe ausgewählt <Heart size={14} />
          </span>
        </div>
        <h2>Für wen suchst du?</h2>
        <div className="animal-tabs" aria-label="Tierart">
          {[
            ["", "Alle Tiere", PawPrint],
            ["Hund", "Hunde", Dog],
            ["Katze", "Katzen", Cat],
            ["Kleintier", "Kleintiere", Rabbit],
          ].map(([value, label, Icon]) => {
            const TabIcon = Icon as typeof PawPrint;
            return (
              <button
                key={String(value)}
                aria-pressed={animal === value}
                className={animal === value ? "selected" : ""}
                onClick={() => change("animal", String(value))}
              >
                <TabIcon size={21} />
                {String(label)}
              </button>
            );
          })}
        </div>
        <div className="catalog-layout">
          <aside>
            <div className="filter-title">
              <h3>
                <SlidersHorizontal size={18} /> Filter
              </h3>
              {active && (
                <button onClick={() => setParams({})}>Zurücksetzen</button>
              )}
            </div>
            <fieldset>
              <legend>Kategorie</legend>
              {[
                "",
                "Trockenfutter",
                "Nassfutter",
                "Heu & Snacks",
                "Zubehör",
              ].map((category) => (
                <label key={category}>
                  <input
                    type="radio"
                    name="category"
                    checked={(params.get("category") ?? "") === category}
                    onChange={() => change("category", category)}
                  />
                  {category || "Alle Kategorien"}
                </label>
              ))}
            </fieldset>
            <div className="tip">
              <Leaf size={25} />
              <h4>Gut vergleichen lohnt sich.</h4>
              <p>
                Achte auf die Packungsgröße und Versandkosten – so findest du
                das passende Angebot.
              </p>
            </div>
            <div className="data-note">
              <ShieldCheck size={16} />
              <span>
                Transparente Beispielpreise.
                <br />
                Keine bezahlte Platzierung.
              </span>
            </div>
          </aside>
          <div className="results">
            <div className="result-toolbar">
              <p>
                <strong>{loading ? "…" : items.length} Produkte</strong>
                <span> für deinen Liebling</span>
              </p>
              <label>
                Sortieren:{" "}
                <select
                  value={params.get("sort") ?? "price-asc"}
                  onChange={(e) => change("sort", e.target.value)}
                  aria-label="Sortierung"
                >
                  <option value="price-asc">Preis aufsteigend</option>
                  <option value="price-desc">Preis absteigend</option>
                  <option value="name">Name A–Z</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            {loading || error ? (
              <Status loading={loading} error={error} retry={retry} />
            ) : items.length === 0 ? (
              <div className="status">
                <Search size={32} />
                <h3>Keine passenden Produkte gefunden</h3>
                <p>
                  Versuche einen anderen Suchbegriff oder entferne deine Filter.
                </p>
                <button onClick={() => setParams({})}>
                  Alle Produkte anzeigen
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {items.map((product) => (
                  <Link
                    to={`/produkte/${product.id}?${params}`}
                    className="product-card"
                    key={product.id}
                  >
                    <div className="card-image">
                      <span className="category-badge">{product.animal}</span>
                      <ProductArt product={product} />
                    </div>
                    <div className="card-body">
                      <div className="brand">{product.brand}</div>
                      <h3>{product.name}</h3>
                      <p className="size">
                        {product.category} <span>·</span> {product.size}
                      </p>
                      <div className="price-row">
                        <div>
                          <span className="from">ab </span>
                          <strong>{money(product.lowestPrice)}</strong>
                          <small>zzgl. Versand</small>
                        </div>
                        <span className="card-arrow">
                          <ArrowRight size={20} />
                        </span>
                      </div>
                      <div className="offer-count">
                        {product.offers.length} Angebote vergleichen
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function Detail() {
  const { id } = useParams();
  const location = useLocation();
  const { items, loading, error, retry } = useCatalog("", id);
  const [selectedShop, setSelectedShop] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedShop("");
  }, [id]);
  const product = items[0];
  return (
    <section className="detail">
      <Link className="back" to={`/${location.search}`}>
        <ArrowLeft size={17} /> Zurück zum Preisvergleich
      </Link>
      {loading || error || !product ? (
        <Status loading={loading} error={error} retry={retry} />
      ) : (
        <>
          <div className="breadcrumb">
            {product.animal} <span>/</span> {product.category} <span>/</span>{" "}
            {product.brand}
          </div>
          <div className="detail-top">
            <div className="detail-art">
              <ProductArt product={product} large />
              <span>Illustrative Produktdarstellung</span>
            </div>
            <div className="detail-copy">
              <div className="eyebrow">{product.brand}</div>
              <h1>{product.name}</h1>
              <p className="detail-subtitle">
                {product.category} für{" "}
                {product.animal === "Katze"
                  ? "Katzen"
                  : product.animal === "Hund"
                    ? "Hunde"
                    : "Kleintiere"}{" "}
                · {product.size}
              </p>
              <p>{product.description}</p>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>
                    <Check size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="detail-price">
                <span>Günstigster Produktpreis</span>
                <strong>{money(product.lowestPrice)}</strong>
                <small>
                  inkl. MwSt., zzgl. Versand · {product.offers.length} Angebote
                </small>
              </div>
              <a className="primary" href="#angebote">
                Alle Angebote vergleichen <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div id="angebote" className="offers-heading">
            <div>
              <div className="eyebrow">EIN PRODUKT. ALLE PREISE.</div>
              <h2>Finde dein Lieblingsangebot.</h2>
            </div>
            <span>Sortiert nach Gesamtpreis inkl. Versand</span>
          </div>
          <div className="offers">
            {[...product.offers]
              .sort((a, b) => a.price + a.shipping - (b.price + b.shipping))
              .map((offer, index) => (
                <div className="offer" key={offer.shop}>
                  <div className="shop">
                    <span className="shop-icon">
                      <PawPrint size={21} />
                    </span>
                    <div>
                      <h3>{offer.shop}</h3>
                      {index === 0 ? (
                        <span className="best">Bester Gesamtpreis</span>
                      ) : (
                        <small>Demo-Händler</small>
                      )}
                    </div>
                  </div>
                  <div className="shipping">
                    <span>
                      <Truck size={16} /> {offer.delivery}
                    </span>
                    <small>
                      {offer.shipping
                        ? `${money(offer.shipping)} Versand`
                        : "Kostenloser Versand"}
                    </small>
                  </div>
                  <div className="offer-price">
                    <strong>{money(offer.price + offer.shipping)}</strong>
                    <small>{money(offer.price)} Produktpreis</small>
                  </div>
                  <button onClick={() => setSelectedShop(offer.shop)}>
                    Angebot ansehen <ArrowRight size={16} />
                  </button>
                </div>
              ))}
          </div>
          {selectedShop && (
            <div className="demo-message" role="status">
              <ShieldCheck size={23} />
              <div>
                <strong>{selectedShop}: ein Beispielangebot</strong>
                <p>
                  Du bist im Demo-Katalog. Dieses Angebot ist fiktiv; ein Kauf
                  oder Shopbesuch ist nicht möglich.
                </p>
              </div>
              <button
                onClick={() => setSelectedShop("")}
                aria-label="Hinweis schließen"
              >
                ×
              </button>
            </div>
          )}
          <p className="offer-disclaimer">
            Alle Angebote sind Beispieldaten in EUR und beziehen sich auf
            dieselbe Packungsgröße. Keine aktuellen Händlerpreise.
          </p>
        </>
      )}
    </section>
  );
}
export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Listing />} />
          <Route path="/produkte/:id" element={<Detail />} />
          <Route
            path="*"
            element={
              <section className="status">
                <h1>Hier ist keine Pfote zu finden.</h1>
                <Link to="/">Zur Ergebnisliste</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
