import logo from './logo.svg';
import './App.css';

import React, {
  useRef,
  useState,
  useEffect
} from 'react'

const App = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const maxBlockSize = 50;
  const minBlockSize = 5;
  const [blockSize, setBlockSize] = useState(100);
  const [diceMatrix, setDiceMatrix] = useState([]);

  const dice = ['⚅', '⚄', '⚃', '⚂', '⚁', '⚀']
  const colours = ['black', 'darkslategray', 'darkgray', 'gray', 'lightgray', 'white']

  const drawDice = () => {

    const canvas = canvasRef.current;
    const context = canvas.getContext && canvas.getContext('2d');
    const image = imageRef.current;
    const height = canvas.height = image.naturalHeight || image.offsetHeight || image.height;
    const width = canvas.width = image.naturalWidth || image.offsetWidth || image.width;

    context.drawImage(image, 0, 0);

    let tempDiceMatrix = []
    for (let y = 0; y < height; y += blockSize) {
      let diceMatrixRow = [];
      for (let x = 0; x < width; x += blockSize) {
        const data = context.getImageData(x, y, blockSize, blockSize).data;
        const averageRGB = getAverageRGB(data);
        const index = Math.floor(averageRGB / 43);
        diceMatrixRow.push(dice[index]);
        // context.fillStyle = colours[index];
        // context.fillStyle = `#${averageRGB.toString(16).padStart(2,'0')}0000`;
        // context.fillRect(x, y, blockSize, blockSize);
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

  const generateRGB = () => {
    const r = getColour();
    const g = getColour();
    const b = getColour();
    return `#${r}${g}${b}`;
  }

  const getColour = () => {
    const n = Math.floor(Math.random() * 255).toString(16);
    return n.length == 1 ? 0 + n : n;
  }

  const updateBlockSize = () => {
    let newBlockSize = blockSize - 10;
    if (newBlockSize < 0) {
      newBlockSize = maxBlockSize;
    } else if (newBlockSize === 0) {
      newBlockSize = minBlockSize;
    }
    setBlockSize(newBlockSize);
    drawDice();
  }

  useEffect(() => {
    drawDice();
  }, [])

  const diceCount = diceMatrix.reduce((count, a) => count + a.length, 0);

  return (
    <div className="App">
      <img ref={imageRef} width="400" src="seinfeld.jpg" onClick={()=>drawDice()}/>
      <button onClick={()=>updateBlockSize()}>MORE DICE!</button>
      <canvas ref={canvasRef}  style={{"display":"none"}} />
      {  diceMatrix.map(row => <div>{row}</div>) }
      <div>This image takes {diceCount} dice to create!</div>
      <div>At 10p per dice, it'll cost ya £{(diceCount*0.1).toFixed(2)}.</div>
    </div>
  );
}

export default App;