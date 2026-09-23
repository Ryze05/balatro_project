import { useState, type JSX } from "react";
import styles from "./Shop.module.css";
import type { Joker } from "../../types/joker";
import type { Consumable } from "../../types/consumable";
import type { Voucher } from "../../types/voucher";
import type { ShopOffers } from "../../types/game";
import { getArcanaPack, getCelestialPack, getSpectralPack } from "../../logic/consumables";
import { getConsumablePrice, getJokerPrice, hasVoucher } from "../../logic/vouchers";
import PackModal from "../PackModal/PackModal";

interface ShopProps {
  money: number;
  consumables: Consumable[];
  vouchers: Voucher[];
  maxConsumableSlots: number;
  shopOffers: ShopOffers;
  onBuy: (joker: Joker) => void;
  onBuyConsumable: (consumable: Consumable) => void;
  onBuyVoucher: (voucher: Voucher) => void;
  onSpendMoney: (amount: number) => void;
  onAddConsumable: (consumable: Consumable) => void;
  onReroll: (cost: number) => void;
  onContinue: () => void;
}

//* Sobres disponibles en la tienda (Arcana, Celestial y Spectral)
interface PackDefinition {
  id: string;
  name: string;
  price: number;
  kind: "arcana" | "celestial" | "spectral";
}

const PACK_DEFINITIONS: PackDefinition[] = [
  { id: "pack-arcana", name: "Arcana Pack", price: 4, kind: "arcana" },
  { id: "pack-celestial", name: "Celestial Pack", price: 5, kind: "celestial" },
  { id: "pack-spectral", name: "Spectral Pack", price: 6, kind: "spectral" },
];

const REROLL_BASE_COST = 5;

function EmptyOfferSlot(): JSX.Element {
  return (
    <div className={styles.emptyOfferSlot}>
      <span>Agotado</span>
    </div>
  );
}

function getPackDescription(kind: PackDefinition["kind"]): string {
  if (kind === "arcana") return "Contiene cartas de tarot. Elige 1.";
  if (kind === "celestial") return "Contiene cartas de planeta. Elige 1.";
  return "Contiene cartas espectrales. Elige 1.";
}

function getPackCards(kind: PackDefinition["kind"]): Consumable[] {
  if (kind === "arcana") return getArcanaPack(3);
  if (kind === "celestial") return getCelestialPack(3);
  return getSpectralPack(2);
}

export function Shop({
  money,
  consumables,
  vouchers,
  maxConsumableSlots,
  shopOffers,
  onBuy,
  onBuyConsumable,
  onBuyVoucher,
  onSpendMoney,
  onAddConsumable,
  onReroll,
  onContinue,
}: ShopProps): JSX.Element {
  const [openedPack, setOpenedPack] = useState<{
    name: string;
    cards: Consumable[];
  } | null>(null);
  const [soldPackIds, setSoldPackIds] = useState<string[]>([]);

  const consumablesFull = consumables.length >= maxConsumableSlots;
  const rerollCost = REROLL_BASE_COST + shopOffers.rerollCount;

  const reroll = (): void => {
    if (money < rerollCost) return;
    onReroll(rerollCost);
  };

  const buyJoker = (joker: Joker): void => {
    onBuy(joker);
  };

  const buyConsumable = (consumable: Consumable): void => {
    onBuyConsumable(consumable);
  };

  //* Comprar un sobre: descuenta el dinero y abre el modal con sus cartas
  const openPack = (pack: PackDefinition): void => {
    onSpendMoney(getJokerPrice(pack.price, vouchers));
    setSoldPackIds((prev) => [...prev, pack.id]);
    setOpenedPack({ name: pack.name, cards: getPackCards(pack.kind) });
  };

  const pickFromPack = (card: Consumable): void => {
    onAddConsumable(card);
    setOpenedPack(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tienda</h2>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Comodines</h3>
        </div>

        <div className={styles.offers}>
          {shopOffers.jokers.map((joker) => {
            const price = getJokerPrice(joker.price, vouchers);
            return (
              <div key={joker.id} className={styles.offerCard}>
                <h3 className={styles.jokerName}>{joker.name}</h3>
                <p className={styles.jokerDescription}>{joker.description}</p>
                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={() => buyJoker(joker)}
                  disabled={money < price}
                >
                  Comprar ${price}
                </button>
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, 3 - shopOffers.jokers.length) }).map((_, index) => (
            <EmptyOfferSlot key={`empty-joker-${index}`} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Cartas Especiales</h3>
        </div>

        <div className={styles.offers}>
          {shopOffers.consumables.map((consumable) => {
            const price = getConsumablePrice(consumable, vouchers);
            return (
              <div key={consumable.id} className={styles.offerCard}>
                <span
                  className={styles.rarity}
                  style={{ color: consumable.kind === "tarot" ? "var(--color-danger)" : "var(--color-info)" }}
                >
                  {consumable.kind === "tarot" ? "Tarot" : "Planeta"}
                </span>
                <h3 className={styles.jokerName}>{consumable.name}</h3>
                <p className={styles.jokerDescription}>{consumable.description}</p>
                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={() => buyConsumable(consumable)}
                  disabled={consumablesFull || money < price}
                >
                  {consumablesFull ? "Sin hueco" : `Comprar $${price}`}
                </button>
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, 2 - shopOffers.consumables.length) }).map((_, index) => (
            <EmptyOfferSlot key={`empty-consumable-${index}`} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Sobres</h3>
        </div>

        <div className={styles.offers}>
          {PACK_DEFINITIONS.map((pack) => {
            const sold = soldPackIds.includes(pack.id);
            const price = getJokerPrice(pack.price, vouchers);
            return (
              <div key={pack.id} className={styles.offerCard}>
                <span className={styles.rarity} style={{ color: "var(--color-accent)" }}>
                  Booster
                </span>
                <h3 className={styles.jokerName}>{pack.name}</h3>
                <p className={styles.jokerDescription}>{getPackDescription(pack.kind)}</p>
                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={() => openPack(pack)}
                  disabled={sold || consumablesFull || money < price}
                >
                  {sold ? "Comprado" : consumablesFull ? "Sin hueco" : `Comprar $${price}`}
                </button>
              </div>
            );
          })}
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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Vouchers</h3>
        </div>

        <div className={styles.offers}>
          {shopOffers.vouchers.map((voucher) => {
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
                  {owned ? "Comprado" : `Comprar $${voucher.price}`}
                </button>
              </div>
            );
          })}
          {Array.from({ length: Math.max(0, 1 - shopOffers.vouchers.length) }).map((_, index) => (
            <EmptyOfferSlot key={`empty-voucher-${index}`} />
          ))}
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.rerollButton}
          onClick={reroll}
          disabled={money < rerollCost}
        >
          Reroll (${rerollCost})
        </button>
        <button type="button" className={styles.continueButton} onClick={onContinue}>
          Siguiente ronda
        </button>
      </div>
    </div>
  );
}

export default Shop;
