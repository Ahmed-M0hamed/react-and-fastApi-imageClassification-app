from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf 

app = FastAPI() 


origins = [
    "http://localhost:3000",
]

CLASS_NAMES = {0 : "airplane" ,  
    1:'automobile' , 
    2 : 'berd' , 
    3 : 'cat' , 
    4 : 'deer' , 
    5 :  'dog' , 
    6 : 'frog' , 
    7 : 'horse' , 
    8 : 'ship' , 
    9 : 'truck'
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# @app.on_event("startup") 
# def load_model() : 
#     global model
model =  tf.keras.models.load_model('../model/model_v0')


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict/")
async def predict(
    file: UploadFile = File(...)
    ):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    img = tf.image.resize(img_batch , [32, 32]) 
    img = img /255 
    predictions = model.predict(img)
    return CLASS_NAMES[np.argmax(predictions[0])]
    # return 'model has not loaded yet'


# if __name__ == "__main__":
    # uvicorn.run(app, host='localhost', port=8000)
