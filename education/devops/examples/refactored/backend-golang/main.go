package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	iface := os.Getenv("IFACE")
	if len(iface) == 0 {
		iface = "localhost"
	}
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8082"
	}
	msg := os.Getenv("MESSAGE")
	if len(msg) == 0 {
		msg = "Hello World"
	}

	fmt.Printf("Listening at: http://%v:%v", iface, port)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Headers:", "*")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		fmt.Fprintf(w, "%v", msg)
	})
	http.ListenAndServe(fmt.Sprintf("%v:%v", iface, port), nil)
}
