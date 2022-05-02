import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Main from "./pages/main";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface UserData {
  uid: string;
  userName?: string;
  photoURL?: string;
}

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLisLoading] = useState(true);

  const [userInfoData, setUserInfoData] = useState<UserData>({uid: ''});

// layouteffect로?
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const { uid } = user;
        const userObj = {uid};
        setUserInfoData(userObj);
        console.log(user); //console.log
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
        {isLoading ? 'loading...' : isLogin ? <Main userInfoData={userInfoData} /> : <Auth />}
    </BrowserRouter>
  );
};

export default Router;