import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import {login} from './Content/pages/images/login.js'
import { Flex, Box, FormControl, FormLabel, Input, Spinner,Stack,Button,ChakraProvider,extendTheme,Image} from '@chakra-ui/react';
import Content from './Content/index.tsx';
 

//INTRODUCIR ESTILOS CUSTOMIZADOS PARA ELEMENTOS (COLORES,BOTONES, TEXTO, INPUTS,...)
const theme = extendTheme({
  styles: {
  body:{jost: 'jost'},
  global: {body: {bg: "gray.100"}}},
  sizes: {iconButton: '10rem'},
  colors: {
  color:{
  500:'#007A7A',
  700:'#005052',
  900:'#073030'
  }}});
  
//COMPONENTE LOGIN
const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const storedIsSignedIn = localStorage.getItem('isSignedIn');
    if (storedIsSignedIn === 'true') {
      setIsSignedIn(true);
    }
  }, []);
  
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const username_min=username.toLowerCase()
      const user = await Auth.signIn(username_min, password);
      console.log("Successful sign in!")
      setUsername('');
      setPassword('')
      setIsSignedIn(true)
      localStorage.setItem('isSignedIn', 'true');
      localStorage.setItem('userId', username_min+password);
      localStorage.setItem('username', username_min);
    } catch (error) {
      console.log('Error signing in:', error)
    }
    finally {
      setIsLoading(false)
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setIsSignedIn(false);
      localStorage.removeItem('isSignedIn');
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSignIn()
    }}

  if (!isSignedIn) {
    return (
      <ChakraProvider theme={theme}> 
      <Flex minH={'100vh'}  bg='gray.100'>
          <Stack marginTop='6%'  direction="column" spacing={8} mx={'auto'} maxW={'xl'} py={25} bg=''>   
          <Image src={login} width='300px' alt='Login' ></Image>   
            <Box marginTop={'20%'}rounded={'lg'} bg='white' boxShadow={'lg'} p={8} >
              <Stack spacing={8}>
                <FormControl id="name">
                <FormLabel color='black' fontStyle={'jost'}>Usuario</FormLabel>
                <Input  fontStyle={'jost'} focusBorderColor='#007A7A' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" onKeyDown={handleKeyDown}/>
                </FormControl>
                <FormControl id="password">
                <FormLabel color='black'  fontStyle={'jost'} >Contraseña</FormLabel>
                <Input fontStyle={'jost'} focusBorderColor='#007A7A' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" onKeyDown={handleKeyDown}/>
                </FormControl>
                <Stack>
                <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                </Stack>
                <Button fontWeight={'normal'} fontStyle={'jost'} _hover={{bg: '#005052', color: 'white' }} color={'white'} bg='teal'  onClick={handleSignIn}>
                  {isLoading ? <Spinner size="sm" /> : 'Sign in'}
                </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
        </ChakraProvider>
    )
  }
  return (
    <ChakraProvider theme={theme}> 
        <Content handleSignOut={handleSignOut}/>
    </ChakraProvider>
  ) 
}
export default App;


 