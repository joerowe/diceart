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

  const [diceMatrix, setDiceMatrix] = useState([]);

  const dice = ['⚅', '⚄', '⚃', '⚂', '⚁', '⚀']
  const colours = ['black', 'darkslategray', 'darkgray', 'gray', 'lightgray', 'white']

  const drawDice = () => {

    var blockSize = 10,
      canvas = canvasRef.current,
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height, length,
      imgEl = imageRef.current;

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    let tempDiceMatrix = []
    for (let y = 0; y < height; y += blockSize) {
      let diceMatrixRow = [];
      for (let x = 0; x < width; x += blockSize) {
        data = context.getImageData(x, y, blockSize, blockSize).data;
        let colourSum = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          count++;
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];
          let avg = Math.floor((r + g + b) / 3);
          colourSum += avg;
        }
        colourSum = Math.floor(colourSum / count);
        const index = Math.floor(colourSum / 43);

        diceMatrixRow.push(dice[index]);

        context.fillStyle = colours[index];
        context.fillRect(x, y, blockSize, blockSize);
      }
      tempDiceMatrix.push(diceMatrixRow);
    }
    setDiceMatrix(tempDiceMatrix);
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

  useEffect(() => {
    drawDice();
  }, [])

  return (
    <div className="App">
      <img ref={imageRef} width="400" src="dice.png" onClick={()=>drawDice()}/>
      <canvas ref={canvasRef}  style={{"display":"none"}} />
      {  diceMatrix.map(row => <div>{row}</div>) }
    </div>
  );
}

export default App;