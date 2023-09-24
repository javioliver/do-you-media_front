import React, {useState,useEffect} from 'react'
import {Flex,Box,extendTheme,ChakraProvider,Button,IconButton,Text,Center,Divider,Input,NumberInput,NumberInputField,NumberIncrementStepper,Spinner,NumberInputStepper,Slider,SliderMark,SliderTrack,SliderFilledTrack,SliderThumb,Textarea,List,ListItem,InputGroup,InputRightElement,Icon} from '@chakra-ui/react'
import "@fontsource/jost"
import {AiOutlinePlus} from 'react-icons/ai'
import {BsClipboard} from 'react-icons/bs'
import {TfiWrite} from 'react-icons/tfi'
import {RxCross2} from 'react-icons/rx'
import {motion,AnimatePresence} from 'framer-motion'
import axios from 'axios';
//PREDEFINIR ESTILOS DE LA APP
const theme = extendTheme({
    styles: {
    global: {body: {bg: "gray.100",fontFamily:'jost, sans-serif'}}},
    sizes: {iconButton: '10rem'},
    colors: {
    color:{
        500:'#1A365D'

  }}})


const Content=({handleSignOut})=>{
    const [isComputerWidth,setIsComputerWidth]=useState(true)

    const [tema,setTema]=useState('')
    const [contexto,setContexto]=useState('')
    const [texts,setTexts]=useState('Rellene los campos de la izquierda, pulse el botón de redactar y en unos segundos se le mostrará un texto acorde con sus parámetros, gracias.')
    const [temperature,setTemperature]=useState(0)
    const [calidad,setCalidad]=useState(true)
    const [waiting,setWaiting]=useState(false)

    //Leer los cambios en el tamaño de la pantalla, actualizar las variables y detectar si se trata de una pantalla pequeña
    const handleResize = () => {window.innerWidth=window.innerWidth;window.innerHeight=window.innerHeight;setIsComputerWidth(window.innerWidth > 800)}
    useEffect(() => {handleResize();window.addEventListener("resize", handleResize);return () => {}},[])


    const [inputValue, setInputValue] = useState('');
    const [palabrasClaves, setPalabrasClaves] = useState([]);
    const [numeroPalabras,setNumeroPalabras]=useState(0)
    const [conclusion,setConclusion]=useState(false)
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleAgregarClick = () => {
      if (inputValue.trim() !== '') {
        setPalabrasClaves([...palabrasClaves, inputValue]);
        setInputValue('');
      }
    }
 
    const handleBorrarClick = (index) => {
      const nuevasPalabrasClaves = palabrasClaves.filter((_, i) => i !== index);
      setPalabrasClaves(nuevasPalabrasClaves);
    };

    const [isAnimating, setIsAnimating] = useState(false);

    const cambiarTexto = (text) => {
        setIsAnimating(true)
        setTimeout(() => {
          setTexts(text);
          setIsAnimating(false)
        }, 1500)
      };
    
      useEffect(() => {
        if (isAnimating) {
          return () => setIsAnimating(false)
        }
      }, [isAnimating]);

 
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
          .then(() => {
            alert('Texto copiado');
          })
          .catch((error) => {
            console.error('Error al copiar el texto: ', error);
          });
      }

    const callLambda=async ()=>{
        setWaiting(true)
        try {
            console.log({contexto:contexto,tema:tema,palabrasClave:palabrasClaves,creaatividad:temperature,calidad:calidad,numeroPalabras:numeroPalabras,incluirConclusion:true})
            const response = await axios.post('https://3lxjimeukuwaybcgxmq4vwdvpa0qglnp.lambda-url.eu-west-3.on.aws',{contexto:contexto,tema:tema,palabrasClave:palabrasClaves,creatividad:temperature,calidad:calidad,numeroPalabras:numeroPalabras,incluirConclusion:conclusion});
              console.log(response)
              setWaiting(false)
            cambiarTexto(response.data)
                } catch (error) {
                  console.error('Error al llamar a la API:', error);
                }
         
            }
        
    
    return(   
        <ChakraProvider theme={theme}> 
        
                <Flex justifyContent={'space-between'} py={5} px={'4vw'} alignItems={'center'} flex={1} height={'100vh'}  bgGradient="linear-gradient(to left, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7  ))">      
                   
                   <Box color={'white'} width={'50vw'} fontWeight={'bold'} borderRadius={'xl'} shadow={'xl'} px={10} py={5}bg='red' height={'92vh'} > 
                   <Center>
                                <Text fontFamily={'jost'} fontSize={'2xl'}>Selección de parámetros</Text>
                            </Center>
                        <Flex  gap={'5vw'}  justifyContent={'space-between'}>
                     
                            <Box width='100%'> 
                            <Text mt='5%' fontFamily={'jost'}>Seleccione palabras claves</Text>
                            <InputGroup mt='6%' >
                            <Input  focusBorderColor='white'value={inputValue} onChange={handleInputChange} />
                            <InputRightElement  >
                                <Button onClick={handleAgregarClick} >
                                <Icon  as={AiOutlinePlus}/>
                                </Button>
                            </InputRightElement>
                            </InputGroup>
                            
                            <List height={'20vh'} borderColor={'white'} borderWidth={'1px'} borderRadius={'xl'}  mt='5%' overflow={'scroll'}  py={2}>
                                {palabrasClaves.map((palabra, index) => (
                                <ListItem key={index} px={5}display="flex" justifyContent="space-between" >
                                    {palabra}
                                    <IconButton aria-label='delete' variant={'ghost'}size='sm' _hover={{ bg: 'transparent'}}  color='white'icon={<RxCross2/>} onClick={() => handleBorrarClick(index)}/>
                               </ListItem>
                                ))}
                            </List>
                            <Text mt='10%'fontFamily={'jost'}>Seleccione nivel de creatividad</Text> 
                            <Flex gap={5} mt='6%'> 
                                <Button size='sm' bg={temperature==0?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setTemperature(0)}>Bajo</Button>
                                <Button size='sm' bg={temperature==0.7?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setTemperature(0.7)}>Medio</Button>
                                <Button size='sm' bg={temperature==1.4?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setTemperature(1.4)}>Alto</Button>

                            </Flex>
                            <Text mt='10%'fontFamily={'jost'}>Seleccione calidad</Text>
                            <Flex gap={5} mt='6%'>
                                <Button size='sm' bg={calidad?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setCalidad(true)}>Alta</Button>
                                <Button size='sm' bg={!calidad?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setCalidad(false)}>Media</Button>
                            </Flex>
                            <Text mt='10%'fontFamily={'jost'}>Seleccione número de palabras</Text>
                            <NumberInput mt='6%' defaultValue={100} min={100} max={1500} focusBorderColor='white' onChange={(value)=>setNumeroPalabras(parseInt(value))}>
                            <NumberInputField />
                            </NumberInput>
                            <Text mt='10%'fontFamily={'jost'}>¿Desea añadir una conclusión?</Text>
                            <Flex gap={5} mt='6%'>
                                <Button size='sm' bg={conclusion?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setConclusion(true)}>Sí</Button>
                                <Button size='sm' bg={!conclusion?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setConclusion(false)}>No</Button>
                            </Flex>
                            </Box>           
                        <Box width='100%' > 
                        <Text  mt='5%' fontFamily={'jost'}>Escriba un contexto</Text> 
                        <Box height={'37vh'}> 
                        <Textarea   borderRadius={'xl'}placeholder='Introduzca texto'size='sm' focusBorderColor='white' mt='5%' height={'80%'} value={contexto} onChange={(event)=>setContexto(event.target.value)}/> 
                        </Box>
                        <Text mt='-10%' fontFamily={'jost'} >Escriba el tema a tratar</Text> 
                        <Box height={'37vh'}>
                        <Textarea borderRadius={'xl'} placeholder='Introduzca texto'size='sm' focusBorderColor='white' mt='5%' height={'80%'}  value={tema} onChange={(event)=>setTema(event.target.value)}/> 
                        </Box>
                        <Flex  mt='2.5%'flexDirection={'row-reverse'}> 
                        <Button width='40%'leftIcon={waiting?null:<TfiWrite/>}size='sm' onClick={callLambda} >{waiting?<Spinner/>:'Redactar'}</Button>
                        </Flex>
                        </Box>
                    </Flex>             
                    </Box>
    
    n 
            
        <Box
          fontSize={"sm"}
          color={"white"}
          width={"37vw"}
          fontWeight={"bold"}
          borderRadius={"xl"}
          shadow={"xl"}
          py={5}
          px={8}
          bg="red"
          height={"92vh"}
        >
            <Flex flexDirection={'row-reverse'}> 
               <Button size='sm' leftIcon={<BsClipboard/>}onClick={() => copyToClipboard(texts)}>Copiar</Button>
               </Flex>
            <Box mt='3%' overflow={'scroll'} height={'80vh'}> 
          <Text>{texts}</Text>
          </Box>
        </Box>
    

                </Flex>
        </ChakraProvider>
    )
}

export default Content

 

 