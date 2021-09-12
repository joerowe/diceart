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
  const [numDice, setNumDice] = useState(2);
  const [imageSource, setImageSource] = useState("seinfeld.jpg");

  const dice = ['⚅', '⚄', '⚃', '⚂', '⚁', '⚀']

  const updateImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    canvas.height = image.naturalHeight || image.offsetHeight || image.height;
    canvas.width = image.naturalWidth || image.offsetWidth || image.width;

    canvas.getContext('2d').drawImage(image, 0, 0);
  }

  const drawDice = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const height = canvas.height;
    const width = canvas.width;

    if (width === 0) {
      return;
    }

    const pixelsPerDice = Math.floor(width / numDice);

    let tempDiceMatrix = []
    for (let y = 0; y <= height - pixelsPerDice; y += pixelsPerDice) {
      let diceMatrixRow = [];
      for (let x = 0; x <= width - pixelsPerDice; x += pixelsPerDice) {
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

  const dicePerRowEqualToTarget = (numDice, pixelsPerDice) => {
    const dicePerRow = Math.floor(canvasRef.current.width / pixelsPerDice);
    return dicePerRow === numDice;
  }

  const updateDicePerRow = targetNumDice => {
    let tempNumDice = targetNumDice ? parseInt(targetNumDice) : 1;
    const toAdd = tempNumDice > numDice ? 1 : -1;

    if (canvasRef.current.width === 0) {
      return;
    }

    let pixelsPerDice = Math.floor(canvasRef.current.width / tempNumDice);
    while (!dicePerRowEqualToTarget(tempNumDice, pixelsPerDice)) {
      tempNumDice += toAdd;
      pixelsPerDice = pixelsPerDice = Math.floor(canvasRef.current.width / tempNumDice);
    }

    if (canvasRef.current.height < pixelsPerDice) {
      tempNumDice += 1;
    }

    setNumDice(tempNumDice);
  }

  const handleImageChange = () => {
    updateImage();
    updateDicePerRow(1);
    drawDice();
  }

  const refresh = () => {
    updateImage();
    drawDice();
  }

  useEffect(() => {
    refresh();
  }, [numDice])


  const uploadImage = e => {
    setImageSource(URL.createObjectURL(e.target.files[0]));
  }

  const formatNumber = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const diceCount = diceMatrix.reduce((count, a) => count + a.length, 0);

  return (
    <div className="App">
      <div className="intro">
        <p>Welcome to the dice art generator! Complete with price estimation in case you'd actually pay literally hundreds of pounds to put one of these monstrosities on your wall!</p>
        <p>(Click the image to upload your own)</p>
      <div className="input">
        <div className="image">
          <label htmlFor="image">
            <img
              alt="whatever you uploaded"
              ref={imageRef}
              height="100"
              src={imageSource}
              onLoad={()=>handleImageChange()}/>
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
            <input
              type="number"
              id="numDice"
              value={numDice}
              onChange={(e) => updateDicePerRow(e.target.value)}
              min="1"
              max="1000"
              style={{textAlign:"right"}} />
          </div>
         <div>
           {diceMatrix[0] &&
             <div>
           <p>This image has {diceMatrix.length} rows of {diceMatrix[0].length} dice.</p>
           <p>That's a total of {formatNumber(diceCount)} dice!</p>
           <p>At 10p per dice, it'll cost ya £{formatNumber((diceCount*0.1).toFixed(2))}.</p></div>}
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