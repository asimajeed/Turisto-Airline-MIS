type PriceDetails = {
  base_price: number;
  discount_percentage?: number;
  taxes?: number;
  discount_code?: string | null;
};

export class Pricing {
  base_price: number;
  discount_percentage: number;
  taxes: number;
  taxed_ammount: number;
  discount_code: string | null;
  discount_amount: number;
  subtotal: number;
  final_total: number;

  constructor({
    base_price,
    discount_percentage = 0,
    taxes = 0,
    discount_code = null,
  }: PriceDetails) {
    this.base_price = base_price;
    this.discount_percentage = discount_percentage;
    this.taxes = taxes;

    this.discount_code = discount_code;

    // Initialize derived values
    this.discount_amount = (this.base_price * this.discount_percentage) / 100;
    this.subtotal = this.base_price - this.discount_amount;
    this.taxed_ammount = this.subtotal * this.taxes;
    this.final_total = this.subtotal + this.taxed_ammount;
  }

  // Optional method to update fields dynamically
  updatePrices(newTaxes: number, newDiscountPercentage?: number) {
    if (newDiscountPercentage !== undefined) {
      this.discount_percentage = newDiscountPercentage;
      this.discount_amount = (this.base_price * this.discount_percentage) / 100;
      this.subtotal = this.base_price - this.discount_amount;
    }

    this.taxes = newTaxes;
    this.final_total = this.subtotal + this.taxes;
  }
}
