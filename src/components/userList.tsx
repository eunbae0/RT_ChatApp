import React from 'react';
import { db } from "../../firebaseConfig";
import { setDoc, deleteDoc, doc } from "firebase/firestore";
import {UserData} from '../router';

import './components.scss';

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

export default UserList;