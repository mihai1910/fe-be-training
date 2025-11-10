import axios from 'axios';
import { useState } from 'react';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  const getMenu = async () => {
    axios.get('/api/menu')
    .then(res => {
      console.log(res.status)
      setMenuItems(res.data)
    })
  }
  
  const postMenuItem = async () => {
    const newItem = {name:"Salt Fish", category: "Fish", price: 21.50};
    axios.post('/api/menu', newItem)
    .then(res =>{
      console.log(res.status);
      setMenuItems([...menuItems, res.data]);
    })
  }

const putMenuItem = async () => {
  const updatedItem = {id: menuItems[1]._id, name: "Pumpkin Pie", category: "Dessert", price:12.50}
  axios.put(`/api/menu/${updatedItem._id}`, updatedItem)
  .then(() => {
    setMenuItems(prev => {
      prev.map(i => i._id === updatedItem._id ? updatedItem : i)
    })
  })
  .then (() => getMenu());
}

const deleteMenuItem = async () => {
  const targetID = menuItems[0]._id;
  axios.delete(`/api/menu/${targetID}`)
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