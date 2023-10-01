import React, {useState,useEffect} from 'react'
import {Flex,Box,extendTheme,ChakraProvider,Button,IconButton,Text,Center,Input,NumberInput,NumberInputField,Select,Spinner,NumberInputStepper,Slider,SliderMark,SliderTrack,SliderFilledTrack,SliderThumb,Textarea,List,ListItem,InputGroup,InputRightElement,Icon, Divider} from '@chakra-ui/react'
import "@fontsource/jost"
import {AiOutlinePlus,AiTwotoneSetting} from 'react-icons/ai'
import {BsClipboard,BsPeopleFill,BsBarChartLineFill,BsPersonFillAdd} from 'react-icons/bs'
import {IoMdReturnLeft} from 'react-icons/io'
import {motion,AnimatePresence} from 'framer-motion'

import Chat from './chat'
import PieChart from './pages/charts/PieChart.js'
import DonutChart from './pages/charts/DonutChart.js'
import ColumnChart from './pages/charts/SortedColumnChart.js'
import AreaChart from './pages/charts/AreaChart.js'

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

    //Leer los cambios en el tamaño de la pantalla, actualizar las variables y detectar si se trata de una pantalla pequeña
    const handleResize = () => {window.innerWidth=window.innerWidth;window.innerHeight=window.innerHeight;setIsComputerWidth(window.innerWidth > 800)}
    useEffect(() => {handleResize();window.addEventListener("resize", handleResize);return () => {}},[])

    //CLIENTES
    const clientesList=['Clínica dental','Les abelles','Ebike.tienda','Cliente 1.','Cliente 2.', 'Cliente 3.','Cliente 3.','Cliente 4.','Cliente 5.','Cliente 6.']
    const [showClientes,setShowClientes]=useState(false)
    const [showSettings,setShowSettings]=useState(false)

    //BUSCADOR
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDic, setFilteredDic] = useState(clientesList)
    function removeAccents(text) {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }
    const handleSearch = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
      const normalizedTerm = removeAccents(term);
      const filteredList = clientesList.filter((cliente) =>
        removeAccents(cliente).toLowerCase().includes(normalizedTerm)
      )
      setFilteredDic(filteredList);
    }
     
    //FUNCION PARA VER SI SE CLICA FUERA DE LA CAJA
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showClientes && !event.target.closest('.showClientesContainer')) {
          setShowClientes(false);
        }
      }
      document.body.addEventListener('click', handleClickOutside);
      return () => {
        document.body.removeEventListener('click', handleClickOutside);
      }
    }, [showClientes, setShowClientes])
    

    //DICCIONARIO PARA LA APP
    const [EditDic,setEditDic]=useState([
      {tipo:'Post de Instagram',palabrasClave:[],detalles:'',tono:'Profesional',calidad:true,tema:'',longitud:'Normal',numeroPalabras:500,conclusion:false,texts:'Rellene los campos de la izquierda, pulse el botón de redactar y en unos segundos se le mostrará un texto acorde con sus parámetros, gracias.',cliente:''},
      {tipo:'Post de Instagram',palabrasClave:[],detalles:'',tono:'Profesional',calidad:true,tema:'',longitud:'Normal',numeroPalabras:500,conclusion:false,texts:'Rellene los campos de la izquierda, pulse el botón de redactar y en unos segundos se le mostrará un texto acorde con sus parámetros, gracias.',cliente:''},
      {tipo:'Post de Instagram',palabrasClave:[],detalles:'',tono:'Profesional',calidad:true,tema:'',longitud:'Normal',numeroPalabras:500,conclusion:false,texts:'Rellene los campos de la izquierda, pulse el botón de redactar y en unos segundos se le mostrará un texto acorde con sus parámetros, gracias.',cliente:''}
    ])
    
    //SELECCIONADO DE CLIENTE 
    const [selectedClient,setSelectedClient]=useState('Clínica dental')
    const [selectedDic,setSelectedDic]=useState(EditDic[0])
    const [Index,setIndex]=useState(0)

    const handleElementClick=(index)=>{
      //EDITAR LISTA GRANDE
      const updatedEditDic = [...EditDic]
      updatedEditDic[Index] = selectedDic
      setEditDic(updatedEditDic)

      //EIDTAR LAS OTRAS VARIABLES
      setIndex(index)
      setSelectedClient(clientesList[index])
      setSelectedDic(EditDic[index])
      setShowClientes(false)
    }

  
 return(
  <ChakraProvider theme={theme}>
      <IconButton icon={<BsPeopleFill/>} aria-label='people' position={'absolute'} top='3vh'left='10vh' color='white' bg='red.600' _hover={{color:'white',bg:'red.600'}}isDisabled={showSettings} onClick={()=>setShowClientes(!showClientes)}/>  
      <IconButton icon={<BsBarChartLineFill/>} aria-label='settings' position={'absolute'} top='3vh'left='3vh' _hover={{color:'white',bg:'red.600'}}  isDisabled={showClientes} color='white' bg='red.600' onClick={()=>setShowSettings(!showSettings)}/>  
         
      <AnimatePresence> 
         {showClientes&&
          <motion.div initial={{ opacity: 0, y: 0, x: 0 }}animate={{ opacity: 1, y: 0, x: 0 }}exit={{ opacity: 0 ,y: 0, x: 0 }} transition={{ duration: 0.5 }}   style={{ position:'absolute',zIndex: 9999  ,top:'8vh' ,left:'10vh'}} >
            <Box className="showClientesContainer" bg='white' p={5} borderRadius={'xl'} zIndex={100} style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)' }} > 
            <Center> 
                <Text fontWeight={'bold'} fontSize={'2xl'}>
                  Clientes
                </Text>
                </Center>
              <Button mt='1vh'size='sm' bg='red.600' color='white' _hover={{bg:'red.600',color:'white'}} leftIcon={<BsPersonFillAdd/>}>Añadir</Button>
             <Divider mt='1vh' mb='2vh' borderWidth={'1px'}/>
             <Input placeholder='Busca clientes...' borderRadius={'md'} fontFamily={'jost'} value={searchTerm} onChange={handleSearch} focusBorderColor='red.600'></Input>
             <List spacing={3} mt='3vh' height={'40vh'} overflow='scroll'>
                {filteredDic.map((elemento, index) => (
                  <Flex borderRadius={'xl'} shadow={'xl'} bg='red.600' p={5} color='white' cursor={'pointer'} onClick={()=>{if (index<3){handleElementClick(index)}}}>
                    {elemento}
                  </Flex>
                ))}
              </List>
            </Box>
            </motion.div>
          } 
          </AnimatePresence>


          {showSettings ?<>
         <Box height='100vh' width={'100vw'} bg='gray.200' zIndex={1000} position={'absolute'} top='0%' left={'0%'} p={5} >
          <Flex gap={10} color="color.900" fontFamily="jost" justifyContent={'center'}>
          <Box textAlign="center" alignItems="center"> 
            <Text fontSize="3xl" fontWeight="bold">56</Text>
            <Text>Clientes activos</Text>
          </Box>
          <Box textAlign="center" alignItems="center">
            <Text fontSize="3xl" fontWeight="bold">923</Text>
            <Text>Publicaciones totales</Text>
          </Box>
          <Box textAlign="center" alignItems="center">
            <Text fontSize="3xl" fontWeight="bold">38</Text>
            <Text>Publicaciones/semana</Text>
          </Box>
          </Flex>
          <Flex gap={10} mt='6vh' px='2vw'>
              <Box>
                <Text fontWeight={'bold'}>Evolución de clientes</Text>
                  <Box height={'33vh'} width={'50vw'}>
                    <AreaChart xaxis={['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre']} yaxis={[40,37,33,38,40,45,46,52,56]}ytitle={'Clientes activos'}color='red'/>
                  </Box>
              </Box>
              <Box>
                <Text fontWeight={'bold'}>Publicaciones por cliente</Text>
                  <Box height={'33vh'} width={'20vw'}>
                    <PieChart data={[15,13,12,8,8,7,5,4]}labels={['Cliente 1.','Cliente 2.','Otros','Cliente 3.','Cliente 4..','Cliente 5.','Cliente 6.','Cliente 7.']}add={' publicaciones'}/>
                  </Box>
              </Box>
              <Box>
                <Text fontWeight={'bold'}>Lista de clientes</Text>
                  <Box height={'31vh'} width={'20vw'} overflow='scroll' borderRadius={'xl'} mt='2vh'>
                  <List spacing={-3}>
                      {clientesList.map((elemento, index) => (
                         <ListItem style={{ display: 'flex', alignItems: 'center' }}>  
                           <span style={{ fontSize: '2.5em', marginRight: '0.5em' }}>&bull; </span> 
                           <span style={{ fontSize: '1em' }}>{elemento}</span>
                          </ListItem>
                      ))}
                    </List>
                  </Box>
              </Box> 
          </Flex>
          <Flex gap={10} mt='6vh' px='2vw'>
          <Box>
              <Text fontWeight={'bold'}>Evolución de publicaciones escritas</Text>
              <Box height={'33vh'} width={'50vw'} >
                <ColumnChart xaxis={['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre']} yaxis={[90,87,73,98,100,105,99,123,130]} ytitle={'Número de publicaciones'}fontSize={10} />
              </Box>
            </Box>
            <Box>
              <Text fontWeight={'bold'}>Publicaciones por tipo</Text>
                <Box height={'33vh'} width={'20vw'} >
                  <DonutChart data={[30,24,23,12,9,6]} labels={['Post de Instagram','Post de Facebook','Nota de prensa','Blog','Guión televisión','Post de twitter']}/>
                </Box>
            </Box>
           
            </Flex>
              <IconButton onClick={()=>setShowSettings(false)} aria-label='return' position={'absolute'}  top='3vh'left='3vh'  icon={<IoMdReturnLeft/>} bg='red.600' color='white' _hover={{color:'white',bg:'red.600'}}/>
         </Box>
             </>:<Chat selectedClient={selectedClient} EditDic={selectedDic} setEditDic={setSelectedDic}/>}

    </ChakraProvider>
 )
     
}

export default Content