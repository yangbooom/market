import {
  Account,
  Logger,
  Ocean,
  ConfigHelper,
  ConfigHelperConfig,
  ConfigHelperNetworkId,
  ConfigHelperNetworkName
} from '@oceanprotocol/lib'
import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'

import { UserBalance } from '../@types/TokenBalance'

/* deleted by w.chun
export function getOceanConfig(
  network: ConfigHelperNetworkName | ConfigHelperNetworkId
): ConfigHelperConfig {
  return new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      // add for ganache by w.chun
      network === 1337 ||
      network === 137 ||
      network === 'moonbeamalpha' ||
      network === 1287
      ? undefined
      : process.env.GATSBY_INFURA_PROJECT_ID
  ) as ConfigHelperConfig
}
*/

export function getDevelopmentConfig(): Partial<ConfigHelperConfig> {
  return {
    factoryAddress: contractAddresses.development?.DTFactory,
    poolFactoryAddress: contractAddresses.development?.BFactory,
    fixedRateExchangeAddress: contractAddresses.development?.FixedRateExchange,
    metadataContractAddress: contractAddresses.development?.Metadata,
    oceanTokenAddress: contractAddresses.development?.Ocean,
    // There is no subgraph in barge so we hardcode the Rinkeby one for now
    subgraphUri: 'https://subgraph.rinkeby.oceanprotocol.com'
  }
}

export function getOceanConfig(network: string | number): ConfigHelperConfig {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      // add for ganache by w.chun
      network === 'development' ||
      network === 8996 ||
      network === 1337 ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000
      ? undefined
      : process.env.GATSBY_INFURA_PROJECT_ID
  ) as ConfigHelperConfig
  if (network === 1337 || network === 8996 || network === 'development') {
    const myconfig = {
      ...config,
      ...getDevelopmentConfig()
    }
    Logger.log(
      `getOceanConfig(network=${network}) returns myconfig = ${JSON.stringify(
        myconfig
      )}`
    )
    return myconfig as ConfigHelperConfig
  }
  return config as ConfigHelperConfig
}

export const getUserInfo = async (
  ocean: Ocean
): Promise<{ account: Account; balance: UserBalance }> => {
  if (!ocean) return { account: null, balance: { eth: '0', ocean: '0' } }

  const account = (await ocean.accounts.list())[0]
  Logger.log('[ocean] Account: ', account)

  const balance = {
    eth: await account.getEtherBalance(),
    ocean: await account.getOceanBalance()
  }
  Logger.log('[ocean] Balance: ', JSON.stringify(balance))

  return { account, balance }
}
