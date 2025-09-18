import {
  Box,
  Heading,
  Text,
  Image,
  Stack,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
import BribriCommunity from "../../Assets/ComunidadBribri.jpg";
import BribriTerritory from "../../Assets/TerritorioBribri.jpeg";

function History() {
  return (
    <Box minH="100vh" w="100%" bg="gray.50" py={10} userSelect="none">
      <Container maxW="6xl">
        <Heading size="2xl" textAlign="center" color="black" mb={6}>
          Lengua Bribri y su Historia
        </Heading>
        <Text textAlign="center" color="black" mb={10} maxW="2xl" mx="auto" fontSize={{ base: "sm", sm: "md", lg: "md", xl: "lg" }}>
          La lengua Bribri es una de las lenguas indígenas más importantes de Costa Rica,{" "}
          hablada principalmente en Talamanca. Forma parte de la familia Chibcha y representa{" "}
          una herencia cultural viva que ha sido transmitida de generación en generación.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={10} mb={12}>
          <Image
            src={BribriCommunity}
            alt="Comunidad Bribrí"
            borderRadius="xl"
            boxShadow="lg"
            objectFit="cover"
          />
          <Stack spacing={4} justify="center">
            <Heading size="lg" color="black">
              Un legado cultural
            </Heading>
            <Text color="black" fontSize={{ base: "sm", sm: "md", lg: "md", xl: "lg" }}>
              El idioma es parte fundamental de la identidad Bribri. Cada palabra encierra{" "}
              conocimientos sobre la naturaleza, la espiritualidad y las tradiciones orales{" "}
              que definen a su pueblo. A pesar de los retos, comunidades y proyectos educativos{" "}
              trabajan para revitalizar la lengua y asegurar su preservación.
            </Text>
          </Stack>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={4} justify="center">
            <Heading size="lg" color="black">
              Historia y territorio
            </Heading>
            <Text color="black" fontSize={{ base: "sm", sm: "md", lg: "md", xl: "lg" }}>
              El territorio Bribri se ubica principalmente en la Cordillera de Talamanca,{" "}
              compartiendo raíces con otros pueblos de la familia lingüística Chibcha.{" "}
              Históricamente, su lengua se ha mantenido viva gracias a la tradición oral{" "}
              y al fuerte vínculo con la tierra, el río y las montañas.
            </Text>
          </Stack>
          <Image
            src={BribriTerritory}
            alt="Territorio Bribrí"
            borderRadius="xl"
            boxShadow="lg"
            objectFit="cover"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default History;
