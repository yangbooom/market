import { Logger } from '@oceanprotocol/lib'

export interface EthereumListsChain {
  name: string
  chainId: number
  shortName: string
  chain: string
  network: string
  networkId: number
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpc: string[]
  faucets: string[]
  infoURL: string
}

export interface NetworkObject {
  chainId: number
  name: string
  urlList: string[]
}

export function accountTruncate(account: string): string {
  if (!account) return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkDisplayName(
  data: EthereumListsChain,
  networkId: number
): string {
  //  const displayName = data
  //    ? `${data.chain} ${data.network === 'mainnet' ? '' : data.network}`
  //    : networkId === 1337
  //    ? 'Development'
  //    : 'Unknown'
  let displayName
  switch (networkId) {
    case 1287:
      displayName = 'Moonbase Alpha'
      break
    case 137:
      displayName = 'Polygon'
      break
    case 80001:
      displayName = 'Polygon Mumbai'
      break
    case 8996:
      displayName = 'Development'
      break
    // inserted for Ganache by w.chun
    case 1337:
      displayName = 'Ganache'
      break
    default:
      displayName = data
        ? `${data.chain} ${data.network === 'mainnet' ? '' : data.network}`
        : 'Unknown'
      break
  }
  return displayName
}

// inserted for Ganache by w.chun
// const configGanache = getOceanConfig(1337)
const networkGanache = {
  name: 'Ganache Testnet',
  chainId: 1337,
  shortName: 'Ganache',
  chain: 'Ganache',
  network: 'testnet',
  networkId: 8996,
  nativeCurrency: { name: 'ETHER', symbol: 'ETH', decimals: 18 },
  rpc: [`http://localhost:8545/`],
  faucets: [`http://localhost:8545/`],
  infoURL: 'http://localhost:8545/'
}

export function getNetworkData(
  data: { node: EthereumListsChain }[],
  networkId: number
): EthereumListsChain {
  if (!networkId) {
    Logger.log('networkId is null')
    return
  }
  // by w.chun
  if (networkId === 8996) return networkGanache
  const networkData = data.filter(
    ({ node }: { node: EthereumListsChain }) => node.networkId === networkId
  )[0]
  return networkData.node
}

export function addCustomNetwork(
  web3Provider: any,
  network: NetworkObject
): void {
  const newNewtworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: network.name,
    rpcUrls: network.urlList
  }
  web3Provider.request(
    {
      method: 'wallet_addEthereumChain',
      params: [newNewtworkData]
    },
    (err: string, added: any) => {
      if (err || 'error' in added) {
        Logger.error(
          `Couldn't add ${network.name} (0x${
            network.chainId
          }) netowrk to MetaMask, error: ${err || added.error}`
        )
      } else {
        Logger.log(
          `Added ${network.name} (0x${network.chainId}) network to MetaMask`
        )
      }
    }
  )
}

export async function addTokenToWallet(
  web3Provider: any,
  address: string,
  symbol: string,
  logo?: string
): Promise<void> {
  const image =
    logo ||
    'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png'
  const tokenMetadata = {
    type: 'ERC20',
    options: { address, symbol, image, decimals: 18 }
  }
  web3Provider.sendAsync(
    {
      method: 'wallet_watchAsset',
      params: tokenMetadata,
      id: Math.round(Math.random() * 100000)
    },
    (err: { code: number; message: string }, added: any) => {
      if (err || 'error' in added) {
        Logger.error(
          `Couldn't add ${tokenMetadata.options.symbol} (${
            tokenMetadata.options.address
          }) to MetaMask, error: ${err.message || added.error}`
        )
      } else {
        Logger.log(
          `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
        )
      }
    }
  )
}
