import axios from 'axios';
import { useState } from 'react';

export default function App() {
  const [menuItems, setMenuItems] = useState([]);

  const getMenu = () => {
    axios.get('/menu')
    .then(res => {
      console.log(res.status)
      setMenuItems(res.data)
    })
  }
  
  const postMenuItem = () => {
    const newItem = {name:"Salt Fish"};
    axios.post('/menu', newItem)
    .then(res =>{
      console.log(res.status);
      setMenuItems([...menuItems, res.data]);
    })
  }

  const putMenuItem = () => {
    const targetID = 2;
    const newItemName = {name: "Pumpkin Pie"};
    axios.put(`/menu/${targetID}`, newItemName)
    .then(res => {
      console.log(res.status);
      setMenuItems(res.data);
    })
  }

  const deleteMenuItem = () => {
    axios.delete('/menu/2')
    .then(res => {
      console.log(res.status);
      setMenuItems(menuItems.filter(item => item.id !== res.data.id));
    })
  }

  return(
    <>
    <button onClick={getMenu}>Get Menu Items</button>
    <button onClick={postMenuItem}>Post an item to the menu</button>
    <button onClick={putMenuItem}>Change the second item to pumpkin pie</button>
    <button onClick={deleteMenuItem}>Delete the first item</button>

    {menuItems.map((item) => {
      return(
        <h1 key={item.id}>
          {item.id}: {item.name}
        </h1>
      )
    })}
    
    </>
  )
  
}