import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"

const MENU_ITEMS = [
    { title: '메인 대시보드', path:'/', allowedRoles: ['EMPLOYEE', 'DEPT_ADMIN', 'SYS_ADMIN', 'GUEST'] },
    { title: '미니 쇼핑몰', path:'/shop', allowedRoles: ['EMPLOYEE', 'DEPT_ADMIN', 'SYS_ADMIN', 'GUEST'] },
    { title: 'AI 채팅', path:'/chat', allowedRoles: ['EMPLOYEE', 'DEPT_ADMIN', 'SYS_ADMIN'] },
    { title: '부서 지식 관리', path:'/kms', allowedRoles: ['DEPT_ADMIN', 'SYS_ADMIN'] },
    { title: '시스템 설정', path:'/admin', allowedRoles: ['SYS_ADMIN'] },
]

export function Layout({ children } : {children: React.ReactNode}) {
    //
    const { role, setRole } = useAuthStore();
    
    return (
        <div className="flex h-screen bg-gray-100">
            {/* 사이드바 영역 */}
            <aside className="w-100 bg-white shadow-md p-4">
                <h1 className="text-xl font-bold mb-8">NH AI 포털</h1>
                <nav className="flex flex-col gap-2">
                    {/* TODO: MENU_ITEMS를 filter와 map을 이용해 현재 권한(role)이 
                              allowedRoles에 포함된 메뉴만 렌더링하세요! */}
                    {
                        MENU_ITEMS
                            .filter(item => item.allowedRoles.includes(role))
                            .map(item => (
                                <Link key={item.title} to={item.path}>
                                    <div className="p-3 mb-1 rounded-lg hover:bg-gray-200 font-medium text-gray-700">
                                        {item.title}
                                    </div>
                                </Link>
                            ))
                    }
                </nav>
                
                {/* 테스트용 권한 변경 버튼들 (클릭 시 Zustand의 setRole 호출) */}
                <div className="mt-auto border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">권한 변경 버튼</p>
                    <button onClick={() => setRole("EMPLOYEE")}>EMPLOYEE</button>
                    <button onClick={() => setRole("DEPT_ADMIN")}>DEPT_ADMIN</button>
                    <button onClick={() => setRole("SYS_ADMIN")}>SYS_ADMIN</button>
                    <button onClick={() => setRole("GUEST")}>GUEST</button>
                </div>
            </aside>

            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}