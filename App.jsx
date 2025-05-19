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
  const [textElements, setTextElements] = useState([
    {
      id: Date.now(),
      text: sharedText || "Double Click to edit",
      position: {
        x: !isNaN(sharedX) ? sharedX : 100,
        y: !isNaN(sharedY) ? sharedY : 100,
      },
      isEditing: false,
    }
  ]);

  const [nextId, setNextId] = useState(2);
  const stageRef = useRef();
  const textRefs = useRef({}); // Changed to use an object to store multiple refs
  const [image] = useImage(posterImg);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth - 40, 800),
    height: Math.min(window.innerHeight - 40, 1000),
  });

  const posterWidth = 800;
  const posterHeight = 600;

  const savePosterData = async () => {
    try {
      await setDoc(doc(db, "posterHistory", Date.now().toString()), {
        textElements: textElements,
        updatedAt: timestamp
      }, { merge: true });
      console.log("saved in firebase data");
    } catch (error) {
      console.log("Error Saving:", error);
    }
  };

  const loadPosterData = async () => {
    const docRef = doc(db, "poster", "current");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().textElements) {
      setTextElements(docSnap.data().textElements);
      setNextId(docSnap.data().textElements.length + 1);
    } else {
      setTextElements([{
        id: 1,
        text: "Double click to edit",
        position: { x: 100, y: 100 },
        isEditing: false
      }]);
      setNextId(2);
    }
  };

  useEffect(() => {
    loadPosterData();
  }, []);

  useEffect(() => {
    savePosterData();
  }, [textElements]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.min(window.innerWidth - 40, 800),
        height: Math.min(window.innerHeight - 40, 1000),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate shareable link
  const generateShareLink = () => {
    if (textElements.length === 0) return window.location.href;
    
    const firstText = textElements[0];
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('text', firstText.text);
    currentUrl.searchParams.set('x', firstText.position.x);
    currentUrl.searchParams.set('y', firstText.position.y);
    return currentUrl.toString();
  };

  const addNewText = () => {
    const newTextElement = {
      id: nextId,
      text: "Double Click to edit",
      position: { x: 100, y: 100 + (nextId * 30) },
      isEditing: false
    };
    setTextElements([...textElements, newTextElement]);
    setNextId(nextId + 1);
  };

  const handleTextChange = (id, newText) => {
    setTextElements(textElements.map(el =>
      el.id === id ? { ...el, text: newText } : el
    ));
  };

  const handlePositionChange = (id, newPosition) => {
    setTextElements(textElements.map(el =>
      el.id === id ? { ...el, position: newPosition } : el
    ));
  };

  const toggleEditing = (id, isEditing) => {
    setTextElements(textElements.map(el =>
      el.id === id ? { ...el, isEditing } : el
    ));
  };

  // Updated handleDragEnd to work with specific element
  const handleDragEnd = (e, id) => {
    const textNode = e.target;
    const textWidth = textNode.width() * textNode.scaleX();
    const textHeight = textNode.height() * textNode.scaleY();
    
    let newX = Math.max(0, Math.min(posterWidth - textWidth, textNode.x()));
    let newY = Math.max(0, Math.min(posterHeight - textHeight, textNode.y()));
    
    handlePositionChange(id, { x: newX, y: newY });
    textNode.position({ x: newX, y: newY });
  };

  // Updated dragBoundFunc to work with specific element
  const dragBoundFunc = (pos, id) => {
    const textNode = textRefs.current[id];
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
        <button onClick={addNewText} className="action-button add-button">
          +
        </button>
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
            {textElements.map((element) => (
              <React.Fragment key={element.id}>
                <KonvaText
                  ref={ref => textRefs.current[element.id] = ref}
                  text={element.text}
                  x={element.position.x}
                  y={element.position.y}
                  fontSize={24}
                  fill="#333"
                  draggable
                  onDblClick={() => toggleEditing(element.id, true)}
                  onTap={() => toggleEditing(element.id, true)}
                  onDragEnd={(e) => handleDragEnd(e, element.id)}
                  dragBoundFunc={(pos) => dragBoundFunc(pos, element.id)}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>

        {textElements.map((element) => (
          element.isEditing && (
            <input
              key={`input-${element.id}`}
              className="text-edit-input"
              type="text"
              value={element.text}
              autoFocus
              onChange={(e) => handleTextChange(element.id, e.target.value)}
              onBlur={() => toggleEditing(element.id, false)}
              onKeyDown={(e) => e.key === 'Enter' && toggleEditing(element.id, false)}
              style={{
                top: `${element.position.y * scale}px`,
                left: `${element.position.x * scale}px`,
                transform: `scale(${1/scale})`,
                transformOrigin: 'top left'
              }}
            />
          )
        ))}
      </div>
    </div>
  );
}
