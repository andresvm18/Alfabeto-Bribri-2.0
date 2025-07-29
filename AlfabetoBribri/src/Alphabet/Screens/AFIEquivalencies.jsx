import { Box, Heading, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import AFICard from '../Components/AFICard';
import { supabase } from '../../supabaseClient';
import { Spinner } from "@chakra-ui/react";

function AFIEquivalencies() {
  const [letters, setLetters] = useState({
    vowels: [],
    consonants: [],
    tones: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const { data: vowels } = await supabase
          .from('Alfabeto')
          .select('*')
          .eq('type', 'vowel');

        const { data: consonants } = await supabase
          .from('Alfabeto')
          .select('*')
          .eq('type', 'consonant');

        const { data: tones } = await supabase
          .from('Alfabeto')
          .select('*')
          .eq('type', 'tone');

        setLetters({
          vowels: vowels || [],
          consonants: consonants || [],
          tones: tones || []
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching letters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) {
    return (
      <Box
        minH="100vh"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        userSelect="none"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#00C0F3"
          size="xl"
          mb={4}
        />
        <Heading as="h2" size="md" color="black">
          Cargando...
        </Heading>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={8}>
        <Heading color="red.500">Error: {error}</Heading>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      w="100%"
      p={8}
      bg="gray.50"
      userSelect={"none"}
    >
      <Heading as="h1" size="xl" mb={8} textAlign="center" color="black">
        Equivalencias AFI
      </Heading>

      <Tabs
        variant="soft-rounded"
        align="center"
        colorScheme="twitter"
        sx={{
          ".chakra-tabs__tab[aria-selected=true]": { bg: "#00C0F3", color: "white" },
          ".chakra-tabs__tab": { color: "black" }
        }}
      >
        <TabList mb={8}>
          <Tab>Vocales</Tab>
          <Tab>Consonantes</Tab>
          <Tab>Tonos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8} maxW="1200px" mx="auto">
              {letters.vowels.map((letter) => (
                <AFICard
                  key={`vowel-${letter.id}`}
                  character={letter.letter}
                  pronunciation={letter.pronunciation}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8} maxW="1200px" mx="auto">
              {letters.consonants.map((letter) => (
                <AFICard
                  key={`consonant-${letter.id}`}
                  character={letter.letter}
                  pronunciation={letter.pronunciation}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8} maxW="900px" mx="auto">
              {letters.tones.map((tone) => (
                <AFICard
                  key={`tone-${tone.id}`}
                  character={tone.letter}
                  pronunciation={tone.pronunciation}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default AFIEquivalencies;
