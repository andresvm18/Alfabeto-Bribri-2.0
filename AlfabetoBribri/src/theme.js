import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const fonts = {
  heading: `'Noto Sans', sans-serif`,
  body: `'Noto Sans', sans-serif`,
}

const theme = extendTheme({ config, fonts })

export default theme
