import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

import SearchIcon from '@mui/icons-material/Search';
import "./main.scss";

import {UserData} from '../../router';
import UserList from '../../components/userList';

function Main({userInfoData}: {userInfoData: UserData}) {
  const [findUser, setFindUser] = useState<string>('');
  const [userData, setUserData] = useState<Array<UserData>>([]);
  const [isFindUserFinished, setIsFindUserFinished] = useState<boolean>(false);

  // 유저검색
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
      const {userName, photoURL, uid} = doc.data();
      const data: UserData = {uid, userName, photoURL};
      setUserData(arr => arr ? [...arr, data] : [data]);
    });
    setIsFindUserFinished(true);
  }

  // 로그아웃
  const onClickLogoutBtn = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      alert('로그아웃 되었습니다.');
    }).catch((error) => {
      console.log(error);
      alert(error);
  });
  }

  // 친구목록 불러오기
  const [friendsList, setFriendsList] = useState<Array<UserData>>([]);
  const [isClickedAddFriendsBtn, setIsClickedAddFriendsBtn] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      const q = query(collection(db, "Users", `${userInfoData.uid}`, "Friends"));
      const querySnapshot = await getDocs(q);
      setFriendsList([]); // 초기화시키고 forEach문 동작(중복방지)
      querySnapshot.forEach((doc) => {
        const {userName, photoURL, uid} = doc.data();
        const data: UserData = {uid, userName, photoURL};
        setFriendsList(arr => arr ? [...arr, data] : [data]);
      });
    }
    getFriends();
    setIsClickedAddFriendsBtn(false); // 값 초기화
  }, [isClickedAddFriendsBtn]);

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
          ? userData.map(data => <UserList key={data.uid} data={data} userInfoData={userInfoData} setIsClickedAddFriendsBtn={setIsClickedAddFriendsBtn} property={'findUser'} />)
          : '해당 유저정보를 찾을수없습니다.'}
      </div>
      <div> 
          {friendsList.map(data => <UserList key={data.uid} data={data} userInfoData={userInfoData} setIsClickedAddFriendsBtn={setIsClickedAddFriendsBtn} property={'friendsList'} />)}
      </div>
      <div className="LogoutBtn" onClick={onClickLogoutBtn}>로그아웃하기</div>
    </>
  )
}

export default Main;

// 친구 삭제하기 기능
// 스켈레톤 ui
// 전체 디자인 구조짜기
// 리액트18