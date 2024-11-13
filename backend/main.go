package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/ws", wsHandler)
	fmt.Println("Servidor iniciado en :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Error al iniciar el servidor:", err)
	}
}
