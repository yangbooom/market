import React, { ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useStaticQuery, graphql } from 'gatsby'
import { DDO } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import compareAsBN from '../../../../utils/compareAsBN'
import ButtonBuy from '../../../atoms/ButtonBuy'
import PriceOutput from './PriceOutput'
import { useAsset } from '../../../../providers/Asset'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { BestPrice } from '../../../../models/BestPrice'

const contentQuery = graphql`
  query StartComputeDatasetQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/startComputeDataset.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            description
            form {
              success
              successAction
              error
              data {
                name
                label
                help
                type
                required
                sortOptions
                options
              }
            }
          }
        }
      }
    }
  }
`

export default function FormStartCompute({
  algorithms,
  ddoListAlgorithms,
  setSelectedAlgorithm,
  isLoading,
  isComputeButtonDisabled,
  hasPreviousOrder,
  hasDatatoken,
  dtBalance,
  datasetLowPoolLiquidity,
  assetType,
  assetTimeout,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetLowPoolLiquidity,
  selectedComputeAssetType,
  selectedComputeAssetTimeout,
  stepText,
  algorithmPrice,
  isConsumable,
  consumableFeedback
}: {
  algorithms: AssetSelectionAsset[]
  ddoListAlgorithms: DDO[]
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<DDO>>
  isLoading: boolean
  isComputeButtonDisabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  dtBalance: string
  datasetLowPoolLiquidity: boolean
  assetType: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetLowPoolLiquidity?: boolean
  selectedComputeAssetType?: string
  selectedComputeAssetTimeout?: string
  stepText: string
  algorithmPrice: BestPrice
  isConsumable: boolean
  consumableFeedback: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const { isValid, values }: FormikContextType<{ algorithm: string }> =
    useFormikContext()
  const { price, ddo, isAssetNetwork } = useAsset()
  const [totalPrice, setTotalPrice] = useState(price?.value)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>(false)
  const { accountId, balance } = useWeb3()
  const { ocean } = useOcean()
  const [algorithmConsumableStatus, setAlgorithmConsumableStatus] =
    useState<number>()

  function getAlgorithmAsset(algorithmId: string): DDO {
    let assetDdo = null
    ddoListAlgorithms.forEach((ddo: DDO) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  useEffect(() => {
    if (!values.algorithm) return
    const algorithmDDO = getAlgorithmAsset(values.algorithm)
    setSelectedAlgorithm(algorithmDDO)

    if (!accountId || !isConsumable) return
    async function checkIsConsumable() {
      const consumable = await ocean.assets.isConsumable(
        algorithmDDO,
        accountId.toLowerCase()
      )
      if (consumable) setAlgorithmConsumableStatus(consumable.status)
    }
    checkIsConsumable()
  }, [values.algorithm, accountId, isConsumable])

  //
  // Set price for calculation output
  //
  useEffect(() => {
    if (!price || !algorithmPrice) return

    const priceDataset =
      hasPreviousOrder || hasDatatoken ? 0 : Number(price.value)
    const priceAlgo =
      hasPreviousOrderSelectedComputeAsset || hasDatatokenSelectedComputeAsset
        ? 0
        : Number(algorithmPrice.value)

    setTotalPrice(priceDataset + priceAlgo)
  }, [
    price,
    algorithmPrice,
    hasPreviousOrder,
    hasDatatoken,
    hasPreviousOrderSelectedComputeAsset,
    hasDatatokenSelectedComputeAsset
  ])

  useEffect(() => {
    if (!totalPrice) return
    setIsBalanceSufficient(
      compareAsBN(balance.ocean, `${totalPrice}`) || Number(dtBalance) >= 1
    )
  }, [totalPrice])

  return (
    <Form className={styles.form}>
      {content.form.data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          options={algorithms}
          component={Input}
        />
      ))}

      <PriceOutput
        hasPreviousOrder={hasPreviousOrder}
        assetTimeout={assetTimeout}
        hasPreviousOrderSelectedComputeAsset={
          hasPreviousOrderSelectedComputeAsset
        }
        hasDatatoken={hasDatatoken}
        selectedComputeAssetTimeout={selectedComputeAssetTimeout}
        hasDatatokenSelectedComputeAsset={hasDatatokenSelectedComputeAsset}
        algorithmPrice={algorithmPrice}
        totalPrice={totalPrice}
      />

      <ButtonBuy
        action="compute"
        disabled={
          isComputeButtonDisabled ||
          !isValid ||
          !isBalanceSufficient ||
          !isAssetNetwork ||
          algorithmConsumableStatus > 0
        }
        hasPreviousOrder={hasPreviousOrder}
        hasDatatoken={hasDatatoken}
        dtSymbol={ddo.dataTokenInfo.symbol}
        dtBalance={dtBalance}
        datasetLowPoolLiquidity={datasetLowPoolLiquidity}
        assetTimeout={assetTimeout}
        assetType={assetType}
        hasPreviousOrderSelectedComputeAsset={
          hasPreviousOrderSelectedComputeAsset
        }
        hasDatatokenSelectedComputeAsset={hasDatatokenSelectedComputeAsset}
        dtSymbolSelectedComputeAsset={dtSymbolSelectedComputeAsset}
        dtBalanceSelectedComputeAsset={dtBalanceSelectedComputeAsset}
        selectedComputeAssetLowPoolLiquidity={
          selectedComputeAssetLowPoolLiquidity
        }
        selectedComputeAssetType={selectedComputeAssetType}
        stepText={stepText}
        isLoading={isLoading}
        type="submit"
        priceType={price?.type}
        algorithmPriceType={algorithmPrice?.type}
        isBalanceSufficient={isBalanceSufficient}
        isConsumable={isConsumable}
        consumableFeedback={consumableFeedback}
        algorithmConsumableStatus={algorithmConsumableStatus}
      />
    </Form>
  )
}
