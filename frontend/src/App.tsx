import React from 'react';
import './App.css';
import Book from './components/Book';
import Plot from './components/Plot';
import { WebSocketProvider } from './services/WebSocketContext';

const App: React.FC = () => {
    return (
        <WebSocketProvider>
            <div className='app'>
                <Book />
                <Plot />
            </div>
        </WebSocketProvider>
    );
};

export default App;