import { useState, useMemo } from 'react'
import ReactNipple from 'react-nipple';
import KeyboardEventHandler from 'react-keyboard-event-handler'

function InputControls({
  onDirectionChange = angle => { },
  onEnter = () => { },
  onPause = () => { },
  keyboardProfile = { id: 'arrowKeys', keyMap: { left: 'left', up: 'up', right: 'right', down: 'down' } },
  initialAngle = 'right'
}) {
  const [angle, setAngle] = useState(initialAngle)

  const onNippleMove = (e, data) => {
    if (!data || !data.direction || !data.direction.angle) {
      console.log("missing data in InputControls", data)
      return
    }
    if (angle !== data.direction.angle) {
      setAngle(data.direction.angle)
      onDirectionChange(data.direction.angle)
    }
  }

  const handleKeyDown = (key, e) => {
    let plainKey = key.split('+').pop()
    if (Object.keys(keyboardProfile.keyMap).includes(plainKey)) {
      plainKey = keyboardProfile.keyMap[plainKey]
    }
    if (plainKey === 'enter') {
      onEnter()
    } else if (plainKey === 'p') {
      onPause()
    } else if (['left', 'up', 'right', 'down'].includes(plainKey)) {
      if (angle !== plainKey) {
        setAngle(plainKey)
        onDirectionChange(plainKey)
      }
    }
  }


  const inputKeys = useMemo(() => {
    return [
      ...Object.keys(keyboardProfile.keyMap),
      'p',
      'enter'
    ].map(key => [key, 'ctrl+' + key, 'shift+' + key, 'meta+' + key, 'alt+' + key]).flat()
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