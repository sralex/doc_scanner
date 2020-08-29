From ubuntu:18.04

RUN apt-get update
RUN apt-get install python python3-pip -y
RUN mkdir /app
COPY app/ /app/

RUN pip3 install -r /app/requirements.txt



ENTRYPOINT ["gunicorn","--workers=2", "--bind=0.0.0.0:9000","app.main:app"]