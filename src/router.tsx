import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Main from "./pages/main";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLisLoading] = useState(true);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(user);
        setIsLogin(true);
        setIsLisLoading(false);
      } else {
        // User is signed out
        // ...

        // alert('유저 정보를 찾을 수 없습니다.');
        setIsLogin(false);
        setIsLisLoading(false);
      }
    });
  }, []);

  return (
    <BrowserRouter>
        {isLoading ? 'loading...' : isLogin ? <Main /> : <Auth />}
    </BrowserRouter>
  );
};

export default Router;