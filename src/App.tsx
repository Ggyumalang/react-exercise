import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Shop } from "./pages/Shop";
import { Admin } from "./pages/Admin";
import { Kms } from "./pages/Kms";
import { Chat } from "./pages/Chat";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path = "/" element={<Dashboard />}></Route>
          <Route path = "/shop" element={<Shop />}></Route>
          <Route path = "/chat" element={<Chat />}></Route>
          <Route path = "/kms" element={<Kms />}></Route>
          <Route path = "/admin" element={<Admin />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}