import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

import SearchIcon from '@mui/icons-material/Search';
import "./main.scss";

import {UserData} from '../../router';

function UserList({data, userInfoData, setIsClickedAddFriendsBtn, property}:{data:UserData; userInfoData: UserData; setIsClickedAddFriendsBtn: React.Dispatch<React.SetStateAction<boolean>>; property: string}): JSX.Element {
  const onClickAddFriendsBtn = async () => {
    if (userInfoData.uid !== data.uid) { // !==기본, 테스트시 ===사용하므로 유의
      try {
        await setDoc(doc(db, "Users", `${userInfoData.uid}`, "Friends", `${data.uid}`), {
          uid: data.uid,
          userName: data.userName,
          photoURL: data.photoURL
        });
        setIsClickedAddFriendsBtn(true); // 친구목록 실시간 업데이트 구현
        alert('추가되었습니다')
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('본인은 친구추가를 할 수 없습니다.')
    }
  };
  const onClickFriendsDeleteBtn = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까? 채팅 내역이 사라지며, 되돌릴 수 없습니다.');
    if (ok) {
      await deleteDoc(doc(db, "Users", `${userInfoData.uid}`, "Friends", `${data.uid}`));
      setIsClickedAddFriendsBtn(true); // 친구목록 실시간 업데이트 구현
      alert('삭제되었습니다.')
    }
  };

  switch (property) {
    case 'findUser':
      return (
        <div className="UserListBox">
          <img className="UserListImg" src={data.photoURL} />
          <div className="UserListName">{data.userName}</div>
          <div className="AddFriendsBtn" onClick={onClickAddFriendsBtn}>친구추가하기</div>
        </div>
      );
    case 'friendsList':
      return (
        <div className="UserListBox">
          <img className="UserListImg" src={data.photoURL} />
          <div className="UserListName">{data.userName}</div>
          <div className="AddFriendsBtn">대화하기</div>
          <div className="AddFriendsBtn" onClick={onClickFriendsDeleteBtn}>삭제하기</div>
        </div>
      );
    default: return(<></>);
  }
}
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