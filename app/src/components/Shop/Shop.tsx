import { useState, type JSX } from "react";
import styles from "./Shop.module.css";
import type { Joker } from "../../types/joker";
import { getShopJokers } from "../../logic/joker";

interface ShopProps {
  money: number;
  onBuy: (joker: Joker) => void;
  onContinue: () => void;
}

//* Slots de las secciones que todavía no tienen lógica propia.
//* Cuando se implemente Tarot/Planeta/Espectral, Sobres y Vouchers,
//* estos arrays se sustituyen por datos reales (ver logic/joker.ts
//* como referencia de cómo se generan las ofertas de Comodines).
interface PlaceholderSlot {
  id: string;
  glyph: string;
  title: string;
  subtitle: string;
}

const SPECIAL_CARD_SLOTS: PlaceholderSlot[] = [
  { id: "special-1", glyph: "🔮", title: "Carta Especial", subtitle: "Tarot / Planeta" },
  { id: "special-2", glyph: "🔮", title: "Carta Especial", subtitle: "Espectral" },
];

const PACK_SLOTS: PlaceholderSlot[] = [
  { id: "pack-1", glyph: "🎁", title: "Sobre", subtitle: "Booster Pack" },
  { id: "pack-2", glyph: "🎁", title: "Sobre", subtitle: "Booster Pack" },
];

const VOUCHER_SLOTS: PlaceholderSlot[] = [
  { id: "voucher-1", glyph: "🏷️", title: "Voucher", subtitle: "Mejora permanente" },
];

export function Shop({ money, onBuy, onContinue }: ShopProps): JSX.Element {
  const [offers, setOffers] = useState<Joker[]>(() => getShopJokers(3));

  const reroll = (): void => {
    setOffers(getShopJokers(3));
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shop</h2>
      </div>

      {/* ---------------- Comodines (única sección funcional) ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Comodines</h3>
        </div>

        <div className={styles.offers}>
          {offers.map((joker) => (
            <div key={joker.id} className={styles.offerCard}>
              <h3 className={styles.jokerName}>{joker.name}</h3>
              <p className={styles.jokerDescription}>{joker.description}</p>
              <button
                type="button"
                className={styles.buyButton}
                onClick={() => onBuy(joker)}
                disabled={money < joker.price}
              >
                Buy ${joker.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Cartas Especiales (Tarot / Planeta / Espectral) ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Cartas Especiales</h3>
          <span className={styles.sectionBadge}>Próximamente</span>
        </div>

        <div className={styles.placeholderRow}>
          {SPECIAL_CARD_SLOTS.map((slot) => (
            <div key={slot.id} className={styles.placeholderCard}>
              <span className={styles.placeholderGlyph} aria-hidden="true">
                {slot.glyph}
              </span>
              <span className={styles.placeholderTitle}>{slot.title}</span>
              <span className={styles.placeholderSubtitle}>{slot.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Sobres (Booster Packs) ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Sobres</h3>
          <span className={styles.sectionBadge}>Próximamente</span>
        </div>

        <div className={styles.placeholderRow}>
          {PACK_SLOTS.map((slot) => (
            <div key={slot.id} className={styles.placeholderCard}>
              <span className={styles.placeholderGlyph} aria-hidden="true">
                {slot.glyph}
              </span>
              <span className={styles.placeholderTitle}>{slot.title}</span>
              <span className={styles.placeholderSubtitle}>{slot.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Vouchers ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Vouchers</h3>
          <span className={styles.sectionBadge}>Próximamente</span>
        </div>

        <div className={styles.placeholderRow}>
          {VOUCHER_SLOTS.map((slot) => (
            <div key={slot.id} className={styles.placeholderCard}>
              <span className={styles.placeholderGlyph} aria-hidden="true">
                {slot.glyph}
              </span>
              <span className={styles.placeholderTitle}>{slot.title}</span>
              <span className={styles.placeholderSubtitle}>{slot.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.rerollButton} onClick={reroll}>
          Reroll Comodines
        </button>
        <button type="button" className={styles.continueButton} onClick={onContinue}>
          Next Round
        </button>
      </div>
    </div>
  );
}

export default Shop;
