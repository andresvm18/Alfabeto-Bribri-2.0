import { Box, Heading, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import LetterCard from '../Components/LetterCard';
import { supabase } from '../../supabaseClient';

function Alphabet() {
  const [letters, setLetters] = useState({
    vowels: [],
    consonants: [],
    tones: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para ordenar por número en el ID
  const sortById = (arr) => {
    return arr.sort((a, b) => {
      const numA = parseInt(a.id.split('-')[1], 10);
      const numB = parseInt(b.id.split('-')[1], 10);
      return numA - numB;
    });
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        // Obtener vocales
        const { data: vowels } = await supabase
          .from('Alfabeto')
          .select('*')
          .eq('type', 'vowel');


        // Obtener consonantes
        const { data: consonants } = await supabase
          .from('Alfabeto')
          .select('*')
          .eq('type', 'consonant');

        // Obtener tonos
        const { data: tones } = await supabase
          .from('Alfabeto')
          .select('*')
          .eq('type', 'tone');

        setLetters({
          vowels: sortById(vowels || []),
          consonants: sortById(consonants || []),
          tones: sortById(tones || [])
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
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#00C0F3"
          size="xl"
          mb={4}
        />
        <Heading as="h2" size="md" color="black" userSelect={"none"}>
          Cargando...
        </Heading>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={8}>
        <Heading color="black">Error: {error}</Heading>
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
        Alfabeto Bribri
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="blackAlpha" align="center">
        <TabList mb={8}>
          <Tab color="black" _selected={{ color: 'white', bg: '#00C0F3' }}>Vocales</Tab>
          <Tab color="black" _selected={{ color: 'white', bg: '#00C0F3' }}>Consonantes</Tab>
          <Tab color="black" _selected={{ color: 'white', bg: '#00C0F3' }}>Tonos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={8}
              maxW="1200px"
              mx="auto"
            >
              {letters.vowels.map((letter) => (
                <LetterCard
                  key={`vowel-${letter.id}`}
                  character={letter.letter}
                  pronunciation={letter.pronunciation}
                  textColor="black"
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={8}
              maxW="1200px"
              mx="auto"
            >
              {letters.consonants.map((letter) => (
                <LetterCard
                  key={`consonant-${letter.id}`}
                  character={letter.letter}
                  pronunciation={letter.pronunciation}
                  textColor="black"
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3 }}
              spacing={8}
              maxW="900px"
              mx="auto"
            >
              {letters.tones.map((tone) => (
                <LetterCard
                  key={`tone-${tone.id}`}
                  character={tone.letter}
                  pronunciation={tone.pronunciation}
                  textColor="black"
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Alphabet;
