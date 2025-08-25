import { useState, useEffect } from 'react'
import './App.css'

const Card=(prop)=>{

    //STATES : States are a way to have dynamically changing assets in your 
  //web page.
  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(0);
  //useState is what is known as a Hook.  A hook is a special function
  //in react that let you tap into features such as State Management.

  //There are other types of hook functions in React. Such as 
  //useState for managing states.
  //useEffect for handling effects such as data fetching.
  //useContext for sharing data across components.
  //useCallback for optimizing callback functions.
  //There are more.

  //USE EFFECT

  useEffect(() => {
    console.log(prop.titleProp + "Has been liked : " + hasLiked);
  }, [hasLiked]);
  //The array being passed in useEffect is a limiter that sets the condition
  //for when useEffect is called. The fact that we passed the hasLiked variable means that everytime we toggle hasLiked, use effect will first check if the value has been updated. If it has, only then will it the useEffect function call.
  //The actions that happen here will take effect once the Component has been 
  //declared in App.jsx.

  useEffect(()=> {
    () => {
      console.log("Count button has been pressed!");
    }
  }, [count]);

  const resetCount = () => {
    setCount(0);
    console.log('count has been reset' + count);
    const button = document.getElementById('resetbutton');
    button.style.display = 'none';
  };

  
  const makeButtonVisible = () =>{
    const button = document.getElementById('resetbutton');
    button.style.display = 'block';

    return (
      <p>Button has been clicked over ten times!</p>
    );
    //Note, there is probably a better way to do this other than resorting to DOM manipulation so research pa more.
  }

  useEffect
  return (
    <>
      <div className = 'parentContainer' style={{
      //You can create an inline style in REACT like this:
      //Note that each value must be a string in REACT
      //as opposed to just assigning the values directly.
      border : '1px solid #4b5362',
      padding : '20px',
      margin : '10px',
      backgroundColor : '#31363f',
      textAlign : 'center',
      color : 'white',
      borderRadius : '10px',
      minHeight : '100px'
      //note, inline styles are preferred over CSS files.
      //This means that if you redeclare a design in a CSS file, the inline design
      //is always preferred.
    }} >
      <div className="card" onClick={()=>{
      setCount(count+1)
      console.log('count has been clicked!')
      }}>
      
      <h2 >Card Component</h2>
      <p className={prop.className} style={{
        fontSize : '40px',
      }}>{prop.titleProp} <br/> Count: {count}</p>
      <button onClick = {() => setHasLiked(!hasLiked)} style={{
        cursor : 'pointer',
      }}>
        {hasLiked ? 'Liked' : 'Like'}
      </button>
      <p className="rating">{prop.rating}</p>
      
      {hasLiked ? <p>Thank you for Liking!</p> : null}
      
      {count >= 10 ? makeButtonVisible() : null}
      {/* This is what is known as conditional rendering. */}
    </div>
    <button className='text-3xl' id='resetbutton' onClick={resetCount} style = {
      {
        display : 'none'
      }
    }>
      reset count?
    </button>

   </div>
    </>

  )
}

const App = ()=>{

  return(
    <> 
    {/* a tag that allows for multiline tags in React*/}
    <h2>Functional Arrow Component</h2>
    <div className='card-container'>
      <Card titleProp="The Lion King" rating={5}></Card>
      <Card titleProp = "Star Wars" rating={5}></Card>
    </div>
    </>

  );
}

export default App
