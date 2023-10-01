import React, {useState,useEffect} from 'react'
import {Flex,Box,extendTheme,ChakraProvider,Button,IconButton,Text,Center,Input,NumberInput,NumberInputField,Select,Spinner,NumberInputStepper,Slider,SliderMark,SliderTrack,SliderFilledTrack,SliderThumb,Textarea,List,ListItem,InputGroup,InputRightElement,Icon, Divider} from '@chakra-ui/react'
import "@fontsource/jost"
import {AiOutlinePlus,AiTwotoneSetting} from 'react-icons/ai'
import {BsClipboard,BsInstagram,BsFillInfoCircleFill,BsFacebook} from 'react-icons/bs'
import {TfiWrite} from 'react-icons/tfi'
import {RxCross2} from 'react-icons/rx'
import {motion,AnimatePresence} from 'framer-motion'
import Triangle from './pages/Trianglebox'
import axios from 'axios';



//EditDic={tipo,palabrasClave,detalles,tono,calidad,tema,longitud,numeroPalabras,conclusion,texts}

//setEditDic{...EditDic,}
const Chat=({selectedClient,EditDic,setEditDic})=>{

    const TipoList=['Post de Instagram','Post de Facebook','Blog','Nota de prensa'] 
    const [waiting,setWaiting]=useState(false)
    
    const [showInfo,setShowInfo]=useState(false)
    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    }

    //FUNCION PARA VER SI SE CLICA FUERA DE LA CAJA
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (showInfo && !event.target.closest('.showInfoContainer')) {
        setShowInfo(false);
        }
    }
    document.body.addEventListener('click', handleClickOutside);
    return () => {
        document.body.removeEventListener('click', handleClickOutside);
    }
    }, [showInfo, setShowInfo])

    const TonoList=["Profesional", "Alegre", "Vacilón", "Serio", "Corporativo", "Jurídico"]

    const handleAgregarClick = () => {
      if (inputValue.trim() !== '') {
        setEditDic({...EditDic,palabrasClave:[...EditDic.palabrasClave, inputValue]})
        setInputValue('')
      }
    }
 
    const handleBorrarClick = (index) => {
      const nuevasPalabrasClaves = EditDic.palabrasClave.filter((_, i) => i !== index)
      setEditDic({...EditDic,palabrasClave:(nuevasPalabrasClaves)})
    }

    const [isAnimating, setIsAnimating] = useState(false);

    const cambiarTexto = (text) => {
        setIsAnimating(true)
        setTimeout(() => {
          setEditDic({...EditDic,texts:text.replace(/\n/g, "<br />")})
          setIsAnimating(false)
        }, 1500)
      }
    
      useEffect(() => {
        if (isAnimating) {
          return () => setIsAnimating(false)
        }
      }, [isAnimating])

 
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
            console.log({infoCliente:EditDic.cliente,tipoPublicacion:EditDic.tipo,contexto:EditDic.detalles,tema:EditDic.tema,palabrasClave:EditDic.palabrasClave,tono:EditDic.tono,calidad:EditDic.calidad,longitud:EditDic.longitud,numeroPalabras:EditDic.numeroPalabras,incluirConclusion:EditDic.conclusion})
            const response = await axios.post('https://3lxjimeukuwaybcgxmq4vwdvpa0qglnp.lambda-url.eu-west-3.on.aws',{infoCliente:EditDic.cliente,tipoPublicacion:EditDic.tipo,contexto:EditDic.detalles,tema:EditDic.tema,palabrasClave:EditDic.palabrasClave,tono:EditDic.tono,calidad:EditDic.calidad,longitud:EditDic.longitud,numeroPalabras:EditDic.numeroPalabras,incluirConclusion:EditDic.conclusion});
              console.log(response)
              setWaiting(false)
            cambiarTexto(response.data)
                } catch (error) {
                  console.error('Error al llamar a la API:', error)
                  setWaiting(false)
                }
            }
    return(
    <>
    <Flex px={'4vw'} py={'2vh'}  flexDirection={'column'} alignItems={'center'} flex={1} height={'100vh'} bg='gray.200'>
              <Text color={'black'} fontSize={'4xl'}>{selectedClient}</Text>
              <Flex justifyContent={'space-between'} gap={'4.5vw'} alignItems={'center'} mt='2vh'>  
            <Button position={'absolute'} top='13.5vh' left='6.9vw' size={'xs'} leftIcon={<BsFillInfoCircleFill/>} onClick={()=>setShowInfo(true)} mt='-0.3vh'fontWeight={'normal'}>Datos del cliente</Button>
           
            <AnimatePresence> 
            {showInfo&&
             <motion.div initial={{ opacity: 0, y: 0, x: 0 }}animate={{ opacity: 1, y: 0, x: 0 }}exit={{ opacity: 0 ,y: 0, x: 0 }} transition={{ duration: 0.5 }}   style={{ position:'absolute',zIndex: 9999  ,top:'16.6vh' ,left:'6.9vw'}} >
            <Box bg='white' borderRadius={'xl'} className='showInfoContainer' position={'absolute'} shadow={'xl'} >
                <Box p={6}> 
                <Text fontWeight={'bold'}>Introduzca datos del cliente</Text>
                <Textarea height={'20vh'} defaultValue={EditDic.cliente} width='20vw'mt='2vh' onChange={(event)=>setEditDic({...EditDic,cliente:event.target.value})} focusBorderColor='red'/>
                </Box>
            </Box>
            </motion.div>}
        </AnimatePresence> 
                <Box color={'white'} width={'50vw'}  borderRadius={'xl'} shadow={'xl'} px={10} py={5} bg='red.600' height={'87vh'}> 
                    <Center>
                        <Box width={'50%'}> 
                            <Text fontFamily={'jost'} fontSize={'md'}   >Selección tipo de publicación</Text>
                            <Select mt='1vh' focusBorderColor='white' onChange={(e)=>setEditDic({...EditDic,tipo:e.target.value})} fontWeight={'normal'} >
                            {TipoList.map((opcion, index) => (
                                <option key={index} value={opcion}>
                                {opcion}
                                </option>
                            ))}
                            </Select>
                        </Box>
                    </Center>

                    <Flex  gap={'5vw'}  justifyContent={'space-between'}>
                        <Box width='100%'> 
                            <Text mt='2vh' fontFamily={'jost'}>Seleccione palabras claves</Text>
                            <InputGroup  mt='2vh'>
                            <Input  focusBorderColor='white'value={inputValue} onChange={handleInputChange} fontWeight={'normal'} />
                            <InputRightElement  >
                                <Button onClick={handleAgregarClick} >
                                <Icon  as={AiOutlinePlus}/>
                                </Button>
                            </InputRightElement>
                            </InputGroup>
                            
                            <List height={'18vh'} borderColor={'white'} borderWidth={'1px'} borderRadius={'xl'}  mt='5%' overflow={'scroll'}  py={2} fontWeight={'normal'} >
                                {EditDic.palabrasClave.map((palabra, index) => (
                                <ListItem key={index} px={5}display="flex" justifyContent="space-between" fontWeight={'normal'} >
                                    {palabra}
                                    <IconButton aria-label='delete' variant={'ghost'}size='sm' _hover={{ bg: 'transparent'}}  color='white'icon={<RxCross2/>} onClick={() => handleBorrarClick(index)}/>
                               </ListItem>
                                ))}
                            </List>
                            <Text  mt='2vh'fontFamily={'jost'}>Seleccione tono</Text> 
                            <Flex gap={5}  mt='2vh'> 
                            <Select focusBorderColor='white' defaultValue={EditDic.tono} onChange={(e)=>setEditDic({...EditDic,tono:e.target.value})} >
                            {TonoList.map((opcion, index) => (
                                <option key={index} value={opcion}>
                                {opcion}
                                </option>
                            ))}
                            </Select>
                            </Flex>
                            <Text  mt='2vh'fontFamily={'jost'}>Seleccione calidad</Text>
                            <Flex gap={5}  mt='1vh'>
                                <Button size='sm' fontWeight={'normal'} bg={EditDic.calidad?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,calidad:true})}>Alta</Button>
                                <Button size='sm' fontWeight={'normal'} bg={!EditDic.calidad?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,calidad:false})}>Media</Button>
                            </Flex>

                            {EditDic.tipo=='Blog'||EditDic.tipo=='Nota de prensa'?<> 
                            <Text  mt='2vh'fontFamily={'jost'}>Seleccione número de palabras</Text>
                            <NumberInput  mt='2vh' defaultValue={100} min={100} max={1500} focusBorderColor='white' onChange={(e)=>setEditDic({...EditDic,numeroPalabras:parseInt(e)})}>
                            <NumberInputField />
                            </NumberInput>
                            <Text  mt='2vh' fontFamily={'jost'}>¿Desea añadir una conclusión?</Text>
                            <Flex gap={5}  mt='1vh'>
                                <Button size='sm'fontWeight={'normal'}  bg={EditDic.conclusion?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,conslusion:true})}>Sí</Button>
                                <Button size='sm' fontWeight={'normal'} bg={!EditDic.conclusion?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,conslusion:false})}>No</Button>
                            </Flex>
                            </> :
                            <>
                             <Text mt='2vh'fontFamily={'jost'}>Seleccione longitud</Text>
                             <Flex gap={5}  mt='1vh'>
                                <Button size='sm' fontWeight={'normal'} bg={EditDic.longitud=='Corto'?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,longitud:'Corto'})}>Corto</Button>
                                <Button size='sm' fontWeight={'normal'} bg={EditDic.longitud=='Normal'?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,longitud:'Normal'})}>Normal</Button>
                                <Button size='sm' fontWeight={'normal'} bg={EditDic.longitud=='Largo'?'gray.500':null}_hover={{bg:'gray.500'}} onClick={()=>setEditDic({...EditDic,longitud:'Largo'})}>Largo</Button>
                            </Flex>
                             </>}
                            </Box>           
                        <Box width='100%'> 
                            <Text   mt='2vh' fontFamily={'jost'}>Escriba detalles relevantes</Text> 
                            <Box height={'30vh'}> 
                            <Textarea   borderRadius={'xl'}placeholder='Introduzca texto'size='sm'fontWeight={'normal'}  focusBorderColor='white' mt='2vh' height={'80%'} value={EditDic.contexto} onChange={(event)=>setEditDic({...EditDic,detalles:event.target.value})}/> 
                            </Box>
                            <Text  mt='-1vh' fontFamily={'jost'} >Escriba el tema a tratar</Text> 
                            <Box height={'30vh'}>
                            <Textarea borderRadius={'xl'} placeholder='Introduzca texto'size='sm' fontWeight={'normal'} focusBorderColor='white' mt='2vh' height={'80%'}  value={EditDic.tema} onChange={(event)=>setEditDic({...EditDic,tema:event.target.value})}/> 
                            </Box>
                            <Flex   mt='2vh'flexDirection={'row-reverse'}> 
                            <Button width='40%'leftIcon={waiting?null:<TfiWrite/>}size='sm' onClick={callLambda} fontWeight={'normal'} >{waiting?<Spinner/>:'Redactar'}</Button>
                            </Flex>
                        </Box>
                    </Flex>             
                    </Box>
        <Box fontSize={"sm"}color={"white"}width={"37vw"}borderRadius={"xl"}shadow={"xl"}py={5}px={8}bg="red.600">
            <Flex flexDirection={'row-reverse'} gap={5}> 
            <Button size='sm' leftIcon={<BsClipboard/>}onClick={() => copyToClipboard(EditDic.texts)} fontWeight={'normal'}>Copiar</Button>
               {EditDic.texts!='Rellene los campos de la izquierda, pulse el botón de redactar y en unos segundos se le mostrará un texto acorde con sus parámetros, gracias.'&&
               <> {EditDic.tipo=='Post de Instagram' && <Button fontWeight={'normal'}size='sm' leftIcon={<BsInstagram/>}onClick={() => copyToClipboard(EditDic.texts)}>Publicar</Button>}
               {EditDic.tipo=='Post de Facebook' && <Button fontWeight={'normal'}size='sm' leftIcon={<BsFacebook/>}onClick={() => copyToClipboard(EditDic.texts)}>Publicar</Button>}

               </> }
             
              </Flex>
            <Box  mt='2vh' overflow={'scroll'}  height={'76.7vh'}> 
            <Text dangerouslySetInnerHTML={{ __html: EditDic.texts }} />
          </Box>
        </Box>
                </Flex>
                </Flex>
        </>)
}

export default Chat;