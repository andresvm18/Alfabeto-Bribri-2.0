import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";

function Credits() {
  return (
    <Box
      minH="100vh"
      bg="white"
      position="relative"
      overflow="hidden"
      userSelect="none"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <VStack spacing={6} textAlign="center">
        {/* Título principal */}
        <Heading size="2xl" color="black">
          Créditos
        </Heading>

        {/* Subtítulo */}
        <Text fontSize="lg" color="gray.600">
          Aquí se mostrarán los créditos y agradecimientos de este recurso.
        </Text>

        {/* Imagen y mensaje de construcción */}
        <Box>
          <Text fontSize="xl" color="#00C0F3" fontWeight="semibold">
            🚧 Esta página está en construcción 🚧
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default Credits;
