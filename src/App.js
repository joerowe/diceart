import './App.css';

import React, {
  useRef,
  useState,
  useEffect
} from 'react'

const App = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [diceMatrix, setDiceMatrix] = useState([]);
  const [numDice, setNumDice] = useState(1);

  const dice = ['⚅', '⚄', '⚃', '⚂', '⚁', '⚀']

  const updateImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext && canvas.getContext('2d');
    const image = imageRef.current;
    canvas.height = image.naturalHeight || image.offsetHeight || image.height;
    canvas.width = image.naturalWidth || image.offsetWidth || image.width;

    context.drawImage(image, 0, 0);
  }

  const drawDice = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext && canvas.getContext('2d');
    const height = canvas.height;
    const width = canvas.width;

    if (width === 0) {
      return;
    }

    const pixelsPerDice = Math.floor(width / numDice);

    let tempDiceMatrix = []
    for (let y = 0; y < height; y += pixelsPerDice) {
      let diceMatrixRow = [];
      for (let x = 0; x < width; x += pixelsPerDice) {
        const data = context.getImageData(x, y, pixelsPerDice, pixelsPerDice).data;
        const averageRGB = getAverageRGB(data);
        const index = Math.floor(averageRGB / 43);
        diceMatrixRow.push(dice[index]);
      }
      tempDiceMatrix.push(diceMatrixRow);
    }
    setDiceMatrix(tempDiceMatrix);
  }

  const getAverageRGB = data => {
    let colourSum = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      count++;
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      colourSum += Math.floor((r + g + b) / 3);
    }
    return Math.floor(colourSum / count);
  }

  const uploadImage = e => {
    imageRef.current.src = URL.createObjectURL(e.target.files[0]);
  }

  const numDiceValid = (width, numDice) => {
    const pixelsPerDice = Math.floor(width / numDice);
    const dicePerRow = Math.floor(width / pixelsPerDice);
    const totalPixelsCovered = pixelsPerDice * dicePerRow;

    const fullImageCovered = totalPixelsCovered === width;
    const diceEqualToTarget = dicePerRow === numDice;

    return fullImageCovered && diceEqualToTarget;
  }

  const updateDicePerRow = targetNumDice => {

    let tempNumDice = parseInt(targetNumDice);
    const width = canvasRef.current.width;
    const toAdd = tempNumDice > numDice ? 1 : -1;

    if (width === 0) {
      return;
    }

    while (!numDiceValid(width, tempNumDice)) {
      tempNumDice += toAdd;
    }

    setNumDice(tempNumDice);
  }

  useEffect(() => {
    updateImage();
    drawDice();
  }, [imageRef.current, numDice])

  const diceCount = diceMatrix.reduce((count, a) => count + a.length, 0);

  return (
    <div className="App">
      <div className="intro">
        <p>Welcome to the dice art generator! Complete with price estimation in case you'd actually pay literally hundreds of pounds to put one of these monstrosities on your wall!</p>
        <p>(Click the image to upload your own)</p>
      <div className="input">
        <div>
          <label htmlFor="image">
            <img alt="whatever you uploaded" ref={imageRef} height="100" src="seinfeld.jpg"/>
          </label>
          <input type="file"
            id="image"
            accept="image/jpeg, image/png"
            style={{display:"none"}}
            onChange={e => uploadImage(e)} />
        </div>
        <div className="options">
          <div>
            <label htmlFor="numDice">Number of dice per row:</label>
            <input type="number" id="numDice" value={numDice} onChange={(e) => updateDicePerRow(e.target.value)}
             min="1" max="1000" />
          </div>
         <div>
           <p>This image takes {diceCount} dice to create!</p>
           <p>At 10p per dice, it'll cost ya £{(diceCount*0.1).toFixed(2)}.</p>
         </div>
        </div>
      </div>
        <canvas ref={canvasRef}  style={{display:"none"}} />
      </div>
      <div className="dice-holder">
      {  diceMatrix.map((row, i) => <div key={i}>{row}</div>) }
      </div>
    </div>
  );
}

export default App;