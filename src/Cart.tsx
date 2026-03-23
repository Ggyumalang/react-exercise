import { useRef, useState } from "react";
import { useCartStore } from "./store/useCartStore";

export default function Cart() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputVal, setInputVal] = useState<string>("");
    const cartItems = useCartStore((state) => state.cartItems);
    const handleRemove = useCartStore((state) => state.handleRemove);
    const totalPrice = useCartStore((state) => state.getTotalPrice);

    if (cartItems.length === 0) {
        return <div style={{ marginBottom: 20 }}>🛒 장바구니가 비었습니다.</div>;
    }

    const handleClick = () => {
        if(inputVal === "") {
            alert("칸이 비어 있습니다.");
            inputRef.current?.focus();
        }
    }

    return (
        <div>
            <p><strong>장바구니에 목록</strong></p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {cartItems.map(item => (
                        <li key={item.productName} style={{ marginBottom: 10 }}>
                            {item.productName} {item.quantity} 개
                            <button onClick={() => handleRemove(item.productName)} style={{ marginLeft: 10 }}>삭제</button>
                        </li>
                    ))}
                </ul>                
            <p><strong> 총 결제 금액 : {totalPrice().toLocaleString()} </strong></p>
            <input type="text" ref={inputRef} value={inputVal} onChange = {(e) => setInputVal(e.target.value)}></input> <button onClick={handleClick}> 쿠폰 적용 </button>
        </div>
      )
}