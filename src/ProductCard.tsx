import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "./store/useCartStore";
import type { ProductInfo } from "./types/ProductInfo";
import { supabase } from "./lib/supabase";

const toggleLikeAPI = async({productName, isLiked} : {productName:string, isLiked:boolean}) : Promise<String> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // 20% 확률로 서버 에러 발생 가정 (롤백 테스트용)
//       if(Math.random() < 0.2) {
//         reject(new Error(`서버 폭주로 인해 찜하기 실패... ${productName}`));
//       } else {
//         resolve("성공")
//       }
//     }, 1000)
//   })
    const { error } = await supabase.from('products').update({isLiked : !isLiked}).eq('productName', productName);
    if(error) {
        throw new Error(`좋아요 버튼 누르기 실패 ... ${productName} ${error.message}`)      
    }

    return '성공';
}

export function ProductCard({ productName, price, isSoldOut, isLiked } : ProductInfo){
    const handleClicked = useCartStore((state) => state.handleClicked);

    const queryClient = useQueryClient();

    const { mutate : toggleLike } = useMutation({
        mutationFn : toggleLikeAPI, // 1. 실행할 API 함수

        // 2. onMutate : API 요청이 출발하기 '직전'에 실행됨 (이 부분이 낙관적 업데이트의 핵심!)
        onMutate : async ({ productName }) => {
            // A. 기존에 찜하기를 가져오고 있던 요청이 있다면 취소 ( 충돌 방지 )
            await queryClient.cancelQueries({ queryKey : ['products']});

            // B. 에러가 났을 때 돌아갈 '과거의 데이터'를 백업 
            const previousProducts = queryClient.getQueryData(['products']);

            // C. 캐시 데이터를 강제로 내가 원하는 대로 바꿈 (일단 UI 부터 변경한다.)
            // 💡 TS 디테일: old가 캐시에 아직 없을 수도 있으므로 (old: ProductInfo[] | undefined) 로 처리하면 더 안전합니다!
            queryClient.setQueryData(['products'], (old: ProductInfo[] | undefined ) => {
                if(!old) return [];
                return old.map(item => item.productName === productName ? { ...item, isLiked : !item.isLiked } : item)
            })

            // D. 백업해 둔 과거 데이터 리턴 (이 값은 onError 에 전달된다.)
            return previousProducts
        },

        // 3. onError: 서버 통신 실패 시 실행 (롤백)
        onError : (err, variables, context) => {
            alert(`앗! ${variables.productName} 찜하기에 실패했습니다... ${err.message}`);

            // 💡 1. 타입스크립트에게 context의 생김새를 정확히 알려줍니다.
            const rollbackContext = context as { previousProducts : ProductInfo[] | undefined};
            if(rollbackContext?.previousProducts) {
                queryClient.setQueryData(['products'], rollbackContext.previousProducts)
            }
        },

        // 4. onSettled : 성공하든 실패하든 마지막에 무조건 실행됨 (java의 finally)
        onSettled : () => {
            queryClient.invalidateQueries({queryKey : ['products']})
        }
    });

    return (
        // 전체를 감싸는 예쁜 카드 UI
        <div className="p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="text-lg font-bold">
                {/* 조건부 Tailwind 클래스 적용 */}
                <span className={isSoldOut ? "text-red-500 mr-2" : ""}>
                    {isSoldOut ? '[품절]' : ''}
                </span>
                {productName}
                {/* 💡 찜하기 버튼 추가! */}
                <button 
                    onClick={() => toggleLike({productName, isLiked})}
                    className="text-2xl hover:scale-110 transition-transform"
                >
                    {isLiked ? '❤️' : '🤍'}
                </button>
            </div>
            <div className="text-gray-600">
                {price.toLocaleString()} 원
            </div>
            <button 
                // onClick={handleClicked} 
                onClick={() => handleClicked({ productName, price, isSoldOut, isLiked })}
                disabled={isSoldOut}
                // Tailwind로 버튼 디자인 (품절일 때와 아닐 때 색상 다르게!)
                className={`py-2 px-4 rounded-lg font-semibold text-black transition-colors ${
                    isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isSoldOut ? '품절된 상품' : '장바구니에 담기'}
            </button>
        </div>
    )
}