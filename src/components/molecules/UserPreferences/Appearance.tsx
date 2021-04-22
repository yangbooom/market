import React, { ReactElement, ChangeEvent } from 'react'
import { DarkMode } from 'use-dark-mode'
import FormHelp from '../../atoms/Input/Help'
import Label from '../../atoms/Input/Label'
import { ReactComponent as Moon } from '../../../images/moon.svg'
import { ReactComponent as Sun } from '../../../images/sun.svg'
import BoxSelection, { BoxSelectionOption } from '../FormFields/BoxSelection'
import Dotdotdot from 'react-dotdotdot'

export default function Appearance({
  darkMode
}: {
  darkMode: DarkMode
}): ReactElement {
  const options: BoxSelectionOption[] = [
    {
      name: 'Light',
      checked: !darkMode.value,
      title: (
        <Dotdotdot clamp={1} tagName="span">
          Light
        </Dotdotdot>
      ),
      icon: <Sun />
    },
    {
      name: 'Dark',
      checked: darkMode.value,
      title: (
        <Dotdotdot clamp={1} tagName="span">
          Dark
        </Dotdotdot>
      ),
      icon: <Moon />
    }
  ]

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.value === 'Dark' ? darkMode.enable() : darkMode.disable()
  }

  return (
    <li>
      <Label htmlFor="">Appearance</Label>
      <BoxSelection
        options={options}
        name="appearanceMode"
        handleChange={handleChange}
      />
      <FormHelp>Defaults to your OS setting, select to override.</FormHelp>
    </li>
  )
}
