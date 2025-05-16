/**export default function Header() {
    return(
        <header>
            <h1>Hii For EveryBody In Here</h1>
        </header>
    )
}
 import joke from "/joke"

export default function App(){
    return(
      <main>
        <joke
        setup="I got a frigde for my daughter brithday gift"
        punchline="i cant see her face without light"
        />
        <joke
        setup="How did hacker escape from police"
        punchline="he ran somewhere"
        />

        
      </main>
    )
}
joke.render(
    <App />
)*/

/**import { noBoolOperatorAliases } from "sequelize/lib/utils/deprecations"

export default function App() {
    const ninjaturtles=[
        <h2>Donate hlo</h2>,
        <h2>Rafeal</h2>

    ]

return(
    <main>
        {ninjaturtles}
    </main>
)
}*/

/**export default function App(){
    return(
        <main>
            <form className="add-ingerdiants"> 
                <input 
                type="text"
                placeholder="e.g orange"
                aria-label="Ingerdiants"
                />
                <button>Add Ingerdiants</button>
            </form>
        </main>
    )
}*/
/**import React from "react"
export default function App(){
    const result=React.useState("heck")
    console.log(result)
    return(
        <main>
            <h1>Is it important to know</h1>
            <button>{result}</button>
        </main>
    )
}*/

/**import React from "react";
export default function App(){
    const [count,setCount]=React.useState(10)
    function sub(){
        setCount(count-1)
    }

    function add(){
        setCount(count+1)
    }

    return(
        <main>
            <h1>how many times my Self say "state" in the section</h1>
            <div>
                <button className="minus" onClick={sub}aria-label="Decrease count">-</button>
                <h2>{count}</h2>
                <button className="plus" onClick={add} aria-label="Increase count">+</button>
            </div>
        </main>
    )
}*/

/**export default function App(){
    const toNight=true
    

   
    return(
        <main>
        <h2>Would like to go out tonight?</h2>
        <button>{toNight?"yes":"No"}</button>
        </main>
    )
}
*/

/**import React from "react";
export default function App(){
    const[isGoingOut,notGoingOut]=React.useState(false)

    return(
        <main>
            <h1>is Going out to night</h1>
            <button onClick={()=>{notGoingOut(!isGoingOut)}}>{isGoingOut?"yes":"no"}</button>
        </main>
    )*/

/**import React from "react";
export default function App(){
    const [unreadMessages,setUnreadMessages] =React.useState(["a","b"])
    return (
        <div>
            {
                unreadMessages.length>0&&
                <h1>you have{unreadMessages.length}unread messages!</h1>
            }
        </div>
    )
}import { console } from "inspector"
*/
/**import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { nanoid } from "nanoid"
import { useState } from "react"
import Die from "/Die"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use";

async function saveGameResult(score) {
    try {
      await addDoc(collection(db, "gameResults"), {
        timestamp: new Date(),
        score: score
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

export default function App(){
    const { width, height } = useWindowSize();
    
    const[dice,setDice]=useState(generateAllNewDice())

    const gameWon = dice.length > 0 &&
    dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value);



    function generateAllNewDice(){
       return new Array(10)
        .fill(0)
        .map(()=>({
             value:Math.ceil(Math.random()*6),
             isHeld:false,
             id:nanoid()
        }))
    
    }
   function rollDice(){
    if(!gameWon){
    setDice(oldDice=>oldDice.map(die=>
        die.isHeld?
          die:
        {...die,value:Math.ceil(Math.random()*6)}

    ))
}else{
    setDice(generateAllNewDice())
}
   }
   function hold(id){
     setDice(oldDice=>{
        return oldDice.map(die=>{
            return die.id==id?
            {...die,isHeld:!die.isHeld}:
            die
        })
     })
   }
    const diceElements=dice.map(dieObj=> (
    <Die  key={dieObj.id}
     value={dieObj.value} 
     isHeld={dieObj.isHeld}
     hold={()=>hold(dieObj.id)}
     id={dieObj.id}
      />))
    return(
        <main>
             {gameWon && <Confetti width={width} height={height} />}
            <h1 className="title">Tenzies</h1>
            <p className="instruction">Roll until are dice are same.Click each dice to freeze it at its current value between rolls</p>
            <div className="dice-container">
           {diceElements}
                </div>
            <button className="dice-roll" onClick={rollDice}>{gameWon? "NewGame":"RollUp"}</button>
        </main>
    )
}*/

