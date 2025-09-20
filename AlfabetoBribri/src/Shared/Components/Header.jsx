import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
  Container,
  Text,
  Divider,
  Image,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import LogoUCR from "../../Assets/FirmaUCR.png"

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Para el menú móvil
  const location = useLocation(); // Hook para obtener la ruta actual

  const links = [
    { label: 'Alfabeto bribri', to: '/alfabeto' },
    { label: 'Práctica', to: '/aprende' },
    { label: 'Sobre este recurso', to: '/recurso' }, // ToDo: Crear esta página
    { label: 'Créditos', to: '/creditos' }, // ToDo: Crear esta página
    { label: 'Acerca del TC-625', to: '/tc-625' }, // ToDo: Crear esta página
  ];

  const isActiveLink = (to) => location.pathname === to;

  return (
    <Box
      bg="#00C0F3"
      color="black"
      boxShadow="0 4px 12px rgba(0, 93, 164, 0.15)"
      position="sticky"
      top="0"
      zIndex="1000"
      userSelect="none"
      width="100%"
    >
      <Box maxW="100%" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
        <Flex  h={{ base: 24, md: 28 }} alignItems="center" justifyContent="space-between">
          <HStack spacing={4} align="center" flex="1">
            <Link
              as={RouterLink}
              to="/"
              _hover={{ textDecoration: 'none', transform: 'scale(1.02)' }}
              transition="all 0.2s ease"
              color="black"
            >
              <HStack spacing={3}>
                <Image
                  src={LogoUCR}
                  alt="Logo UCR"
                  height="40px"
                  objectFit="contain"
                />
                <VStack spacing={0} align="start">
                  <Heading
                    size={{ base: "md", xl: "lg" }}
                    fontWeight="bold"
                    letterSpacing="tight"
                    color="black"
                  >
                    Seˈ (uj)tö̀ shtók
                  </Heading>
                  <Text
                    fontSize={{ base: "xs", md: "sm", lg: "md" }}
                    color="black"
                    fontWeight="medium"
                  >
                    Alfabeto Bribri
                  </Text>
                </VStack>
              </HStack>
            </Link>

            <HStack
              as="nav"
              spacing={0}
              display={{ base: 'none', md: 'flex' }}
              ml={8}
            >
              {links.map((link) => (
                <Link
                  key={link.to}
                  as={RouterLink}
                  to={link.to}
                  px={4}
                  py={2}
                  mx={1}
                  borderRadius="md"
                  fontWeight="medium"
                  fontSize={{ base: "sm", lg: "md", xl: "lg" }}
                  position="relative"
                  bg={isActiveLink(link.to) ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  color="black"
                  _hover={{
                    textDecoration: 'none',
                    bg: 'rgba(0,0,0,0.1)',
                    color: 'black',
                    transform: 'translateY(-1px)'
                  }}
                  _active={{
                    transform: 'translateY(0px)'
                  }}
                  transition="all 0.2s ease"
                >
                  {link.label}
                  {isActiveLink(link.to) && (
                    <Box
                      position="absolute"
                      bottom="-2px"
                      left="50%"
                      transform="translateX(-50%)"
                      w="80%"
                      h="2px"
                      bg="black"
                      borderRadius="full"
                    />
                  )}
                </Link>
              ))}
            </HStack>
          </HStack>

          <IconButton
            size="lg"
            icon={isOpen ? <CloseIcon boxSize={4} color="black" /> : <HamburgerIcon boxSize={5} color="black" />}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            bg="rgba(0,0,0,0.1)"
            border="1px solid rgba(0,0,0,0.2)"
            color="black"
            _hover={{
              bg: 'rgba(0,0,0,0.2)',
              transform: 'scale(1.05)'
            }}
            _active={{
              transform: 'scale(0.95)'
            }}
            transition="all 0.2s ease"
          />
        </Flex>
      </Box>

      {isOpen && (
        <Box
          display={{ md: 'none' }}
          bg="#00C0F3"
          backdropFilter="blur(10px)"
          borderTop="1px solid rgba(0,0,0,0.1)"
        >
          <Box maxW="100%" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
            <Stack spacing={0} py={4}>
              {links.map((link, index) => (
                <Box key={link.to}>
                  <Link
                    as={RouterLink}
                    to={link.to}
                    display="block"
                    px={4}
                    py={3}
                    fontWeight="medium"
                    bg={isActiveLink(link.to) ? 'rgba(0,0,0,0.1)' : 'transparent'}
                    color="black"
                    _hover={{
                      textDecoration: 'none',
                      bg: 'rgba(0,0,0,0.1)',
                      color: 'black',
                      pl: 6
                    }}
                    onClick={onClose}
                    transition="all 0.2s ease"
                    position="relative"
                  >
                    <HStack justify="space-between">
                      <Text color="black">{link.label}</Text>
                      {isActiveLink(link.to) && (
                        <Box
                          w="4px"
                          h="4px"
                          bg="black"
                          borderRadius="full"
                        />
                      )}
                    </HStack>
                  </Link>
                  {index < links.length - 1 && (
                    <Divider
                      borderColor="rgba(0,0,0,0.1)"
                      mx={4}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Header;
