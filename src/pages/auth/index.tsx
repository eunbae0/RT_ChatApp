import React from "react";
import { provider, db } from "../../../firebaseConfig";
import { getAuth, signInWithRedirect, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Auth() {
  const onClickLoginBtn = async () => {
    const auth = getAuth();
    // signInWithRedirect(auth, provider)

    signInWithPopup(auth, provider)
      .then(async (result) => {
        // The signed-in user info.
        console.log(result);
        const { uid, displayName, photoURL } = result.user;
        await setDoc(doc(db, "Users", `${uid}`), {
          uid: `${uid}`,
          userName: `${displayName}`,
          photoURL: `${photoURL}`
        });
      }).catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
      });
}
  return (
    <>
      <div onClick={onClickLoginBtn}>로그인하기</div>
    </>
  )
}

export default Auth;