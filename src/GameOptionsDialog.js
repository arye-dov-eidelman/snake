function GameOptionsDialog({ gameOptions, setGameOption, inputControlsProfiles }) {
  return (
    <div>
      <fieldset className="m-4">
        <label className="m-2">
          Controls:
        </label>
        <span className="m-2">
          <input type="radio" id="inputControls_arrowKeys" name="inputControls" value="arrowKeys" checked={gameOptions.inputControls.id === 'arrowKeys'}
            onChange={e => setGameOption('inputControls', inputControlsProfiles.find(inputControls => inputControls.id === e.target.value))} />
          <label className="mx-1" htmlFor="inputControls_arrowKeys">Arrow Keys</label>
        </span>
        <span className="m-2">
          <input type="radio" id="inputControls_asdfKeys" name="inputControls" value="asdfKeys" checked={gameOptions.inputControls.id === 'asdfKeys'}
            onChange={e => setGameOption('inputControls', inputControlsProfiles.find(inputControls => inputControls.id === e.target.value))} />
          <label className="mx-1" htmlFor="inputControls_asdfKeys">asdf Keys</label>
        </span>
      </fieldset>

      <fieldset className="m-4">
        <label className="m-2">Board Size:</label>
        <span className="m-2">
          <input type="radio" id="boardSize_16" name="boardSize" checked={gameOptions.boardSize === 16} onChange={e => setGameOption('boardSize', 16)} />
          <label className="mx-1" htmlFor="boardSize_16">16</label>
        </span>
        <span className="m-2">
          <input type="radio" id="boardSize_25" name="boardSize" checked={gameOptions.boardSize === 25} onChange={e => setGameOption('boardSize', 25)} />
          <label className="mx-1" htmlFor="boardSize_25">25</label>
        </span>
        <span className="m-2">
          <input type="radio" id="boardSize_50" name="boardSize" checked={gameOptions.boardSize === 50} onChange={e => setGameOption('boardSize', 50)} />
          <label className="mx-1" htmlFor="boardSize_50">50</label>
        </span>
      </fieldset>

      <fieldset className="m-4">
        <label className="m-2">Food Quantity:</label>
        <span className="m-2">
          <input type="radio" id="food_4" name="food" checked={gameOptions.foodAmount === 4} onChange={e => setGameOption('foodAmount', 4)} />
          <label className="mx-1" htmlFor="food_4">4</label>
        </span>
        <span className="m-2">
          <input type="radio" id="food_8" name="food" checked={gameOptions.foodAmount === 8} onChange={e => setGameOption('foodAmount', 8)} />
          <label className="mx-1" htmlFor="food_8">8</label>
        </span>
        <span className="m-2">
          <input type="radio" id="food_16" name="food" checked={gameOptions.foodAmount === 16} onChange={e => setGameOption('foodAmount', 16)} />
          <label className="mx-1" htmlFor="food_16">16</label>
        </span>
      </fieldset>
    </div>
  )
}

export default GameOptionsDialog
