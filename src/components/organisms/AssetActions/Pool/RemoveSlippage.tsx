import { FormikContextType, useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { FormRemoveData, slippagePresets } from '../../../../models/FormRemove'
import InputElement from '../../../atoms/Input/InputElement'
import styles from '../Trade/Slippage.module.css'

export default function RemoveSlippage(): ReactElement {
  // Connect with form
  const {
    setFieldValue,
    values
  }: FormikContextType<FormRemoveData> = useFormikContext()

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setFieldValue('slippage', e.target.value)
  }

  return (
    <>
      <div className={styles.slippage}>
        <strong>Expected price impact</strong>
        <InputElement
          name="slippage"
          type="select"
          size="mini"
          postfix="%"
          sortOptions={false}
          options={slippagePresets}
          value={values.slippage}
          onChange={handleChange}
        />
      </div>
    </>
  )
}
