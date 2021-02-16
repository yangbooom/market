import TokenBalance from '../@types/TokenBalance'

export interface FormRemoveData extends TokenBalance {
  type: 'remove'
  slippage: string
}

export interface TradeItem {
  amount: number
  token: string
  maxAmount: number
}

export const initialValues: FormRemoveData = {
  ocean: undefined,
  datatoken: undefined,
  type: 'remove',
  slippage: '5'
}

export const slippagePresets = ['5', '10', '15', '25', '50']
