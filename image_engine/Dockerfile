FROM python:3.8
RUN pip install --upgrade pip
RUN pip install cmake
RUN pip install dlib==19.24.2

WORKDIR /app

COPY . .

RUN pip install -r /app/requirements.txt


CMD [ "python3", "image_processing_identifier.py" ]
