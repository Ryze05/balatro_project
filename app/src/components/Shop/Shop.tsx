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
  onSpendMoney: (amount: number) => void;
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
const REROLL_BASE_COST = 5;

export function Shop({
  money,
  consumables,
  vouchers,
  maxConsumableSlots,
  onBuy,
  onBuyConsumable,
  onBuyVoucher,
  onSpendMoney,
  onAddConsumable,
  onContinue,
}: ShopProps): JSX.Element {
  const [jokerOffers, setJokerOffers] = useState<Joker[]>(() => getShopJokers(JOKER_OFFER_COUNT));
  //* Las ofertas de Cartas Especiales y Vouchers se generan al entrar a la tienda. Los comodines y consumibles se pueden rerollear; los vouchers no.
  const [consumableOffers, setConsumableOffers] = useState<Consumable[]>(() => getShopConsumables(CONSUMABLE_OFFER_COUNT));
  const [voucherOffers] = useState<Voucher[]>(() => getShopVouchers(VOUCHER_OFFER_COUNT));
  const [openedPack, setOpenedPack] = useState<{
    name: string;
    cards: Consumable[];
  } | null>(null);
  const [soldJokerIds, setSoldJokerIds] = useState<string[]>([]);
  const [soldConsumableIds, setSoldConsumableIds] = useState<string[]>([]);
  const [soldPackIds, setSoldPackIds] = useState<string[]>([]);
  const [rerollCount, setRerollCount] = useState(0);

  const consumablesFull = consumables.length >= maxConsumableSlots;
  const rerollCost = REROLL_BASE_COST + rerollCount;

  const reroll = (): void => {
    if (money < rerollCost) return;
    onSpendMoney(rerollCost);
    setJokerOffers(getShopJokers(JOKER_OFFER_COUNT));
    setConsumableOffers(getShopConsumables(CONSUMABLE_OFFER_COUNT));
    setSoldJokerIds([]);
    setSoldConsumableIds([]);
    setRerollCount((count) => count + 1);
  };

  const buyJoker = (joker: Joker): void => {
    onBuy(joker);
    setSoldJokerIds((prev) => [...prev, joker.id]);
  };

  const buyConsumable = (consumable: Consumable): void => {
    onBuyConsumable(consumable);
    setSoldConsumableIds((prev) => [...prev, consumable.id]);
  };

  //* Comprar un sobre: descuenta el dinero y abre el modal con sus cartas
  const openPack = (pack: PackDefinition): void => {
    onSpendMoney(pack.price);
    setSoldPackIds((prev) => [...prev, pack.id]);
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
        <h2 className={styles.title}>Tienda</h2>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Comodines</h3>
        </div>

        <div className={styles.offers}>
          {jokerOffers.map((joker) => {
            const sold = soldJokerIds.includes(joker.id);
            return (
              <div key={joker.id} className={styles.offerCard}>
                <h3 className={styles.jokerName}>{joker.name}</h3>
                <p className={styles.jokerDescription}>{joker.description}</p>
                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={() => buyJoker(joker)}
                  disabled={sold || money < joker.price}
                >
                  {sold ? "Comprado" : `Comprar $${joker.price}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Cartas Especiales</h3>
        </div>

        <div className={styles.offers}>
          {consumableOffers.map((consumable) => {
            const price = getConsumablePrice(consumable, vouchers);
            const sold = soldConsumableIds.includes(consumable.id);
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
                  disabled={sold || consumablesFull || money < price}
                >
                  {sold ? "Comprado" : consumablesFull ? "Sin hueco" : `Comprar $${price}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Sobres</h3>
        </div>

        <div className={styles.offers}>
          {PACK_DEFINITIONS.map((pack) => {
            const sold = soldPackIds.includes(pack.id);
            return (
              <div key={pack.id} className={styles.offerCard}>
                <span className={styles.rarity} style={{ color: "var(--color-accent)" }}>
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
                  disabled={sold || consumablesFull || money < pack.price}
                >
                  {sold ? "Comprado" : consumablesFull ? "Sin hueco" : `Comprar $${pack.price}`}
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
                  {owned ? "Comprado" : `Comprar $${voucher.price}`}
                </button>
              </div>
            );
          })}
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
