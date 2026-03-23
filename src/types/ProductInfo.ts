
export interface ProductInfo {
    productName : string;
    price : number;
    isSoldOut : boolean;
    isLiked: boolean;
}

export interface CartItem extends Omit<ProductInfo, 'isLiked'>{
    quantity : number;
}