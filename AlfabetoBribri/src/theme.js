import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const fonts = {
  heading: `'Arial', sans-serif`,
  body: `'Arial', sans-serif`,
}

const theme = extendTheme({ config, fonts })

export default theme