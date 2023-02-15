import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    label: string;
    checked: boolean;
    setChecked: (newValue: boolean) => void;
}

export default function CheckBox({label, checked, setChecked}: Props) {
  return (
    <div className='flex items-center gap-2'>
        <input checked={checked} onChange={(e) => {
            setChecked(e.target.checked)
        }} type={"checkbox"}/>
        <p>{label}</p>
    </div>
  )
}