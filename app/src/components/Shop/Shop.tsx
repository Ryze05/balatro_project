import { useState, type JSX } from "react";
import styles from "./Shop.module.css";
import type { Joker } from "../../types/joker";
import type { Consumable } from "../../types/consumable";
import type { Voucher } from "../../types/voucher";
import { getShopJokers } from "../../logic/joker";
import { getShopConsumables } from "../../logic/consumables";
import { getShopVouchers, getConsumablePrice, hasVoucher } from "../../logic/vouchers";

interface ShopProps {
  money: number;
  consumables: Consumable[];
  vouchers: Voucher[];
  maxConsumableSlots: number;
  onBuy: (joker: Joker) => void;
  onBuyConsumable: (consumable: Consumable) => void;
  onBuyVoucher: (voucher: Voucher) => void;
  onContinue: () => void;
}

//* Slots de la sección de Sobres, que todavía no tiene lógica propia
//* (no hay flujo de "comprar sobre -> abrir -> elegir carta" en el
//* contexto). Se queda como placeholder hasta que se implemente.
interface PlaceholderSlot {
  id: string;
  glyph: string;
  title: string;
  subtitle: string;
}

const PACK_SLOTS: PlaceholderSlot[] = [
  { id: "pack-1", glyph: "🎁", title: "Sobre", subtitle: "Booster Pack" },
  { id: "pack-2", glyph: "🎁", title: "Sobre", subtitle: "Booster Pack" },
];

const JOKER_OFFER_COUNT = 3;
const CONSUMABLE_OFFER_COUNT = 2;
const VOUCHER_OFFER_COUNT = 1;

export function Shop({
  money,
  consumables,
  vouchers,
  maxConsumableSlots,
  onBuy,
  onBuyConsumable,
  onBuyVoucher,
  onContinue,
}: ShopProps): JSX.Element {
  const [jokerOffers, setJokerOffers] = useState<Joker[]>(() => getShopJokers(JOKER_OFFER_COUNT));
  //* Las ofertas de Cartas Especiales y Vouchers se generan una vez al
  //* entrar a la tienda (mismo patrón que los comodines), no tienen
  //* botón de reroll propio todavía.
  const [consumableOffers] = useState<Consumable[]>(() => getShopConsumables(CONSUMABLE_OFFER_COUNT));
  const [voucherOffers] = useState<Voucher[]>(() => getShopVouchers(VOUCHER_OFFER_COUNT));

  const consumablesFull = consumables.length >= maxConsumableSlots;

  const reroll = (): void => {
    setJokerOffers(getShopJokers(JOKER_OFFER_COUNT));
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shop</h2>
      </div>

      {/* ---------------- Comodines ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Comodines</h3>
        </div>

        <div className={styles.offers}>
          {jokerOffers.map((joker) => (
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

      {/* ---------------- Cartas Especiales (Tarot / Planeta) ---------------- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Cartas Especiales</h3>
        </div>

        <div className={styles.offers}>
          {consumableOffers.map((consumable) => {
            const price = getConsumablePrice(consumable, vouchers);
            return (
              <div key={consumable.id} className={styles.offerCard}>
                <span
                  className={styles.rarity}
                  style={{ color: consumable.kind === "tarot" ? "#c1121f" : "#4c8fd1" }}
                >
                  {consumable.kind === "tarot" ? "Tarot" : "Planeta"}
                </span>
                <h3 className={styles.jokerName}>{consumable.name}</h3>
                <p className={styles.jokerDescription}>{consumable.description}</p>
                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={() => onBuyConsumable(consumable)}
                  disabled={consumablesFull || money < price}
                >
                  {consumablesFull ? "Sin hueco" : `Buy $${price}`}
                </button>
              </div>
            );
          })}
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
        </div>

        <div className={styles.offers}>
          {voucherOffers.map((voucher) => {
            const owned = hasVoucher(vouchers, voucher.id);
            return (
              <div key={voucher.id} className={styles.offerCard}>
                <h3 className={styles.jokerName}>{voucher.name}</h3>
                <p className={styles.jokerDescription}>{voucher.description}</p>
                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={() => onBuyVoucher(voucher)}
                  disabled={owned || money < voucher.price}
                >
                  {owned ? "Comprado" : `Buy $${voucher.price}`}
                </button>
              </div>
            );
          })}
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
