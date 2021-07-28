import { useMemo } from 'react'
import ReactNipple from 'react-nipple';
import KeyboardEventHandler from 'react-keyboard-event-handler'

function InputControls({
  onDirectionChange = angle => { },
  onPause = () => { },
  keyboardProfile = { id: 'arrowKeys', keyMap: { left: 'left', up: 'up', right: 'right', down: 'down' } },
  initialAngle = 'right'
}) {

  const onNippleMove = (e, data) => {
    if (data && data.direction && data.direction.angle) {
      onDirectionChange(data.direction.angle)
    } else {
      console.log("missing data in InputControls", data)
    }
  }

  const handleKeyDown = (key, e) => {
    let plainKey = key.split('+').pop()
    if (Object.keys(keyboardProfile.keyMap).includes(plainKey)) {
      plainKey = keyboardProfile.keyMap[plainKey]
    }
    if (plainKey === 'p') {
      onPause()
    } else if (['left', 'up', 'right', 'down'].includes(plainKey)) {
      onDirectionChange(plainKey)
    }
  }


  const inputKeys = useMemo(() => {
    return ['p', ...Object.keys(keyboardProfile.keyMap)]
      .map(key => [key, 'ctrl+' + key, 'shift+' + key, 'meta+' + key, 'alt+' + key]).flat()
  }, [keyboardProfile.keyMap])

  return <>
    <KeyboardEventHandler
      handleKeys={inputKeys}
      onKeyEvent={handleKeyDown}
    />

    <div className="fixed bottom-24 right-24">
      <ReactNipple
        options={{
          mode: 'static',
          position: { top: '50%', left: '50%' }
        }}
        onMove={onNippleMove}
      />
    </div>
  </>
}

export default InputControls