/**import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import Die from "/Die";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function App() {
    const { width, height } = useWindowSize();
    const [dice, setDice] = useState(generateAllNewDice());
    const [gameWon, setGameWon] = useState(false);
    const [resultSaved, setResultSaved] = useState(false); 
    const [rollCount, setRollCount] = useState(0);
    const winningValue=dice[0]?.value;


    // Generate a new set of 10 dice
    function generateAllNewDice() {
        return Array.from({ length: 10 }, () => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }));
    }

    // Roll dice or reset game
    function rollDice() {
        if (gameWon) {
            setDice(generateAllNewDice());
            setGameWon(false);
            setResultSaved(false); 
            setRollCount(0);
        } else {
            setDice(oldDice =>
                oldDice.map(die =>
                    die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
                )
            );
            setRollCount(prev=>prev+1);
        }
    }

    // Toggle hold state for a die
    function hold(id) {
        setDice(oldDice =>
            oldDice.map(die =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die
            )
        );
    }

    // Check if game is won
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld);
        const allSame = dice.length > 0 && dice.every(die => die.value === dice[0].value);
        if (allHeld && allSame && !gameWon) {
            setGameWon(true);
        }
    }, [dice]);

    // Save game result to Firebase once when game is won
    useEffect(() => {
        if (gameWon && !resultSaved) {
            saveGameResult();
        }
    }, [gameWon]);

    // Firebase write function
    async function saveGameResult() {
        try {
            await addDoc(collection(db, "gameResults"), {
                timestamp: new Date(),
                diceCount: dice.length,
                rollCount:rollCount,
                winningValue:winningValue,
            });
            console.log("Game result saved!");
            setResultSaved(true);
        } catch (error) {
            console.error(" Failed to save game result:", error);
        }
    }

    // Render each die
    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            hold={() => hold(die.id)}
        />
    ));

    return (
        <main>
            {gameWon && <Confetti width={width} height={height} />}
            <h1 className="title">Tenzies</h1>
            <p className="instruction">
                Roll until all dice are the same. Click a die to freeze its value between rolls.
            </p>
            <div className="dice-container">{diceElements}</div>
            <button className="dice-roll" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    );
}*/

