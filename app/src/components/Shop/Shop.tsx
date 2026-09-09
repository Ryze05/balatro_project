import { useState, type JSX } from "react";
import styles from "./Shop.module.css";
import type { Joker } from "../../types/joker";
import type { Consumable } from "../../types/consumable";
import type { Voucher } from "../../types/voucher";
import { getShopJokers } from "../../logic/joker";
import { getShopConsumables, getArcanaPack, getCelestialPack } from "../../logic/consumables";
import { getShopVouchers, getConsumablePrice, hasVoucher } from "../../logic/vouchers";
import PackModal from "../PackModal/PackModal";

interface ShopProps {
  money: number;
  consumables: Consumable[];
  vouchers: Voucher[];
  maxConsumableSlots: number;
  onBuy: (joker: Joker) => void;
  onBuyConsumable: (consumable: Consumable) => void;
  onBuyVoucher: (voucher: Voucher) => void;
  onBuyPack: (price: number) => void;
  onAddConsumable: (consumable: Consumable) => void;
  onContinue: () => void;
}

//* Sobres disponibles en la tienda (Arcana y Celestial)
interface PackDefinition {
  id: string;
  name: string;
  price: number;
  kind: "arcana" | "celestial";
}

const PACK_DEFINITIONS: PackDefinition[] = [
  { id: "pack-arcana", name: "Arcana Pack", price: 4, kind: "arcana" },
  { id: "pack-celestial", name: "Celestial Pack", price: 5, kind: "celestial" },
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
  onBuyPack,
  onAddConsumable,
  onContinue,
}: ShopProps): JSX.Element {
  const [jokerOffers, setJokerOffers] = useState<Joker[]>(() => getShopJokers(JOKER_OFFER_COUNT));
  //* Las ofertas de Cartas Especiales y Vouchers se generan una vez al
  //* entrar a la tienda (mismo patrón que los comodines), no tienen
  //* botón de reroll propio todavía.
  const [consumableOffers] = useState<Consumable[]>(() => getShopConsumables(CONSUMABLE_OFFER_COUNT));
  const [voucherOffers] = useState<Voucher[]>(() => getShopVouchers(VOUCHER_OFFER_COUNT));
  const [openedPack, setOpenedPack] = useState<{
    name: string;
    cards: Consumable[];
  } | null>(null);

  const consumablesFull = consumables.length >= maxConsumableSlots;

  const reroll = (): void => {
    setJokerOffers(getShopJokers(JOKER_OFFER_COUNT));
  };

  //* Comprar un sobre: descuenta el dinero y abre el modal con sus cartas
  const openPack = (pack: PackDefinition): void => {
    onBuyPack(pack.price);
    const cards =
      pack.kind === "arcana" ? getArcanaPack(3) : getCelestialPack(3);
    setOpenedPack({ name: pack.name, cards });
  };

  const pickFromPack = (card: Consumable): void => {
    onAddConsumable(card);
    setOpenedPack(null);
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
        </div>

        <div className={styles.offers}>
          {PACK_DEFINITIONS.map((pack) => (
            <div key={pack.id} className={styles.offerCard}>
              <span className={styles.rarity} style={{ color: "#e3b23c" }}>
                Booster
              </span>
              <h3 className={styles.jokerName}>{pack.name}</h3>
              <p className={styles.jokerDescription}>
                {pack.kind === "arcana"
                  ? "Contiene cartas de tarot. Elige 1."
                  : "Contiene cartas de planeta. Elige 1."}
              </p>
              <button
                type="button"
                className={styles.buyButton}
                onClick={() => openPack(pack)}
                disabled={money < pack.price}
              >
                Buy ${pack.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {openedPack && (
        <PackModal
          packName={openedPack.name}
          cards={openedPack.cards}
          canTake={!consumablesFull}
          onPick={pickFromPack}
          onClose={() => setOpenedPack(null)}
        />
      )}

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
