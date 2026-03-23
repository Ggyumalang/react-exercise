import { useEffect, useState } from "react";

// value: 우리가 지연시키고 싶은 값 (검색어)
// delay: 기다릴 시간 (밀리초, 예: 500ms)
export function useDebounce<T>(value: T, delay: number) : T {
    // 지연된 값을 담을 상태
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // delay 시간이 지나면 debouncedValue 를 현재 value 로 업데이트하는 타이머
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);

        // delay 시간이 끝나기 전에 value 가 또 바귀면 기존 타이머 취소
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay]);

    return debouncedValue
}