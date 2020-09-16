# Document scanner with deployment environment

This is a small project, which can help us turn a photo of a document into a more realistic document.

Here you will find an `` app/main.py `` file that contains all the functionalities related to the app.

## How to use

## Prerequisites

* Docker
* docker-compose

## Instructions

In this repository, copy the file named .env.example to .env and adjust file variables.

```
cp .env.example .env
```

Open a terminal, run the built container and build the code.

```
sudo docker-compose up --build
```

wait until installation is complete (the first time it can take a couple of minutes), then go to localhost:9000, enjoy!.

Debug mode (python 3.6 >= strongly recommended, and use a virtual env).

```
cd app
pip3 install -r requirements.txt 
python main.py
```


Demo:<br/>
![image](https://github.com/sralex/doc_scanner/blob/master/preview.png)
