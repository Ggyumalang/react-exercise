// Zustand 적용 전.. 사용했음
import { useCallback, useMemo, useState } from "react";
import type { CartItem, ProductInfo } from "../types/ProductInfo";

export function useCart() {
    // 1. 상태
    const [ cartItems, setCartItems ] = useState<CartItem[]>([]);

    // 2. 최적화 된 함수 (useCallback)
    // 💡 Pro-Tip: setCartItems(prev => ...) 처럼 함수형 업데이트를 사용했기 때문에, 
    const handleClicked = useCallback(( info:ProductInfo ) => {
    
        // 1. 방금 클릭한 상품이 장바구니(cartItems)에 이미 들어있는지 찾습니다.
        // 💡 바깥의 cartItems를 보지 않고, setCartItems 안에서 제공하는 '최신 prevItems'만 바라봅니다!
        setCartItems(prevItems => {    
            const existingItem = prevItems.find(item => item.productName === info.productName);
            console.log('existingItem = ', existingItem);
        
            if(existingItem) {
            //존재 시 수량만 +1 업데이트
            //map 이 뱉어낸 새로운 배열을 바로 setCartItems 에 넣어준다.
            return prevItems.map(item => item.productName === info.productName ? {...item, quantity : item.quantity + 1 } : item);
            } else {
            // 장바구니에 없다면? (처음 담는 상품)
            const cartItem : CartItem = {
                    productName : info.productName,
                    price : info.price,
                    isSoldOut : info.isSoldOut,
                    quantity : 1
            };
            return [...prevItems, cartItem]
            }
        })
      }, [])
    
      // 바깥의 상태를 직접 참조하지 않으므로 의존성 배열은 텅 빈 [] 로 두어도 완벽하게 동작합니다!
      const handleRemove = useCallback(( target:string ) => {
        setCartItems(items => items.filter(item => item.productName !== target));
      }, [])

      const totalPrice = useMemo(() => {
        return cartItems?.reduce(( prev, next ) => prev + (next.price * next.quantity), 0)
      }, [cartItems])

      return {
        cartItems,
        handleClicked,
        handleRemove,
        totalPrice
      }
}