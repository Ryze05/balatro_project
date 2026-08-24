import type { JSX } from "react";
import styles from "./Shop.module.css";

interface ShopProps {
  onContinue: () => void;
}

// Placeholder offers just to lay out the panel.
// Real jokers, prices and buy logic come later.
const PLACEHOLDER_OFFERS = [
  { id: "1", name: "Joker", description: "+4 Mult", price: 3 },
  { id: "2", name: "Greedy Joker", description: "Diamond cards give +30 Chips", price: 4 },
  { id: "3", name: "Jolly Joker", description: "+8 Mult if hand has a Pair", price: 4 },
];

export function Shop({ onContinue }: ShopProps): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shop</h2>
      </div>

      <div className={styles.offers}>
        {PLACEHOLDER_OFFERS.map((joker) => (
          <div key={joker.id} className={styles.offerCard}>
            <h3 className={styles.jokerName}>{joker.name}</h3>
            <p className={styles.jokerDescription}>{joker.description}</p>
            <button type="button" className={styles.buyButton} disabled>
              Buy ${joker.price}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.rerollButton} disabled>
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
