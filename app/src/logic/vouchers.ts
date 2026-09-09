import type { Voucher } from "../types/voucher";
import type { Consumable } from "../types/consumable";
import { shuffle } from "../utils/shuffle";

const VOUCHER_DEFINITIONS: Voucher[] = [
  { id: "voucher-overstock", name: "Overstock", description: "La tienda ofrece un joker extra", price: 6 },
  { id: "voucher-clearance", name: "Clearance Sale", description: "Todos los precios de la tienda −25%", price: 6 },
  { id: "voucher-grabber", name: "Grabber", description: "+1 hueco de consumibles", price: 5 },
  { id: "voucher-wasteful", name: "Wasteful", description: "+1 descarte por ronda", price: 5 },
  { id: "voucher-handy", name: "Handy", description: "+1 mano por ronda", price: 5 },
  { id: "voucher-tarot-merchant", name: "Tarot Merchant", description: "Los tarots cuestan la mitad", price: 4 },
  { id: "voucher-planet-merchant", name: "Planet Merchant", description: "Los planetas cuestan la mitad", price: 4 },
];

const OVERSTOCK = "voucher-overstock";
const CLEARANCE = "voucher-clearance";
const GRABBER = "voucher-grabber";
const WASTEFUL = "voucher-wasteful";
const HANDY = "voucher-handy";
const TAROT_MERCHANT = "voucher-tarot-merchant";
const PLANET_MERCHANT = "voucher-planet-merchant";

export function getShopVouchers(count: number = 1): Voucher[] {
  return shuffle(VOUCHER_DEFINITIONS).slice(0, count).map((i) => ({ ...i }));
}

export function getVoucherById(id: string): Voucher | undefined {
  return VOUCHER_DEFINITIONS.find((i) => i.id === id);
}

export function hasVoucher(vouchers: Voucher[], id: string): boolean {
  return vouchers.some((i) => i.id === id);
}

export function getShopJokerCount(baseCount: number, vouchers: Voucher[]): number {
  return baseCount + (hasVoucher(vouchers, OVERSTOCK) ? 1 : 0);
}

export function getConsumableSlots(baseSlots: number, vouchers: Voucher[]): number {
  return baseSlots + (hasVoucher(vouchers, GRABBER) ? 1 : 0);
}

export function getDiscards(baseDiscards: number, vouchers: Voucher[]): number {
  return baseDiscards + (hasVoucher(vouchers, WASTEFUL) ? 1 : 0);
}

export function getHands(baseHands: number, vouchers: Voucher[]): number {
  return baseHands + (hasVoucher(vouchers, HANDY) ? 1 : 0);
}

export function getJokerPrice(basePrice: number, vouchers: Voucher[]): number {
  const discount = hasVoucher(vouchers, CLEARANCE) ? 0.25 : 0;
  return Math.round(basePrice * (1 - discount));
}

export function getConsumablePrice(
  consumable: Consumable,
  vouchers: Voucher[],
): number {
  const merchantDiscount =
    (consumable.kind === "tarot" && hasVoucher(vouchers, TAROT_MERCHANT)) ||
    (consumable.kind === "planet" && hasVoucher(vouchers, PLANET_MERCHANT))
      ? 0.5
      : 0;
  const clearance = hasVoucher(vouchers, CLEARANCE) ? 0.25 : 0;
  const totalDiscount = 1 - (1 - merchantDiscount) * (1 - clearance);
  return Math.round(consumable.price * (1 - totalDiscount));
}