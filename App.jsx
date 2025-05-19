import React from "react";
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text as KonvaText } from "react-konva";
import useImage from "use-image";
import posterImg from "/poster.png";
import {db,timestamp} from "./firebase"
import {doc,setDoc,getDoc} from "firebase/firestore"

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
    height: Math.min(window.innerHeight - 40, 1000),
  });

  
  const posterWidth = 800;
  const posterHeight = 600;

  const savePosterData=async()=>{
    try{
      await setDoc(doc(db,"posterHistory", Date.now().toString()),{
        text:text,
        position:position,
        updatedAt:timestamp
      },{merge:true});
      console.log("saved in firebase data");
    }catch(error){
      console.log("Error Saving:",error)
    }
  };

const loadPosterData=async()=>{
  const docRef = doc(db,"poster","current");
  const docSnap= await getDoc(docRef);

  if(docSnap.exists()){
    setText(docSnap.data().text || "Double Click to edit");
    setPosition(docSnap.data().position ||{x:100,y:100});
  }
};
useEffect(()=>{
  loadPosterData();
},[])

useEffect(()=>{
  savePosterData();
},[text,position]);
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth - 40, 800),
        height:  Math.min(window.innerHeight - 40,1000),
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
              onTap={()=> setIsEditing(true)}
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
