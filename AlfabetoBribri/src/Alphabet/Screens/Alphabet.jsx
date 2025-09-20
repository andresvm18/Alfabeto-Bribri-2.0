import { 
  Box, Heading, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel, Spinner, Text, Link 
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import LetterCard from '../Components/LetterCard';
import { supabase } from '../../supabaseClient';

// Categorías en español para la URL y los Tabs
const CAT_TO_INDEX = { vocal: 0, consonante: 1, tono: 2 };
const INDEX_TO_CAT = ['vocal', 'consonante', 'tono'];

function Alphabet() {
  const [letters, setLetters] = useState({
    vowels: [],       // datos de BD: type === 'vowel'
    consonants: [],   // datos de BD: type === 'consonant'
    tones: [],        // datos de BD: type === 'tone'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  // categoría en español por defecto
  const catParam = searchParams.get('cat') ?? 'vocal';
  const tabIndex = CAT_TO_INDEX[catParam] ?? 0;

  // Ordena por el número del id (no muta el arreglo original)
  const sortById = (arr = []) =>
    [...arr].sort((a, b) => {
      const numA = parseInt(String(a.id).split('-')[1], 10);
      const numB = parseInt(String(b.id).split('-')[1], 10);
      if (Number.isNaN(numA) || Number.isNaN(numB)) return 0;
      return numA - numB;
    });

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const { data, error: err } = await supabase
          .from('Alfabeto')
          .select('*');

        if (err) throw err;

        const vowels = sortById((data ?? []).filter((d) => d.type === 'vowel'));
        const consonants = sortById((data ?? []).filter((d) => d.type === 'consonant'));
        const tones = sortById((data ?? []).filter((d) => d.type === 'tone'));

        setLetters({ vowels, consonants, tones });
      } catch (e) {
        setError(e?.message ?? 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  // (opcional) lista actual según la categoría en español
  const currentList = useMemo(() => {
    if (catParam === 'consonante') return letters.consonants;
    if (catParam === 'tono') return letters.tones;
    return letters.vowels; // 'vocal'
  }, [letters, catParam]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        w="100%"
        display="flex"
        flexDir="column"
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
        <Heading as="h2" size="md" color="black" userSelect="none">
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
    <Box minH="100vh" w="100%" p={8} bg="gray.50" userSelect="none">
      <Heading as="h1" size="xl" mb={1} textAlign="center" color="black">
        Seˈ (uj)tö̀ shtók
      </Heading>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        color="gray.700"
        fontWeight="medium"
        textAlign="center"
        mb={4}
      >
        Alfabeto Bribri
      </Text>

      <Tabs
        variant="soft-rounded"
        colorScheme="blackAlpha"
        align="center"
        index={tabIndex}
        onChange={(i) => {
          const nextCat = INDEX_TO_CAT[i] ?? 'vocal';
          setSearchParams({ cat: nextCat }, { replace: true });
        }}
      >
        <TabList mb={8}>
          <Tab color="black" _selected={{ color: 'white', bg: '#00C0F3' }}>Vocales</Tab>
          <Tab color="black" _selected={{ color: 'white', bg: '#00C0F3' }}>Consonantes</Tab>
          <Tab color="black" _selected={{ color: 'white', bg: '#00C0F3' }}>Tonos</Tab>
        </TabList>

        <TabPanels>
          {['vocal', 'consonante', 'tono'].map((cat) => {
            const list =
              cat === 'vocal'
                ? letters.vowels
                : cat === 'consonante'
                ? letters.consonants
                : letters.tones;

            return (
              <TabPanel key={cat}>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing={8}
                  maxW="1200px"
                  mx="auto"
                >
                  {list.map((letter) => (
                    <Link
                      as={RouterLink}
                      key={letter.id}
                      // link en español: ?cat=vocal|consonante|tono
                      to={`/caracter/${encodeURIComponent(letter.letter)}?cat=${cat}`}
                      _hover={{ textDecoration: 'none' }}
                    >
                      <LetterCard
                        character={letter.letter}
                        pronunciation={letter.pronunciation}
                        textColor="black"
                      />
                    </Link>
                  ))}
                </SimpleGrid>
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Alphabet;