/**import React, { useState } from "react";
import clsx from "clsx";
import { languages } from "./languages";
import getFarewellText,{  getRandomWord}  from "./utils";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function AssemblyEndgame(){
    const { width, height } = useWindowSize();
     
     const[currentWord,setCurrentWord]=useState(()=>getRandomWord())
     const [guessedLetters,setGuessedLetters]=useState([])

    const wrongGuessCount=
    guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGamewon=
    currentWord.split("").every(letter=>guessedLetters.includes(letter))
    const isGameLost=
    wrongGuessCount>=languages.length-1
    const isGameOver=isGamewon || isGameLost
    const alphabet="abcdefghijklmnopqrstuvwxyz"
     const lastGuessedLetter=guessedLetters[guessedLetters.length-1]
           const isLastGuessedIncorrect=lastGuessedLetter&&!currentWord.includes(lastGuessedLetter)
    
    console.log(guessedLetters)
    function addGuessedLetter(letter){
        setGuessedLetters(prevLetters=>
            prevLetters.includes(letter)?
            prevLetters:

            [...prevLetters,letter])
    }
    function startNewGame(){
      setCurrentWord(getRandomWord())
      setGuessedLetters([])
       
   }

    const languageElement=languages.map((lang,index)=>{
        const isLanguageLost=index<wrongGuessCount
    const styles={
        backgroundColor:lang.backgroundColor,
        color:lang.color
    }
    const className=clsx("chip",isLanguageLost&&"lost")
                 return(
        <span 
        className={className}
         style={styles}>
          {lang.name}</span>
        )
    })
    const letterWord=currentWord.split("").map((letter,index)=>{
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName= clsx(
            isGameLost && !guessedLetters.includes(letter)&&"missed-letter"
        )
        return(

      <span key={index}className={letterClassName}>
        {shouldRevealLetter?letter.toUpperCase():""}</span>
          )
          
    })
    const keyboardElement=alphabet.split("").map(letter=> {
           const isGuessed=guessedLetters.includes(letter)
           const iscorrect=isGuessed && currentWord.includes(letter)
           const iswrong=isGuessed && !currentWord.includes(letter)
          
           
           const className=clsx({
             correct:iscorrect,
             wrong:iswrong
        })
        console.log(className)

        return(
        <button
        className={className} 
        key={letter}
        disabled={isGameOver} 
        aria-disabled={isGameOver}
        onClick={()=>addGuessedLetter(letter)}>
            {letter.toUpperCase()}
            </button>
    )
})
const gameStatusClass=clsx("game-status",{
    won:isGamewon ,
    lost:isGameLost,
     farewell: !isGameOver && isLastGuessedIncorrect
   
})
 
    
  
function renderGameStatus(){
    if(!isGameOver && isLastGuessedIncorrect ){
        return (
            <>
        <p className="farewell-message">
            {getFarewellText(languages[wrongGuessCount-1]?.name)}</p>
            </>
   ) }
  if(isGamewon  ){
        return(
               <>
              <Confetti width={width} height={height} />
               <h2>you Win!</h2>
               <p>Well Done</p>
                </>

        )
    }
    if(isGameLost){
        return(
           <>
              <h2>Game Over!</h2>
                <p>You Lose!Better Start Learning Assembly</p>
              </>
        )
    }

  
}
    return(
        <main>
               <header>
                <h1>Assembly : Endgame</h1>
                <p>Guess the word within 8 attempts to keep programming world safe from Assembly!</p>
                </header>
                <section 
                aria-live="polite"
                role="status"
                className={gameStatusClass}>
                    {renderGameStatus()}
                     </section>
           
                <section className="language-chips">
                    {languageElement}
                    </section> 
                    <section className="word">
                        {letterWord}
                        </section> 

                    
                    <section className="keyboard">
                        {keyboardElement}
                        </section>

                       {isGameOver && 
                       <button className="newgame" onClick={startNewGame}>
                            New Game</button>  }      
        </main>
    )
}*/
/**
   

import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text as KonvaText } from "react-konva";
import useImage from "use-image";
import posterImg from "/src/poster.png";

export default function App() {
  // Check URL for shared poster data
  const urlParams = new URLSearchParams(window.location.search);
  const sharedText = urlParams.get('text');
  const sharedX = parseFloat(urlParams.get('x'));
  const sharedY = parseFloat(urlParams.get('y'));

  const [text, setText] = useState(sharedText || "Double-click to edit");
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ 
    x: !isNaN(sharedX) ? sharedX : 100, 
    y: !isNaN(sharedY) ? sharedY : 100 
  });
  const stageRef = useRef();
  const [image] = useImage(posterImg);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth - 40, 800),
    height: Math.min(window.innerHeight - 120, 600),
  });

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth - 40, 800),
        height: Math.min(window.innerHeight - 120, 600),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate shareable link
  const generateShareLink = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('text', text);
    currentUrl.searchParams.set('x', position.x);
    currentUrl.searchParams.set('y', position.y);
    return currentUrl.toString();
  };

  // Download handler
  const downloadPoster = async () => {
    try {
      const dataUrl = await new Promise(resolve => {
        stageRef.current.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2,
          callback: resolve
        });
      });

      const link = document.createElement('a');
      link.download = 'my-poster.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Couldn't download image. Please try again.");
    }
  };

  // Share handler
  const sharePoster = async () => {
    try {
      const shareLink = generateShareLink();
      
      if (navigator.canShare?.({ url: shareLink })) {
        await navigator.share({
          title: "Edit my poster!",
          text: "Check out and edit this poster!",
          url: shareLink
        });
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard! Send this to others to let them edit your poster.");
      }
    } catch (error) {
      console.error("Share error:", error);
      // Final fallback to download
      downloadPoster();
    }
  };

  const scale = Math.min(
    dimensions.width / 800,
    dimensions.height / 600
  );

  return (
    <div className="app-container">
      <div className="top-right-buttons">
        <button onClick={sharePoster} className="action-button">
          Share Editable Poster
        </button>
        <button onClick={downloadPoster} className="action-button">
          Download PNG
        </button>
      </div>

      {sharedText && (
        <div className="shared-notice">
          You're viewing a shared poster! Edit the text and share it again.
        </div>
      )}

      <div className="canvas-wrapper" style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}>
        <Stage 
          width={dimensions.width} 
          height={dimensions.height} 
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <Image image={image} width={800} height={600} />
            <KonvaText
              text={text}
              x={position.x}
              y={position.y}
              fontSize={24}
              fill="#333"
              draggable
              onDblClick={() => setIsEditing(true)}
              onDragEnd={(e) => setPosition({ 
                x: e.target.x(), 
                y: e.target.y() 
              })}
            />
          </Layer>
        </Stage>

        {isEditing && (
          <input
            className="text-edit-input"
            type="text"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            style={{
              top: `${position.y * scale}px`,
              left: `${position.x * scale}px`,
              transform: `scale(${1/scale})`,
              transformOrigin: 'top left'
            }}
          />
        )}
      </div>
    </div>
  );
}

// App.jsx
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text as KonvaText } from "react-konva";
import useImage from "use-image";
import posterImg from "/src/poster.png";

export default function App() {
  const [text, setText] = useState("Double-click to edit");
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const stageRef = useRef();
  const [image] = useImage(posterImg);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth - 40, 800),
    height: Math.min(window.innerHeight - 120, 600),
  });

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth - 40, 800),
        height: Math.min(window.innerHeight - 120, 600),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Download handler
  const downloadPoster = async () => {
    try {
      const dataUrl = await new Promise(resolve => {
        stageRef.current.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2,
          callback: resolve
        });
      });

      const link = document.createElement('a');
      link.download = 'my-poster.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Couldn't download image. Please try again.");
    }
  };

  // Share handler
  const sharePoster = async () => {
    try {
      const dataUrl = await new Promise(resolve => {
        stageRef.current.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          callback: resolve
        });
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "poster.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Check out my poster!",
          files: [file]
        });
      } else {
        downloadPoster();
        alert("Sharing not supported - downloaded instead");
      }
    } catch (error) {
      console.error("Share error:", error);
      downloadPoster();
    }
  };

  const scale = Math.min(
    dimensions.width / 800,
    dimensions.height / 600
  );

  return (
    <div className="app-container">
      <div className="top-right-buttons">
        <button onClick={sharePoster} className="action-button">
          Share Poster
        </button>
        <button onClick={downloadPoster} className="action-button">
          Download PNG
        </button>
      </div>

      <div className="canvas-wrapper" style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}>
        <Stage 
          width={dimensions.width} 
          height={dimensions.height} 
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <Image image={image} width={800} height={600} />
            <KonvaText
              text={text}
              x={position.x}
              y={position.y}
              fontSize={24}
              fill="#333"
              draggable
              onDblClick={() => setIsEditing(true)}
              onDragEnd={(e) => setPosition({ 
                x: e.target.x(), 
                y: e.target.y() 
              })}
            />
          </Layer>
        </Stage>

        {isEditing && (
          <input
            className="text-edit-input"
            type="text"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            style={{
              top: `${position.y * scale}px`,
              left: `${position.x * scale}px`,
              transform: `scale(${1/scale})`,
              transformOrigin: 'top left'
            }}
          />
        )}
      </div>
    </div>
  );
}*/
import React from "react";
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text as KonvaText } from "react-konva";
import useImage from "use-image";
import posterImg from "/src/poster.png";

