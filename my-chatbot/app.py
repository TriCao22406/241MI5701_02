from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
import requests
import ollama
import faiss
import numpy as np

app = FastAPI()

# Thêm CORS middleware để cho phép Angular truy cập API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tải lại index từ file Faiss
index = faiss.read_index('../my-chatbot/faiss_product_index.index')

# Đọc danh sách từ file txt
with open('../my-chatbot/product_ids.txt', 'r') as file:
    product_ids = [line.strip() for line in file]

embeddings_data = []
with open('../my-chatbot/embeddings_data.txt', 'r', encoding='utf-8') as file:
    for line in file:
        embeddings_data.append(json.loads(line.strip()))

# Định nghĩa mô hình dữ liệu cho request từ người dùng
class UserMessage(BaseModel):
    message: str

# Định nghĩa mô hình dữ liệu cho phản hồi từ chatbot
class BotResponse(BaseModel):
    response: str
    time: str




def query_prompt(query):
    query_embedding_response = ollama.embeddings(
        model='nomic-embed-text',
        prompt=query
    )
    query_embedding = query_embedding_response.get('embedding')

    if query_embedding is not None:
        query_vector = np.array(query_embedding, dtype='float32')
        # Tìm kiếm trong Faiss
        k = 5  # Số lượng kết quả cần tìm
        distances, indices = index.search(np.array([query_vector]), k)
        
        # In ra kết quả tìm kiếm
        print("Kết quả tìm kiếm:")
        context = "\n"
        for i, idx in enumerate(indices[0]):
            if idx != -1:  # Kiểm tra xem index có hợp lệ hay không
                product_id = product_ids[idx]
                product_info = next((item for item in embeddings_data if item["product_id"] == product_id), None)
                if product_info:
                    context += product_info['content'] + "\n################"
    else:
        print("Không thể tạo embedding cho truy vấn.")
    
    prompt = f"""
You are an AI assistant specialized in providing detailed and contextually relevant answers. Use the following context and user query to generate your response in Vietnamese:

Context: {context}

Query: {query}

Based on the context and query, provide a concise and accurate answer in Vietnamese.
    """


    return prompt

# Hàm sử dụng Ollama để sinh ra câu trả lời
def generate_response_ollama(user_message: str) -> str:
    model = 'llama3.2:3b'
    # Thực hiện truy vấn và viết prompt 
    prompt = query_prompt(user_message)
    try:
        r = requests.post('http://localhost:11434/api/generate',
                          json={
                              'model': model,
                              'prompt': prompt
                          },
                          stream=True)
        r.raise_for_status()

        response_text = ""
        for line in r.iter_lines():
            body = json.loads(line)
            response_part = body.get('response', '')
            # the response streams one token at a time, append that as we receive it
            response_text += response_part

            if 'error' in body:
                raise Exception(body['error'])

            if body.get('done', False):
                return response_text

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Ollama: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API nhận tin nhắn từ người dùng và trả lời
@app.post("/chat", response_model=BotResponse)
async def chat(user_message: UserMessage):
    response_text = generate_response_ollama(user_message.message)
    current_time = datetime.now().strftime("%H:%M")
    return BotResponse(response=response_text, time=current_time)
