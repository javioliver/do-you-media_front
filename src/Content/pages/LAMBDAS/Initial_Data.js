import axios from 'axios';

const InitialData = async (requestingUserId,initial,initialAsync,requestedSection,args) => {
    try {
    console.log({requestingUserId:requestingUserId,initial:initial,initialAsync:initialAsync,requestedSection:requestedSection,args:args})
    const response = await axios.post('https://x5xhghoswnpjbxmk2euhrn73fe0cyeyt.lambda-url.eu-west-3.on.aws/',{requestingUserId:requestingUserId,initial:initial,initialAsync:initialAsync,requestedSection:requestedSection,args:args});
      console.log(response)
      return response.data;
        } catch (error) {
          console.error('Error al llamar a la API:', error);
        }
    };


export default InitialData;