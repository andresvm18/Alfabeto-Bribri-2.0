import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  Heading,
  Link,
  Icon,
  Divider,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiCode,
  FiLayout,
  FiGlobe
} from 'react-icons/fi';
import LogoUCR from "../../Assets/LogoUCR.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="#323232" color="white" userSelect="none">
      {/* Contenido principal del footer */}
      <Box py={12}>
        <Box maxW="1200px" mx="auto" px={6}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>

            {/* Sección de Logo y Descripción */}
            <VStack align="flex-start" spacing={6}>
              <Box>
                <Image
                  src={LogoUCR}
                  alt="Universidad de Costa Rica"
                  maxW="220px"
                  w="auto"
                  height="auto"
                  filter="brightness(1.1)"
                  transition="all 0.3s ease"
                  _hover={{ filter: "brightness(1.3)" }}
                />
              </Box>

              <VStack align="flex-start" spacing={3}>
                <HStack spacing={2}>
                  <Icon as={FiGlobe} color="teal.300" />
                  <Text fontSize="lg" fontWeight="semibold" color="white">
                    Alfabeto Bribrí
                  </Text>
                </HStack>

                <Text fontSize="sm" color="gray.300" lineHeight="1.6" maxW="300px">
                  Plataforma educativa desarrollada por TC-625 Lenguas y tradiciones orales de Costa Rica
                  dedicada a preservar, enseñar y promover  el idioma Bribri, contribuyendo a la conservación del patrimonio
                  cultural costarricense.
                </Text>
              </VStack>
            </VStack>

            {/* Sección de Equipo */}
            <VStack align="flex-start" spacing={6}>
              <HStack spacing={2}>
                <Icon as={FiUsers} color="teal.300" />
                <Heading as="h3" size="md" color="white">Nuestro Equipo</Heading>
              </HStack>

              <VStack align="flex-start" spacing={4} w="100%">
                {/* Desarrolladores */}
                <Box>
                  <HStack spacing={2} mb={3}>
                    <Icon as={FiCode} color="orange.300" boxSize={4} />
                    <Text fontWeight="semibold" color="white" fontSize="sm">
                      Desarrollo
                    </Text>
                  </HStack>
                  <VStack align="flex-start" spacing={2} pl={6}>
                    {[
                      "Andrés Sebastián Víquez Marchena",
                      "Paula Melissa Camacho González",
                    ].map((name, index) => (
                      <Text key={index} fontSize="xs" color="gray.300" lineHeight="1.4">
                        {name}
                      </Text>
                    ))}
                  </VStack>
                </Box>

                {/* Colaboradores */}
                <Box>
                  <HStack spacing={2} mb={3}>
                    <Icon as={FiLayout} color="pink.300" boxSize={4} />
                    <Text fontWeight="semibold" color="white" fontSize="sm">
                      Diseño Gráfico
                    </Text>
                  </HStack>
                  <VStack align="flex-start" spacing={2} pl={6}>
                    <Text fontSize="xs" color="gray.300">Laura Jesús Jiménez Cubillo</Text>
                  </VStack>
                </Box>
              </VStack>
            </VStack>

            {/* Sección de Contacto */}
            <VStack align="flex-start" spacing={6}>
              <HStack spacing={2}>
                <Icon as={FiMail} color="teal.300" />
                <Heading as="h3" size="md" color="white">Contacto</Heading>
              </HStack>

              <VStack align="flex-start" spacing={4} w="100%">
                {/* Email */}
                <HStack spacing={3}>
                  <Icon as={FiMail} color="gray.400" boxSize={4} />
                  <Text fontSize="sm" color="gray.300">
                    <Link
                      href="mailto:tc625.efll@ucr.ac.cr"
                      color="teal.300"
                      _hover={{ color: "teal.200", textDecoration: "underline" }}
                      transition="color 0.2s ease"
                    >
                      tc625.efll@ucr.ac.cr
                    </Link>
                  </Text>
                </HStack>

                {/* Teléfono */}
                <HStack spacing={3}>
                  <Icon as={FiPhone} color="gray.400" boxSize={4} />
                  <Text fontSize="sm" color="gray.300">
                    +506 8888 8888
                  </Text>
                </HStack>

                {/* Dirección */}
                <HStack spacing={3} align="flex-start">
                  <Icon as={FiMapPin} color="gray.400" boxSize={4} mt={0.5} />
                  <VStack align="flex-start" spacing={1}>
                    <Text fontSize="sm" color="gray.300">
                      Universidad de Costa Rica
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      San José, Costa Rica
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Divider */}
      <Divider borderColor="gray.600" />

      {/* Copyright */}
      <Box py={6}>
        <Box maxW="1200px" mx="auto" px={6}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="sm" color="gray.400" textAlign="center">
              &copy; {currentYear} Alfabeto Bribri.
            </Text>

          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;