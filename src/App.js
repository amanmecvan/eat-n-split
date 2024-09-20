import { Children, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}
export default function App() {
  const [newFriendList, isNewFriend] = useState(initialFriends);
  const [AddFriendForm, onAddFriendForm] = useState(false);
  const [selectedFriend, isSelectedFriend] = useState(null);

  function AddFrdForm() {
    onAddFriendForm((show) => !show)
  }
  function handleSelectButton(friend) {
    isSelectedFriend((curr) => curr?.id === friend.id ? null : friend);
    onAddFriendForm(false);
  }
  function HandleFriendBalance(value) {
    isNewFriend((newFriendList) => newFriendList.map((friend) => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))

  }
  function handleFriendListUpdate(newFriend) {
    isNewFriend(newFriendList => [...newFriendList, newFriend])
  }
  return <div className="app">
    <div className="sidebar">
      <FriendsList newFriendList={newFriendList} onSelectButton={handleSelectButton} selectedFriend={selectedFriend} />
      {AddFriendForm && <AddFriend onFriendListUpdate={handleFriendListUpdate} />}
      <Button onClick={AddFrdForm}>{AddFriendForm ? 'Close' : 'Add Friend'}</Button>
    </div>
    {selectedFriend && <SplitBill selectedFriend={selectedFriend} onHandleFriendBalance={HandleFriendBalance} />}
  </div>;
}

function FriendsList({ newFriendList, onSelectButton, selectedFriend }) {
  return <ul>
    {newFriendList.map((friend) => <Friend onSelectButton={onSelectButton} key={friend.id} friend={friend} selectedFriend={selectedFriend} />)}
  </ul>;
}

function Friend({ friend, onSelectButton, selectedFriend }) {
  const currFriend = selectedFriend?.id === friend.id;
  return <li>
    <img src={friend.image} alt="icon" />
    <h3>{friend.name}</h3>
    {friend.balance > 0 && <p className="green">{friend.name} owe you {Math.abs(friend.balance)}$</p>}
    {friend.balance < 0 && <p className="red">You owe Clark {Math.abs(friend.balance)}$</p>}
    {friend.balance === 0 && <p>You are even</p>}
    <button className="button" onClick={() => onSelectButton(friend)}>{currFriend ? "Close" : 'Select'}</button>
  </li>;
}
function AddFriend({ onFriendListUpdate }) {
  const [name, isName] = useState("");
  const [imgUrl, isImgUrl] = useState("https://i.pravatar.cc/48");
  const id = Date.now();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !imgUrl) return;
    const newFriend = { id: id, name: name, image: `${imgUrl}?u=${id}`, balance: 0 }

    onFriendListUpdate(newFriend);
    isName("");
    isImgUrl("https://i.pravatar.cc/48");
  }
  return <>
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <InputBox value={name} setvalue={isName}>🧑‍🤝‍🧑Friend Name</InputBox>
      <InputBox value={imgUrl} setvalue={isImgUrl}>📸Image URL</InputBox>
      <button className="button" type="submit">Add</button>
    </form>
  </>;
}
function InputBox({ children, value, setvalue, disabled }) {
  return <>
    <label>{children}</label>
    <input disabled={disabled} value={value} onChange={(e) => setvalue(e.target.value)} />
  </>;
}
function SelectBox({ children, value, setvalue, selectedFriend }) {
  return <>
    <label>{children}</label>
    <select value={value} onChange={(e) => setvalue(e.target.value)} >
      <option value="you">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>
  </>;
}
function SplitBill({ selectedFriend, onHandleFriendBalance }) {
  const [billAmount, isBillAmount] = useState("");
  const [yourExp, isYourExp] = useState("");

  const [paying, isPaying] = useState("you");

  const frndExp = billAmount ? billAmount - yourExp : "";
  function handleSplitBill(e) {
    e.preventDefault();
    onHandleFriendBalance(paying === 'you' ? frndExp : -yourExp);
  }
  return <>
    <form className="form-split-bill" onSubmit={handleSplitBill}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input value={billAmount} onChange={(e) => isBillAmount(Number(e.target.value))} />

      <label>💸 Your expense</label>
      <input value={yourExp} onChange={(e) => isYourExp(Number(e.target.value) > billAmount ? yourExp : Number(e.target.value))} />

      <label>👦 {selectedFriend.name}'s expense</label>
      <input disabled value={frndExp} />

      <SelectBox selectedFriend={selectedFriend} value={paying} setvalue={isPaying}>🤔 Who is paying the bill?</SelectBox>

      <button className="button">Split bill</button>
    </form>
  </>
}