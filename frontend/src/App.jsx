import React from "react";
import Navbar from "./components/Navbar";
import {Route, Routes} from 'react-router-dom'
import Blog from "./pages/Blog";
import Home from "./pages/Home";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/blog" element={<Blog/>}/>

      </Routes>
    </div>
  );
}

export default App;
