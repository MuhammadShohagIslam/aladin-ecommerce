type DiscountType = "Fixed" | "Percentage";

export interface ICoupon {
    _id: string;
    code: string;
    uses: number;
    discountAmount: number;
    isActive: boolean;
    discountType: DiscountType;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}