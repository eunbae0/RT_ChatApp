import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import SearchIcon from '@mui/icons-material/Search';
import "./main.scss";

interface UserData {
  userName: string;
  photoURL: string;
}

function FindUserResult({data}:{data:UserData}) {
  return (
    <div className="FindUserResultBox">
      <img className="FindUserResultImg" src={data.photoURL} />
      <div className="FindUserResultName">{data.userName}</div>
      <div className="FindUserResultBtn">친구추가하기</div>
    </div>
  );
}

function Main() {
  const onClickLogoutBtn = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      alert('로그아웃 되었습니다.');
    }).catch((error) => {
      console.log(error);
      alert(error);
  });
  }

  const [findUser, setFindUser] = useState<string>('');
  const [userData, setUserData] = useState<Array<UserData>>([]);
  const [isFindUserFinished, setIsFindUserFinished] = useState<boolean>(false);
  const onChangeFindUserInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setFindUser(value);
  }

  const onSubmitFindUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query(collection(db, "Users"), where("userName", "==", findUser));

    const querySnapshot = await getDocs(q);
    setUserData([]); // 초기화시키고 forEach문 동작(중복방지)
    querySnapshot.forEach((doc) => {
      const {userName, photoURL} = doc.data();
      const data: UserData = {userName, photoURL};
      setUserData(arr => arr ? [...arr, data] : [data]);
    });
    setIsFindUserFinished(true);
  }

  return (
    <>
      <div>
        <form onSubmit={onSubmitFindUser}>
        <div className="FindUserInputBox">
          <input className="FindUserInput" value={findUser} onChange={onChangeFindUserInput} type="text" placeholder="유저를 검색하세요"/>
          <button type="submit">
            <SearchIcon className="FindUserInputIcon" />
          </button>
        </div>
        </form>
      </div>
      <div>
        {userData.length || !isFindUserFinished
          ? userData?.map(data => <FindUserResult key={data.photoURL} data={data} />)
          : '해당 유저정보를 찾을수없습니다.'}
      </div>
      <div className="LogoutBtn" onClick={onClickLogoutBtn}>로그아웃하기</div>
    </>
  )
}

export default Main;
