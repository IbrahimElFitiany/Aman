import { useState , useEffect , useRef } from "react";

function Test() {
    const box = useRef(null)
    console.log(box.current)

    function changeColor(){
      if (box.current.style.backgroundColor == "red"){
        box.current.style.backgroundColor = "#FFD230"
      }
      else{
      box.current.style.backgroundColor = "red"
      }

      console.log(box.current)
    }

    
  
    return (
      <div className="container">

        <div className="flex justify-center m-[20px] rounded-3xl w-16 bg-amber-300" ref={box}>
           box
        </div>

        <button className="flex justify-center m-[10px] rounded-xl w-32 bg-amber-700" onClick={()=>changeColor()}>
          change color
        </button>
      </div>

    );
  }
  
export default Test;