package main

import (
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Asset struct {
	Name       string
	Return     float64
	Volatility float64
	Price      float64
	Spread     float64
}

func simulatePrice(asset *Asset) {
	dt := 1.0 / 252.0
	random := rand.NormFloat64()
	asset.Price = asset.Price * (1 + asset.Return*dt + asset.Volatility*math.Sqrt(dt)*random)
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error al establecer WebSocket:", err)
		return
	}
	defer conn.Close()

	asset := Asset{Name: "WTI", Return: 0.06, Volatility: 0.47, Price: 70.0, Spread: 0.1}
	ticker := time.NewTicker(200 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		simulatePrice(&asset)
		msg := map[string]interface{}{
			"Bid":       asset.Price - asset.Spread,
			"Ask":       asset.Price + asset.Spread,
			"Last":      asset.Price,
			"Timestamp": time.Now().Format("2006-01-02 15:04:05.000"),
		}
		if err := conn.WriteJSON(msg); err != nil {
			fmt.Println("Error al enviar datos:", err)
			break
		}
	}
}
