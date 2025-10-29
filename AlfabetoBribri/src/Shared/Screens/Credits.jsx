import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Divider,
  Card,
  CardBody,
  Stack,
  List,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";

function Credits() {
  return (
    <Box
      minH="100vh"
      bg="white"
      userSelect="none"
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 6 }}
    >
      <Container maxW="4xl">
        {/* Encabezado */}
        <VStack spacing={4} textAlign="center" mb={2}>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
            Reconocimientos a las personas y equipos que hicieron posible este recurso.
          </Text>
        </VStack>

        <Divider my={8} />

        {/* Tarjeta principal de créditos */}
        <Card
          variant="outline"
          borderColor="gray.200"
          borderRadius="2xl"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          <CardBody p={{ base: 6, md: 8 }}>
            <Stack spacing={6}>
              {/* Desarrollo */}
              <Box>
                <Heading size="md" color="black" mb={2}>
                  Desarrollo del sitio web
                </Heading>
                <Text color="gray.700" lineHeight="1.7">
                  Paula Camacho González, Andrés Víquez Marchena y Jorge Quirós Anderson
                </Text>
              </Box>

              {/* Diseño gráfico */}
              <Box>
                <Heading size="md" color="black" mb={2}>
                  Diseño gráfico
                </Heading>
                <Text color="gray.700" lineHeight="1.7">
                  Laura Jiménez Cubillo
                </Text>
              </Box>

              {/* Ilustraciones */}
              <Box>
                <Heading size="md" color="black" mb={3}>
                  Ilustraciones
                </Heading>

                <OrderedList spacing={3} pl={5} color="gray.800">
                  <ListItem>
                    <Text as="span" fontWeight="semibold">
                      Del cuerpo humano:
                    </Text>{" "}
                    Ana Carolina Fernández Barboza (tomadas de{" "}
                    <em>Seˈ apà. Diccionario pictográfico del cuerpo humano en bribri</em>).
                    <Text as="span" display="block" mt={1}>
                      <Text as="span" fontWeight="semibold">
                        Modificación de ilustraciones del cuerpo humano:
                      </Text>{" "}
                      Laura Jiménez Cubillo y Carina Elizondo Valverde.
                    </Text>
                  </ListItem>

                  <ListItem>
                    <Text as="span" fontWeight="semibold">
                      De la casa tradicional y objetos comunes en esta:
                    </Text>{" "}
                    Diego Zúñiga Espinoza (tomadas de{" "}
                    <em>Ù. Diccionario pictográfico de la casa tradicional bribri</em>).
                  </ListItem>

                  <ListItem>
                    <Text as="span" fontWeight="semibold">
                      De animales:
                    </Text>{" "}
                    Pamela Zamora Miranda, Marian Cerdas Chavarría, Francella Artavia Hernández,
                    Ana Carolina Fernández Barboza, Eduardo Vargas Montero, Kevin Mora Molina
                    (tomadas de{" "}
                    <em>Íyiwak. Diccionario pictográfico de los animales en bribri</em>).
                  </ListItem>

                  <ListItem>
                    <Text as="span" fontWeight="semibold">
                      De alimentos:
                    </Text>{" "}
                    Fabiola Cordero Cantillo, Nathalia Valerín Vargas, Fabián Bolaños Villegas,
                    Francini Gómez Calderón (tomadas de{" "}
                    <em>Seˈ má. Diccionario-Recetario de la alimentación tradicional bribri</em>).
                  </ListItem>

                  <ListItem>
                    <Text as="span" fontWeight="semibold">
                      Otras:
                    </Text>{" "}
                    Daniela Rodríguez Minsky, Nathalia Valerín Vargas, Mariela Ugarte Rojas
                    (tomadas de{" "}
                    <em>Seˈ dalì. Diccionario y enciclopedia de la agricultura tradicional bribri</em>);
                    Silvia Mora Valverde (tomadas de{" "}
                    <em>Tté shtáwo̠k. Los números en lengua bribri</em>); Carina Elizondo Valverde y
                    Valeria Hutchison Martínez (tomadas de{" "}
                    <em>Wö̀a(t). Colores en lengua bribri</em>).
                  </ListItem>
                </OrderedList>
              </Box>

              {/* Asesorías */}
              <Box>
                <Heading size="md" color="black" mb={2}>
                  Asesoría lingüístico-cultural
                </Heading>
                <Text color="gray.700" lineHeight="1.7">
                  Alí García Segura
                </Text>
              </Box>

              <Box>
                <Heading size="md" color="black" mb={2}>
                  Asesoría lingüística y didáctica
                </Heading>
                <Text color="gray.700" lineHeight="1.7">
                  Carlos Sanchez Avendaño
                </Text>
              </Box>

              {/* Coordinación */}
              <Box>
                <Heading size="md" color="black" mb={2}>
                  Diseño del recurso, adecuación y revisión lingüística, y coordinación general
                </Heading>
                <Text color="gray.700" lineHeight="1.7">
                  Luis Serrato Pineda
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default Credits;
