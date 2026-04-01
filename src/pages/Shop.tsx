import { ProductCard } from '../ProductCard'
import type { ProductInfo } from '../types/ProductInfo'
import Cart from '../Cart'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { supabase } from '../lib/supabase'

// const infos:ProductInfo [] = [{
//   productName : '기계식 키보드',
//   price : 150000,
//   isSoldOut : false,
//   isLiked : false,
// }, {
//   productName : '무선 마우스',
//   price : 85000,
//   isSoldOut : true,
//   isLiked : false,
// }, {
//   productName : '모니터',
//   price : 10000,
//   isSoldOut : false,
//   isLiked : false,
// }]

const fetchProducts = async() : Promise<ProductInfo[]> => {
  const { data, error } = await supabase.from('products').select('*');

  if( error ) {
    throw new Error(error.message);
  }

  return data as ProductInfo[];
}

export function Shop() {
  // useQuery 적용 전
  // const [ products, setProducts ] = useState<ProductInfo[]>([]);
  // const [ isLoading, setIsLoading ] = useState<boolean>(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setProducts(() => [...infos]);
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [])

  const [searchTerm, setSearchTerm] = useState('');
  const debounceSearchTerm = useDebounce(searchTerm, 500); // (0.5 초 지연)

  const { data: products , isLoading } = useQuery({
    queryKey : ['products'], // 이 데이터의 고유 이름표 (캐싱에 사용)
    queryFn : fetchProducts // 데이터를 가져올 함수
  })

  // 💡 Early Return 패턴: 로딩 중일 땐 아래 코드를 아예 읽지 않고 화면을 그립니다.
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 50 }}>상품을 꼼꼼하게 진열하는 중입니다...</div>;
  }

  return (    
    <div>
      <Cart>
      </Cart>
      <input type='text' onChange={(e) => setSearchTerm(e.target.value)} placeholder='상품 검색...'/>
      {products?.filter(product => product.productName.includes(debounceSearchTerm)).map(product => (
        <div key = {product.productName} style = {{marginBottom : 30}}>
          <ProductCard 
            {...product}>
          </ProductCard>
        </div>
      ))}                 
    </div>
  )
}
