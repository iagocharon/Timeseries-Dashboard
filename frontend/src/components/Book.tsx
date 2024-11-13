import React from 'react';
import { useWebSocket } from '../services/WebSocketContext';
import "./Book.css";

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return dateFormatter.format(date);
};



const Book: React.FC = () => {
    const data = useWebSocket();

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wrapper">
            <div className="top">
                    <h1>Time Series Dashboard</h1>
                    <h3 className="date">
                        {formatDate(data.Timestamp)}
                    </h3>
            </div>
            <div className="book">
                <div className="data">
                    <div className="item">
                        <p>Bid</p>
                        <h2>{currencyFormatter.format(data.Bid)}</h2>
                    </div>
                    <div className="item ask">
                        <p>Ask</p>
                        <h2>{currencyFormatter.format(data.Ask)}</h2>
                    </div>
                    <div className="item">
                        <p>Last</p>
                        <h2>{currencyFormatter.format(data.Last)}</h2>
                    </div>
                    <div className="item">
                        <p>Timestamp</p>
                        <h2>{formatTime(data.Timestamp)}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;