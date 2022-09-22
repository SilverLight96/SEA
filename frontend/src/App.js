import logo from "./logo.svg"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import "./App.css"
import Navbar from "./components/navbar"
import Footer from "./components/footer/Footer"
import MainPage from "./pages/main/Mainpage"
import LoginPage from "./pages/login/LoginPage"
import ExpressionPage from "./pages/expression/ExpressionPage"
import MyPage from "./pages/mypage/MyPage"
import AnimalListPage from "./pages/animalList/AnimalList"
import AnimalList from "./pages/animalList/AnimalList"
import AnimalDetail from "./pages/animalDetail/AnimalDetailPage"
import { CookiesProvider } from 'react-cookie';

function App() {
  let header = (
    <div>
      {/* <Link to="/login">
        <button>로그인</button>
      </Link> */}
      <LoginPage />
    </div>
  )

  return (
    <div className="App">
      <CookiesProvider> 
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={header}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/main/*" element={<MainPage />}></Route>
          <Route path="main/express/*" element={<ExpressionPage />}></Route>
          <Route path="main/mypage/*" element={<MyPage />}></Route>
          <Route path="main/animalList" element={<AnimalList />}></Route>
          <Route path="main/animalDetail" element={<AnimalDetail />}></Route>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
      </CookiesProvider> 
    </div>
  )
}

export default App
