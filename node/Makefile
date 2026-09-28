-include .env
export

build:
	go build -o bin/ecoa ./cmd/ecoa

run: build
	./bin/ecoa

test:
	go test -v ./...
