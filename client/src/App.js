import axios from 'axios';
import { useState } from 'react';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  const getMenu = async () => {
    axios.get('http://localhost:5000/api/menu')
    .then(res => {
      console.log(res.status)
      setMenuItems(res.data)
    })
  }
  
  const postMenuItem = async () => {
    const newItem = {name:"Salt Fish", category: "Fish", price: 21.50};
    axios.post('http://localhost:5000/api/menu', newItem)
    .then(res =>{
      console.log(res.status);
      setMenuItems([...menuItems, res.data]);
    })
  }

const putMenuItem = async () => {
  const target = menuItems[0];
  if (!target) return;
  const updatedItem = {_id: target._id, name: "Pumpkin Pie", category: "Dessert", price: 12.50};
  const { data } = await axios.put(`http://localhost:5000/api/menu/${updatedItem._id}`, updatedItem);
  setMenuItems(prev => prev.map(i => i._id === updatedItem._id ? data : i));
};


const deleteMenuItem = async () => {
  const targetID = menuItems[0]._id;
  axios.delete(`http://localhost:5000/api/menu/${targetID}`)
  .then(res => {
    const updatedList = menuItems.filter(item => item._id !== targetID);
    setMenuItems(updatedList);
  })
  .then (() => getMenu());
}

  return(
    <>
    <button onClick={getMenu}>Get Menu Items</button>
    <button onClick={postMenuItem}>Post an item to the menu</button>
    <button onClick={putMenuItem}>Change the second item to pumpkin pie</button>
    <button onClick={deleteMenuItem}>Delete the second item</button>

    {menuItems.map((item) => {
      return(
        <h1 key={item._id}>
          {item._id.slice(-5)}: {item.name}
        </h1>
      )
    })}
    
    </>
  )
  
}