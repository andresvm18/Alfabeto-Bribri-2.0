import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const fonts = {
  heading: `'Arial', sans-serif`,
  body: `'Arial', sans-serif`,
}

const fontSizes = {
  xs: "0.9rem",
  sm: "1rem",
  md: "1.25rem",   // tamaño base
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "3.5rem",
  "5xl": "4rem",
  "6xl": "4.5rem",
}

const theme = extendTheme({ config, fonts, fontSizes })

export default theme
