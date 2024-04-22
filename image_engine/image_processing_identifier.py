import pika, sys, os
import base64
from PIL import Image
import face_recognition
from numpy import asarray
import io
import numpy as np
from dotenv import load_dotenv
import sys



#rabbitmq_host = os.getenv('RABBITMQ_HOST')
#rabbitmq_port = os.getenv('RABBITMQ_PORT')        



def find_faces_in_image(img_data, rabbitmq_connection_string):
    decoded_image = base64.decodebytes(img_data)
    image = Image.open(io.BytesIO(decoded_image))
    c = asarray(image)
    try:
        if(face_recognition.face_locations(c) and  face_recognition.face_encodings(c)):
            face_locations = face_recognition.face_locations(c)
            face_encoding = face_recognition.face_encodings(c)[0]

            encoding_from_file, names = get_face_encoding_from_local_files()
            indexy = []
            for j in range(len(encoding_from_file)):
                face_distances = face_distance(encoding_from_file[j], face_encoding)
                indexy.append(face_distances)            
                #print(f"face_distances for {names[j]}",face_distances)
            best_score = np.amin(indexy)
            best_match_index = np.argmin(indexy)
                #print(f"Face of {names[best_match_index]} was found; best score {best_score}")
            top, right, bottom, left = face_locations[0]
            if(best_score>0.5):
                respond_data = "Unknown"+"&"+ str(top)+","+str(right)+","+str(bottom)+","+str(left) 
            else: respond_data =  names[best_match_index]+"&"+ str(top)+","+str(right)+","+str(bottom)+","+str(left)
            print(respond_data)   
            sys.stdout.flush()
            #image.show()    
            send_response(respond_data, rabbitmq_connection_string)
        else: 
            respond_data = "-"+"&"+ "-,-,-,-" 
            print("from else: ",respond_data)   
            sys.stdout.flush()
            send_response(respond_data, rabbitmq_connection_string)
    except Exception as e:
        print("Wystąpił błąd z exception:", str(e))
        sys.stdout.flush()
        respond_data = "-"+"&"+ "-,-,-,-" 
        send_response(respond_data, rabbitmq_connection_string)
    
    
def face_distance(face_encodings, face_to_compare):
    """
    Given a list of face encodings, compare them to a known face encoding and get a euclidean distance
    for each comparison face. The distance tells you how similar the faces are.
    :param face_encodings: List of face encodings to compare
    :param face_to_compare: A face encoding to compare against
    :return: A numpy ndarray with the distance for each face in the same order as the 'faces' array
    """
    return np.linalg.norm(face_encodings - face_to_compare)
    
def get_face_encoding_from_local_files():
    with open('local_db_encoding.txt', 'r') as f:
        text = f.read()
    text = text.split("$")
    
    np_arrays_from_file = []
    for obj in text:
        array = np.fromstring(obj,sep=' ', dtype=float)
        np_arrays_from_file.append(array)
    
    with open('local_db_names.txt', 'r') as f:
        names = f.read()
    names = names.split("\n")
    return np_arrays_from_file, names
    
def save_face_encoding_to_string_and_txt_file(face_encoding):
    np.savetxt('test1.txt', face_encoding)
    with open('test1.txt', 'r') as f:
        text = f.read()
    with open('local_db_encoding.txt', 'a') as f:
        f.write(text)
        f.write("$")
    
    
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
