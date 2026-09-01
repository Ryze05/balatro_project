import { useState, type JSX } from "react";
import styles from "./Shop.module.css";
import type { Joker } from "../../types/joker";
import { getShopJokers } from "../../logic/joker";

interface ShopProps {
  money: number;
  onBuy: (joker: Joker) => void;
  onContinue: () => void;
}

export function Shop({ money, onBuy, onContinue }: ShopProps): JSX.Element {
  const [offers, setOffers] = useState<Joker[]>(() => getShopJokers(3));

  const reroll = (): void => {
    setOffers(getShopJokers(3));
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shop</h2>
        <span className={styles.money}>${money}</span>
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

      <div className={styles.actions}>
        <button type="button" className={styles.rerollButton} onClick={reroll}>
          Reroll
        </button>
        <button type="button" className={styles.continueButton} onClick={onContinue}>
          Next Round
        </button>
      </div>
    </div>
  );
}

export default Shop;