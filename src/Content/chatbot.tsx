import React, { useState, useEffect,useRef,useCallback} from 'react';
import {Box,Flex,Input,VStack,Button,Icon,Avatar,Divider,InputGroup,InputRightElement,Spinner,Image} from '@chakra-ui/react';
import {BsArrowUpSquareFill} from 'react-icons/bs'
import axios from 'axios'
import {bot} from './pages/images/bot.js'
import { VariableSizeList } from 'react-window';
import ColumnChart from './pages/chatbot-charts/ColumnChart.js'
import PieChart from './pages/chatbot-charts/PieChart.js'
import AreaChart from './pages/chatbot-charts/AreaChart.js'
import TreeMapSim from './pages/chatbot-charts/TreeMapSim.js'

//Start writting down if the current word is going to exceed the maximum width
function formatTextByLines(text, maxWidth) {
  // Get the text width
  const getTextWidth = (text) => {
    const tempElement = document.createElement('span');
    tempElement.style.visibility = 'hidden';
    tempElement.style.whiteSpace = 'pre';
    tempElement.textContent = text;
    document.body.appendChild(tempElement);
    const width = tempElement.offsetWidth;
    document.body.removeChild(tempElement);
    return width;
  };
  // Split the text into lines based on both spaces and line breaks
  const lines = text.split(/\n| /);

  let currentLine = '';
  let formattedText = '';
  let lineCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineText = currentLine + ' ' + line;
    const lineTextWidth = getTextWidth(lineText);

    if (lineTextWidth > maxWidth) {
      if (currentLine !== '') {
        formattedText += '\n' + currentLine.trim();
        lineCount++;
      }
      currentLine = line;
    } else {
      currentLine = lineText.trim();
    }
  }

  if (currentLine !== '') {
    formattedText += '\n' + currentLine.trim();
    lineCount++;
  }

  return { formattedText: formattedText.trim(), lines: lineCount };
}
   
interface ChatbotProps {
  isScreenWidthGreaterThan800:boolean;
  messages:any,
  setMessages:any,
  userId:string;
  height:number
}

function formatMessagesList(messages){
  const filteredMessages = messages.filter((elemento) => {
    return elemento.text !== 'Hola, mi nombre es Jose Luis, puedes preguntarme cualquier cosa acerca de Kauri';
  });

  const lastMessages = filteredMessages;
let prevHadChartData = false;
const mensajesFiltrados = [];

// Filtrar los mensajes que van precedidos por .chartData
for (let i = 0; i < lastMessages.length; i++) {
  const elemento = lastMessages[i];
  if (elemento.showSpinner !== false) {
      if (elemento.chartData) {
        prevHadChartData = true;
      } else if (elemento.isUserMessage) {
        prevHadChartData = false;
      } else if (elemento.text && prevHadChartData) {
        // Omitir el elemento 'bot' con 'text' si está precedido por '.chartData'
        continue;
      }
  
  mensajesFiltrados.push(elemento)}
}

const last4Messages = mensajesFiltrados.slice(-4);
const resultado = last4Messages.map((elemento) => {
  if (elemento.isUserMessage) {
    return ['user', elemento.text];
  } else {
    if (elemento.chartData) {
      return ['bot', elemento.chartData];
    } else {
      return ['bot', elemento.text];
    }
  }
});

return resultado;
}

  //Call python API
  const callPythonAPI = async (text,messages) => {
    console.log({'question': text,'requestingUserId':localStorage.getItem('userId'),'chatHistory':formatMessagesList(messages)})
  try {
    const response = await axios.post('https://mua34bxbcxs4tiscvetqoeswde0zewlx.lambda-url.eu-west-3.on.aws/', {'question': text,'requestingUserId':localStorage.getItem('userId'),'chatHistory':formatMessagesList(messages)});
    const answer= response.data

    return answer
      } catch (error) {
        console.error('Error al llamar a la API de Python:', error)}}
 
const ChartComponent=({data})=>{   
  return(<>
  {data.graphType=='pie' && <PieChart data={data.Y1} labels={data.X}/>}
  {data.graphType=='bar1' && <ColumnChart yaxis1={data.Y1} ytitle1={data['Y1_nombre']}  xaxis={data.X} mismaUnidadMedida={data['mismaUnidadMedida']}/>}
  {data.graphType=='bar2' && <ColumnChart yaxis1={data.Y1} ytitle1={data['Y1_nombre']} ytitle2={data['Y2_nombre']} xaxis={data.X} yaxis2={data.Y2} mismaUnidadMedida={data['mismaUnidadMedida']}/>}
  {data.graphType=='area1' && <AreaChart yaxis1={data.Y1} title1={data['Y1_nombre']} xaxis={data.X} mismaUnidadMedida={data['mismaUnidadMedida']}/>}
  {data.graphType=='area2' && <AreaChart yaxis1={data.Y1}ytitle1={data['Y1_nombre']} ytitle2={data['Y2_nombre']} xaxis={data.X} yaxis2={data.Y2} mismaUnidadMedida={data['mismaUnidadMedida']}/>}
  {data.graphType=='treemap' && <TreeMapSim yaxis={data.Y1}  xaxis={data.X}/>}
  </>)
}

