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
  const [numDice, setNumDice] = useState(50);

  const dice = ['⚅', '⚄', '⚃', '⚂', '⚁', '⚀']

  const updateImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext && canvas.getContext('2d');
    const image = imageRef.current;
    const height = canvas.height = image.naturalHeight || image.offsetHeight || image.height;
    const width = canvas.width = image.naturalWidth || image.offsetWidth || image.width;

    context.drawImage(image, 0, 0);
  }

  const drawDice = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext && canvas.getContext('2d');
    const height = canvas.height;
    const width = canvas.width;

    const pixelsPerDice = Math.floor(width / numDice);
    const dicePerRow = Math.floor(width / pixelsPerDice);
    // 
    // console.log(`${width} - ${pixelsPerDice} x ${dicePerRow} = ${pixelsPerDice*dicePerRow}`)

    const currentDicePerRow = diceMatrix[0] ? diceMatrix[0].length : 0;

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

  const updateDicePerRow = targetNumDice => {

    let tempNumDice = parseInt(targetNumDice);

    const canvas = canvasRef.current;
    const context = canvas.getContext && canvas.getContext('2d');
    const width = canvas.width;

    const pixelsPerDice = Math.ceil(width / tempNumDice);
    const dicePerRow = Math.ceil(width / pixelsPerDice);

    const currentDicePerRow = diceMatrix[0] ? diceMatrix[0].length : 0;
    if (dicePerRow !== tempNumDice) {
      if (tempNumDice > numDice) {
        updateDicePerRow(tempNumDice + 1);
      } else {
        updateDicePerRow(tempNumDice - 1);
      }
    } else {
      setNumDice(tempNumDice);
    }
  }

  useEffect(() => {
    updateImage();
    drawDice();
  }, [imageRef.current, numDice])

  const diceCount = diceMatrix.reduce((count, a) => count + a.length, 0);

  return (
    <div className="App">
      <div className="input">
        <form>
          <label htmlFor="image">Select image:</label>
          <input type="file"
            id="image"
            accept="image/jpeg, image/png"
            style={{display:"none"}}
            onChange={e => uploadImage(e)} />
        </form>

        <img alt="whatever you uploaded" ref={imageRef} height="100" src="seinfeld.jpg"/>
          <label htmlFor="numDice">Number of dice per row:</label>
          <input type="number" id="numDice" value={numDice} onChange={(e) => updateDicePerRow(e.target.value)}
         min="10" max="500" />
        <canvas ref={canvasRef}  style={{display:"none"}} />
      </div>
      {  diceMatrix.map((row, i) => <div key={i}>{row}</div>) }
      <div>This image takes {diceCount} dice to create!</div>
      <div>At 10p per dice, it'll cost ya £{(diceCount*0.1).toFixed(2)}.</div>
    </div>
  );
}

export default App;