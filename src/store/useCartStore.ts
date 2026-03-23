import { create } from "zustand";
import type { CartItem, ProductInfo } from "../types/ProductInfo";

// 1. 창고에 어떤 데이터와 함수들이 들어갈지 타입(Interface)을 먼저 정의합니다.
interface CartStore {
    cartItems : CartItem[];
    handleClicked : (info : ProductInfo) => void;
    handleRemove : (target : string) => void;
    getTotalPrice : () => number; // 총액을 계산해주는 함수 타입 추가
}

// 2. 창고(Store) 생성!
export const useCartStore = create<CartStore>((set, get) => ({
    //초기 상태
    cartItems : [],

    // 상태를 변경하는 함수 1 (장바구니 담기)
    handleClicked : (info:ProductInfo) => set((state) => {

        // Zustand의 set 함수는 객체를 반환해야 합니다! return { cartItems: 새로운배열 };
        const existingItem = state.cartItems.find(item => item.productName === info.productName);
        if(existingItem) {
            return {
                cartItems: state.cartItems.map(item => item.productName === info.productName ? {...item, quantity : item.quantity + 1} : item )            
            }
        } else {
            const newCartItem = {
                productName : info.productName,
                price : info.price,
                isSoldOut : info.isSoldOut,
                isLiked : false,
                quantity : 1
            };
            return {
                cartItems : [...state.cartItems, newCartItem]
            }
        }
    }),
    // 상태를 변경하는 함수 2 (장바구니 삭제)
    handleRemove : (target:string) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.productName !== target)
    })),

    getTotalPrice : () => {
        const items = get().cartItems;
        return items.reduce((prev, next) => prev + (next.price * next.quantity), 0)
    }
}))