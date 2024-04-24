import pika, sys, os
import base64
from PIL import Image
import face_recognition
from numpy import asarray
import io
import numpy as np
from dotenv import load_dotenv
import sys
import json


def find_faces_in_image(img_data, rabbitmq_connection_string):
    decoded_image = base64.decodebytes(img_data)
    image = Image.open(io.BytesIO(decoded_image))
    c = asarray(image)
    try:
        if(face_recognition.face_locations(c) and  face_recognition.face_encodings(c)):
            face_locations = face_recognition.face_locations(c)
            face_encoding = face_recognition.face_encodings(c)[0]                                                                           
            top, right, bottom, left = face_locations[0]            
            new_respond = make_json(top, right, bottom, left, face_encoding)
            # print(new_respond)   
            sys.stdout.flush()
            send_response(new_respond, rabbitmq_connection_string)
        else: 
            respond_data = make_faileure_json()
            print("face not recon on image: ",respond_data)   
            sys.stdout.flush()
            send_response(respond_data, rabbitmq_connection_string)
    except Exception as e:
        print("Error in exception:", str(e))
        sys.stdout.flush()
        respond_data = make_faileure_json()
        send_response(respond_data, rabbitmq_connection_string)
    
def make_json( top, right, bottom, left, encoding):
    print(top,right,bottom,left)
    list_data = encoding.tolist()
    data={"top":top,
          "right":right,
          "bottom":bottom,
          "left":left,
          "encoding":list_data}
    json_data = json.dumps(data)
    return json_data
     
def make_faileure_json():
    print("Face not detect!")
    data={"top":1,
          "right":1,
          "bottom":1,
          "left":1,
          "encoding":[1]}
    json_data = json.dumps(data)
    return json_data
    
def send_response(message,rabbitmq_connection_string):
    #connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_connection_string))
    channel = connection.channel()
    channel.queue_declare(queue='response_from_face_recon')
    channel.basic_publish(exchange='', routing_key='response_from_face_recon', body=message)
    print(f"Image send to queue")
    sys.stdout.flush()
    connection.close()


def main():
    rabbitmq_connection_string = os.getenv("RABBITMQ_CONNECTION_STRING")
    #connection = pika.BlockingConnection(pika.ConnectionParameters(host="rabbitmq-container", port=5672))
    connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_connection_string))
    channel = connection.channel()
    channel.queue_declare(queue='result')

    def callback(ch, method, properties, body):
        print(f" [x] Received image")
        sys.stdout.flush()
        find_faces_in_image(body, rabbitmq_connection_string)
    channel.basic_consume(queue='result', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    sys.stdout.flush()
    channel.start_consuming()

if __name__ == '__main__':
    load_dotenv("dev.env")
    main()
