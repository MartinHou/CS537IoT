import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from config import OPENAI_KEY
from datetime import datetime
import re, os

app = Flask(__name__)
CORS(app)

# Setup your OpenAI API key
FILE_PATH = 'data.json'
client = OpenAI(api_key=OPENAI_KEY)


@app.route('/save', methods=['POST'])
def compare_images():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid or missing JSON'}), 400
        img1, img2 = data.get('image1'), data.get('image2')
        print("Image urls:", img1, img2, sep='\n')
        prompt = '''
        You are a master of nutrition and image processor. Your response should only contain the nutrition of ALL the missing food and drinks in the 2nd image compared to the 1st in a json format described below. Try to find the missing food and drinks as many as possible. Remember not to add extra spaces, indent, or new line in the output json. 
        =======
        Nutrition should include:
        calories (kcal)  
        sugar (g)  
        protein (g)  
        fat (g)  
        carbohydrates (g)  
        fiber (g)  
        sodium (mg)  
        cholesterol (mg)  
        =======
        Example response:
        ###START###{"consumed_items":[{"name":"Item name","calories":0,"sugar":0,"protein":0,"fat":0,"carbohydrates":0,"fiber":0,"sodium":0,"cholesterol":0},{"name":"Item name2","calories":0,"sugar":0,"protein":0,"fat":0,"carbohydrates":0,"fiber":0,"sodium":0,"cholesterol":0}],"total_nutrition":{"calories":0,"sugar":0,"protein":0,"fat":0,"carbohydrates":0,"fiber":0,"sodium":0,"cholesterol":0}}###END###  
        '''

        # Prepare the messages payload for the OpenAI API
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img1
                        }
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img2
                        }
                    }
                ],
            }
        ]

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages
        )

        # response_content = """
        # ###START###{"consumed_items":[{"name":"Tomato","calories":22,"sugar":3,"protein":1,"fat":0.2,"carbohydrates":5,"fiber":1.5,"sodium":5,"cholesterol":0},{"name":"Extra Snack Cake","calories":150,"sugar":12,"protein":1,"fat":6,"carbohydrates":20,"fiber":0.5,"sodium":150,"cholesterol":5}],"total_nutrition":{"calories":172,"sugar":15,"protein":2,"fat":6.2,"carbohydrates":25,"fiber":2,"sodium":155,"cholesterol":5}}###END###
        # """
        print('GPT response get')

        response_content = response.choices[0].message.content
        match = re.search(r"###START###(.*?)###END###", response_content, re.DOTALL)
        if not match:
            return jsonify({'message': "No JSON found between ###START### and ###END###"}), 500
        nutrition_json = match.group(1)
        current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        json_data = json.loads(nutrition_json)
        json_data["date"] = current_date
        append_json(json_data)
        print(json_data)
        return json_data, 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/advice', methods=['GET'])
def get_advice():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            print(json.dumps(data))
            prompt = "According to the nutrition consumption records, give a brief advice on my diet." \
                     "=============" \
                     + json.dumps(data)
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt}
                    ],
                }
            ]

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            response_content = response.choices[0].message.content
            print(response_content)
            return response_content, 200
        except json.JSONDecodeError:
            return "Json Parse Error", 500


@app.route('/load', methods=['GET'])
def generate():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            return data, 200
        except json.JSONDecodeError:
            return "Json Parse Error", 500


def append_json(new_json):
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r", encoding="utf-8") as file:
            try:
                existing_data = json.load(file)
            except json.JSONDecodeError:
                existing_data = []
    else:  # File not exists
        existing_data = []

    if not isinstance(existing_data, list):
        existing_data = []

    existing_data.append(new_json)

    with open(FILE_PATH, "w", encoding="utf-8") as file:
        json.dump(existing_data, file, indent=4, ensure_ascii=False)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
