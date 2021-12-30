import React from 'react';
import { QueryClient ,QueryClientProvider} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import ReactDOM from 'react-dom';
import { Approvider } from './Stats-Anime/context';
import App from "./app";



const client = new QueryClient();

ReactDOM.render(
    <QueryClientProvider client={client}>
        <ReactQueryDevtools/>
        <Approvider><App/></Approvider>
    </QueryClientProvider>
    
    , document.getElementById("root"));