export default function App() {
  // Check URL for shared poster data
  const urlParams = new URLSearchParams(window.location.search);
  const sharedText = urlParams.get('text');
  const sharedX = parseFloat(urlParams.get('x'));
  const sharedY = parseFloat(urlParams.get('y'));

  // State management
  const [text, setText] = useState(sharedText || "Double-click to edit");
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ 
    x: !isNaN(sharedX) ? sharedX : 100, 
    y: !isNaN(sharedY) ? sharedY : 100 
  });
  const stageRef = useRef();
  const textRef = useRef();
  const [image] = useImage(posterImg);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth - 40, 800),
    height: Math.min(window.innerHeight - 120, 600),
  });

  
  const posterWidth = 800;
  const posterHeight = 600;

  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth - 40, 800),
        height: Math.min(window.innerHeight - 120, 600),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate shareable link
  const generateShareLink = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('text', text);
    currentUrl.searchParams.set('x', position.x);
    currentUrl.searchParams.set('y', position.y);
    return currentUrl.toString();
  };

  
  const handleDragEnd = (e) => {
    const textNode = e.target;
    const textWidth = textNode.width() * textNode.scaleX();
    const textHeight = textNode.height() * textNode.scaleY();
    
    let newX = Math.max(0, Math.min(posterWidth - textWidth, textNode.x()));
    let newY = Math.max(0, Math.min(posterHeight - textHeight, textNode.y()));
    
    setPosition({ x: newX, y: newY });
    textNode.position({ x: newX, y: newY });
  };

  // Real-time boundary checking during drag
  const dragBoundFunc = (pos) => {
    const textNode = textRef.current;
    if (!textNode) return pos;
    
    const textWidth = textNode.width() * textNode.scaleX();
    const textHeight = textNode.height() * textNode.scaleY();
    
    return {
      x: Math.max(0, Math.min(posterWidth - textWidth, pos.x)),
      y: Math.max(0, Math.min(posterHeight - textHeight, pos.y))
    };
  };

  // Download handler
  const downloadPoster = async () => {
    try {
      const dataUrl = await new Promise(resolve => {
        stageRef.current.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2,
          callback: resolve
        });
      });

      const link = document.createElement('a');
      link.download = 'my-poster.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Couldn't download image. Please try again.");
    }
  };

  // Share handler
  const sharePoster = async () => {
    try {
      const shareLink = generateShareLink();
      
      if (navigator.canShare?.({ url: shareLink })) {
        await navigator.share({
          title: "Edit my poster!",
          text: "Check out and edit this poster!",
          url: shareLink
        });
      } else {
        await navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard! Send this to let others edit your poster.");
      }
    } catch (error) {
      console.error("Share error:", error);
      downloadPoster();
    }
  };

  const scale = Math.min(
    dimensions.width / posterWidth,
    dimensions.height / posterHeight
  );

  return (
    <div className="app-container">
      <div className="top-right-buttons">
        <button onClick={sharePoster} className="action-button">
          Share Editable Poster
        </button>
        <button onClick={downloadPoster} className="action-button">
          Download Poster
        </button>
      </div>

     

      <div className="canvas-wrapper" style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}>
        <Stage 
          width={dimensions.width} 
          height={dimensions.height} 
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <Image 
              image={image} 
              width={posterWidth} 
              height={posterHeight} 
            />
            <KonvaText
              ref={textRef}
              text={text}
              x={position.x}
              y={position.y}
              fontSize={24}
              fill="#333"
              draggable
              onDblClick={() => setIsEditing(true)}
              onDragEnd={handleDragEnd}
              dragBoundFunc={dragBoundFunc}
            />
          </Layer>
        </Stage>

        {isEditing && (
          <input
            className="text-edit-input"
            type="text"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            style={{
              top: `${position.y * scale}px`,
              left: `${position.x * scale}px`,
              transform: `scale(${1/scale})`,
              transformOrigin: 'top left'
            }}
          />
        )}
      </div>
    </div>
  );
}
/**import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text as KonvaText } from "react-konva";
import useImage from "use-image";
import posterImg from "/src/poster.png";

export default function App() {
  // State management
  const [text, setText] = useState("Double-click to edit");
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const stageRef = useRef();
  const textRef = useRef();
  const [image] = useImage(posterImg);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth - 40, 800),
    height: Math.min(window.innerHeight - 120, 600),
  });

  const posterWidth = 800;
  const posterHeight = 600;

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth - 40, 800),
        height: Math.min(window.innerHeight - 120, 600),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate image data URL with error handling
  const generateImageData = async () => {
    try {
      return await new Promise((resolve, reject) => {
        // Ensure stage is fully rendered
        setTimeout(() => {
          try {
            stageRef.current.toDataURL({
              mimeType: 'image/png',
              quality: 1,
              pixelRatio: 2, // Good balance of quality/performance
              callback: (dataUrl) => {
                if (dataUrl && dataUrl.startsWith('data:image/png')) {
                  resolve(dataUrl);
                } else {
                  reject(new Error("Invalid image data generated"));
                }
              }
            });
          } catch (error) {
            reject(error);
          }
        }, 100);
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  };

  // Download handler
  const downloadPoster = async () => {
    try {
      const dataUrl = await generateImageData();
      const link = document.createElement('a');
      const timestamp = new Date().getTime();
      link.download = `poster-${timestamp}.png`;
      link.href = dataUrl;
      
      // Required for Firefox
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(dataUrl);
      }, 100);
      
    } catch (error) {
      console.error("Download failed:", error);
      alert("Couldn't generate the image. Please try again.");
    }
  };

  // Share handler with multiple fallbacks
  const sharePoster = async () => {
    try {
      const dataUrl = await generateImageData();
      const blob = await fetch(dataUrl).then(res => res.blob());
      const file = new File([blob], "poster.png", { type: blob.type });
      
      // Try native share first
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Check out my poster!",
          files: [file],
        });
        return;
      }
      
      // Fallback to URL sharing
      if (navigator.share) {
        await navigator.share({
          title: "Check out my poster!",
          text: "I created this awesome poster!",
          url: window.location.href,
        });
        return;
      }
      
      // Final fallback to download
      downloadPoster();
      alert("Sharing not supported - downloaded instead");
      
    } catch (error) {
      console.error("Sharing failed:", error);
      // If everything fails, just download
      downloadPoster();
    }
  };

  // Handle text dragging with boundaries
  const handleDragEnd = (e) => {
    const node = e.target;
    const newX = Math.max(0, Math.min(posterWidth - node.width(), node.x()));
    const newY = Math.max(0, Math.min(posterHeight - 30, node.y()));
    setPosition({ x: newX, y: newY });
    node.position({ x: newX, y: newY });
  };

  const scale = Math.min(
    dimensions.width / posterWidth,
    dimensions.height / posterHeight
  );

  return (
    <div className="app-container">
      <div className="top-right-buttons">
        <button onClick={sharePoster} className="action-button">
          Share Poster
        </button>
        <button onClick={downloadPoster} className="action-button">
          Download PNG
        </button>
      </div>

      <div className="canvas-wrapper" style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}>
        <Stage 
          width={dimensions.width} 
          height={dimensions.height} 
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <Image 
              image={image} 
              width={posterWidth} 
              height={posterHeight} 
            />
            <KonvaText
              ref={textRef}
              text={text}
              x={position.x}
              y={position.y}
              fontSize={24}
              fill="#333"
              draggable
              onDblClick={() => setIsEditing(true)}
              onDragEnd={handleDragEnd}
              dragBoundFunc={(pos) => ({
                x: Math.max(0, Math.min(posterWidth - (textRef.current?.width() || 0), pos.x)),
                y: Math.max(0, Math.min(posterHeight - 30, pos.y))
              })}
            />
          </Layer>
        </Stage>

        {isEditing && (
          <input
            className="text-edit-input"
            type="text"
            value={text}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            style={{
              top: `${position.y * scale}px`,
              left: `${position.x * scale}px`,
              transform: `scale(${1/scale})`,
              transformOrigin: 'top left'
            }}
          />
        )}
      </div>
    </div>
  );
}*/