function Chatbot ({isScreenWidthGreaterThan800,messages,setMessages,height}:ChatbotProps) {
 
  const ScrollPosition=useRef(0)
 
  const questions_list=['¿Cuáles son los precios de los distintos balones de rugby?','¿Qué productos de telas están por debajo del stock mínimo?'];
   const [showSpinner,setShowSpinner]=useState(false)
   const [isBotWriting, setIsBotWriting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLInputElement>(null)

  const input_value = useRef('')
  const [showButtons1, setShowButtons1] = useState(false)
 
 
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Scroll to the bottom of the container
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //Effect of show dummie questions
  useEffect(() => {
    if (messages.length === 1) {
      setShowButtons1(true);
    }
  }, [messages]);

  //Writting effect
  const TypewriterEffect =({text, delay,messagesContainerRef })=> {
    const [typedText, setTypedText] = useState('');
    useEffect(() => {
      let timeoutId;
      let currentIndex = 0;
      const typeNextCharacter = () => {
        if (currentIndex < text.length) { 
          currentIndex++;
          setTypedText((prevText) => prevText + text[currentIndex-1]);
          timeoutId = setTimeout(typeNextCharacter, delay);
          //Refresh the position of the box if there is a line break
          if (text[currentIndex-1] === '\n') {
            const messagesContainer = messagesContainerRef.current;
            messagesContainer.scrollTop = messagesContainer.scrollHeight; 
          }
        }
        else{
          const updatedMessages = [...messages];  
          updatedMessages[updatedMessages.length - 1].isTyping = false;
          setMessages(updatedMessages);
          setIsBotWriting(false)
        }
      };
      if (currentIndex == 0) {
        timeoutId = setTimeout(typeNextCharacter, delay);
      }
      return () => clearTimeout(timeoutId);
    }, [text, delay])
    return <div style={{ whiteSpace: 'pre-line' }}> 
    {typedText}</div>
  } 

  const renderQuestionButtons = (questions_list) => {
    if (showButtons1 && isScreenWidthGreaterThan800) {
      return (
        <>
        <Flex mt={1} marginLeft={'5%'} marginBottom={'1%'}>
          <Button mx={1} borderRadius='3xl' boxShadow={'xl'} colorScheme="color" fontSize={'12px'} onClick={()=>{handleButtonSelect(questions_list[0])}}>
            {questions_list[0]}
          </Button>
          
        </Flex>
          <Flex mt={1} marginLeft={'5%'} marginBottom={'2%'}>
            <Button mx={1} borderRadius='3xl' boxShadow={'xl'} colorScheme="color" fontSize={'12px'} onClick={() => { handleButtonSelect(questions_list[1]) }}>
              {questions_list[1]}
            </Button>
          </Flex>
      </>)} else {return null}}

  //Welcome message
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isBotWriting && !showSpinner) {
      if (input_value.current.trim() !== '') {
      handleSendMessage(input_value.current)}
    }
  }
  const handleButton= ()=>{
    if (!isBotWriting && !showSpinner)
    { if (input_value.current.trim() !== '') {
      handleSendMessage(input_value.current)
    }}}

  const handleButtonSelect = (text) => {
    const updatedInputValue = text;
    input_value.current=updatedInputValue
    handleSendMessage(updatedInputValue)
  } 
  //Handle a new message
  const handleInputChange = (event) => {
    input_value.current=event.target.value
  }

  //Handle a new message
  async function handleSendMessage(text) {
    if (text) {
      //Set a new user message
      const newMessage = {
        id: Date.now(),
        text: text,
        lines:formatTextByLines(text, 550).lines,
        isUserMessage: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      try {
        setShowButtons1(false);  
        setShowSpinner(true);
        //Show spinner  and delete it when the bot start typing
        const spinnerMessage = {
          id: Date.now() + 1,
          lines:0,
          isUserMessage: false,
          isTyping: false,
          showSpinner: true,
        };
 
        setMessages((prevMessages) => [...prevMessages, spinnerMessage])

        const botResponse=await callPythonAPI(text,messages)
        setMessages((prevMessages) =>
  prevMessages.map((message) =>
    message === spinnerMessage ? { ...message, showSpinner: false } : message
  )
  )
        if (botResponse.graphType === 'none') {
          // Handle text response
          setShowSpinner(false)
          setIsBotWriting(true)
          
          const formattedResponse = formatTextByLines(botResponse.answer, 550);
          const responseMessage = {
            id: Date.now() + 2,
            text: formattedResponse.formattedText,
            lines:formattedResponse.lines,
            isUserMessage: false,
            isTyping: true,
          };
 
        
          setMessages((prevMessages) => [...prevMessages, responseMessage])
         
        }
       else{
        setShowSpinner(false)
 
        const chartData = botResponse 
        const chartMessage = {
          id: Date.now() + 3,
          chartData: chartData,
          isUserMessage: false,
        }
        setMessages((prevMessages) => [...prevMessages, chartMessage]);

      const textMessage = {
        id: Date.now() + 4,
        text: chartData.answer,
        lines: formatTextByLines(botResponse.answer, 550).lines,
        isUserMessage: false,
        isTyping: true,
      }
      setMessages((prevMessages) => [...prevMessages, textMessage])
      setIsBotWriting(true)
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setIsBotWriting(false); 
      setShowSpinner(false);   
    } }}

  const renderMessageContent = (message) => {
    if (message.isUserMessage) {
      return <div style={{ whiteSpace: 'pre-wrap',fontFamily:'jost' }}>{message.text}</div>;
    } else if (message.showSpinner) {
      return (
        <>
          <Box mt={'30%'}> 
            <Spinner size="sm" emptyColor="gray.200" color="black" speed="0.56s" />
          </Box>
        </>)} else if (message.isTyping) {
      return <TypewriterEffect text={message.text.trim()} delay={10} messagesContainerRef={messagesContainerRef} />;
      } else if (message.chartData) {
        return(
        <> <ChartComponent data={message.chartData}/>
      </>)
      } else {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>;
      }
  }
     
const getItemSize = useCallback((index) => {

    if (index >= 0 && index < messages.length) {

      const message = messages[index]
      if (!(message.showSpinner==true||message.showSpinner==false)){
        if (!message.chartData) {
          return message.lines*23.8+50
        }
        else if (message.chartData){
        return 320}}
    else{return 0}
 
}}, [messages]); 
  
 
  return (
    <Flex height="100%" width="100%" > 
      <VStack  width="100%" >
      <Box marginLeft={'8%'} p={4}  width='100%'py={10}maxHeight={isScreenWidthGreaterThan800 ? '80vh' : '62vh'}  >
      <VariableSizeList height={isScreenWidthGreaterThan800 ?height*0.75:100} itemCount={messages.length} itemSize={index => getItemSize(index)}width="100%" outerRef={messagesContainerRef}   onScroll={({ scrollOffset }) => {ScrollPosition.current=scrollOffset }} initialScrollOffset={ScrollPosition.current} overscanCount={6} >
      {({index, style }) => (
        <div style={style}>
           {messages[index].showSpinner !== false && (
          <Flex fontSize={isScreenWidthGreaterThan800 ? 'md' : '4xl'}key={index}alignItems="center"justifyContent={messages[index].isUserMessage ? 'flex-start' : 'flex-start'}mb={18}>
            {messages[index].isUserMessage ? (
              <Avatar size="sm" mr={4} />
            ) : (
              <Image src={bot} boxSize="31px" mr={4} />
            )}
            <Box fontFamily="jost"bg={messages[index].isUserMessage ? 'color.500' : 'gray.200'}color={messages[index].isUserMessage ? 'white' : 'black'}borderRadius="xl"p={4}maxW="80%"alignSelf={messages[index].isUserMessage ? 'flex-end' : 'flex-start'}textAlign={messages[index].isUserMessage ? 'left' : 'left'}>
              {renderMessageContent(messages[index])}
            </Box> 
            {index < messages.length - 1 && <Divider orientation="vertical" mx={2} />}
          </Flex>)}
        </div>
      )}
    </VariableSizeList>
    </Box>
          <Flex width='80%' flexDirection="column" py={3} style={{ position: 'absolute', bottom: 0, left: '20%', right: 0 }}>
          {renderQuestionButtons(questions_list)}
            <InputGroup marginBottom={'3%'}  marginLeft={'5%'} marginRight={'5%'} >
              <Input fontFamily={'jost'} fontSize={isScreenWidthGreaterThan800 ? 'md':'5xl' } size={isScreenWidthGreaterThan800 ? 'md':'lg' } focusBorderColor="color.500" borderRadius="xl" marginRight={'10%'} placeholder="Escribe tu mensaje..." ref={inputRef} py={isScreenWidthGreaterThan800 ? 0:10} disabled={isBotWriting || showSpinner} onChange={handleInputChange} onKeyDown={handleKeyDown} />
              <InputRightElement marginTop={isScreenWidthGreaterThan800 ?0.2:5} marginBottom={0.2} marginRight={isScreenWidthGreaterThan800?'10.1%':'12.5%'} >
                <Button size={isScreenWidthGreaterThan800 ? 'sm':'lg'} width={'2rem'} colorScheme="color" onClick={handleButton}>
                  <Icon as={BsArrowUpSquareFill} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
      </VStack>
    </Flex>
  )
} 

  export default Chatbot;