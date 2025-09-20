import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";

function Resource() {
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
          Página de Recurso
        </Heading>

        {/* Subtítulo */}
        <Text fontSize="lg" color="gray.600">
          Aquí habrá información detallada sobre este recurso.
        </Text>

        {/* Mensaje de construcción */}
        <Box>
          <Text fontSize="xl" color="#00C0F3" fontWeight="semibold">
            🚧 Esta página está en construcción 🚧
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default Resource;
