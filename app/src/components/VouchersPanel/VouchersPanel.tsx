import type { JSX } from "react";
import styles from "./VouchersPanel.module.css";
import type { Voucher } from "../../types/voucher";

interface VouchersPanelProps {
  vouchers: Voucher[];
  onClose: () => void;
}

//* Panel lateral de solo lectura: pinta lo que ya hay en gameState.vouchers
//* (rellenado por buyVoucher en useGameState). No añade lógica nueva, solo
//* la conexión para poder verlos.
export function VouchersPanel({ vouchers, onClose }: VouchersPanelProps): JSX.Element {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Vouchers</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar vouchers"
          >
            ×
          </button>
        </div>

        <div className={styles.scrollArea}>
          {vouchers.length === 0 ? (
            <p className={styles.emptyText}>Todavía no has comprado ningún voucher.</p>
          ) : (
            <ul className={styles.voucherList}>
              {vouchers.map((voucher) => (
                <li key={voucher.id} className={styles.voucherItem}>
                  <span className={styles.voucherName}>{voucher.name}</span>
                  <p className={styles.voucherDescription}>{voucher.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default VouchersPanel;
