import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Divider,
  Badge,
  Stack,
  Link,
  Card,
  CardBody,
} from "@chakra-ui/react";

function AboutUs() {
  return (
    <Box
      minH="100vh"
      bg="white"
      userSelect="none"
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 6 }}
    >
      <Container maxW="4xl">
        <VStack spacing={6} textAlign="center">
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
            El <strong>TC-625 “Lenguas y tradiciones orales de Costa Rica”</strong>, adscrito a la
            Escuela de Filología, Lingüística y Literatura y a la Vicerrectoría de Acción Social de
            la <strong>Universidad de Costa Rica</strong>, es un proyecto de trabajo comunal universitario
            que colabora con miembros de diversas comunidades etnolingüísticas del país con el
            objetivo de fortalecer la presencia de sus lenguas y culturas autóctonas mediante
            iniciativas de <em>fortalecimiento</em>, <em>promoción</em>, <em>documentación</em>,
            <em> visibilización</em>, <em>revalorización</em>, <em>enseñanza</em> y
            <em> revitalización</em>.
          </Text>
        </VStack>

        <Divider my={10} />

        {/* Tarjeta de detalle */}
        <Card
          variant="outline"
          borderColor="gray.200"
          borderRadius="2xl"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          <CardBody p={{ base: 6, md: 8 }}>
            <Stack spacing={6}>
              <Box>
                <Heading size="md" color="black" mb={2}>
                  Propósito
                </Heading>
                <Text color="gray.700" lineHeight="1.7">
                  Impulsar acciones colaborativas con comunidades etnolingüísticas de Costa Rica
                  para preservar, enseñar y revitalizar las lenguas y tradiciones orales, promoviendo
                  su visibilidad y revalorización en espacios académicos y comunitarios.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color="black" mb={2}>
                  Adscripción
                </Heading>
                <Text color="gray.700">
                  Escuela de Filología, Lingüística y Literatura &middot; Vicerrectoría de Acción Social
                  &middot; Universidad de Costa Rica.
                </Text>
              </Box>

              <Box>
                <Heading size="md" color="black" mb={2}>
                  Coordinación
                </Heading>
                <Text color="gray.800" fontWeight="semibold">
                  Luis Serrato Pineda
                </Text>
              </Box>

              <Box>
                <Heading size="md" color="black" mb={2}>
                  Contacto
                </Heading>
                <VStack align="start" spacing={1}>
                  <Link
                    href="mailto:dipalicori.efll@ucr.ac.cr"
                    color="#00C0F3"
                    _hover={{ textDecoration: "underline", color: "#0099CC" }}
                  >
                    dipalicori.efll@ucr.ac.cr
                  </Link>
                  <Link
                    href="mailto:TC625.EFLL@ucr.ac.cr"
                    color="#00C0F3"
                    _hover={{ textDecoration: "underline", color: "#0099CC" }}
                  >
                    TC625.EFLL@ucr.ac.cr
                  </Link>
                </VStack>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default AboutUs;
